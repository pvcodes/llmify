import { generateId, streamText } from "ai";
import { NextResponse } from "next/server";
import db from "@/db";
import {
	ModelProvidersViaTier,
	type ModelProviderType,
	type Models,
} from "@/lib/ai/models";
import { payloadSchema } from "./schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(auth)/auth";
import { MAX_FREE_TOKEN } from "@/lib/constant";
import { model } from "@/lib/ai";
import { generalPrompt } from "@/lib/ai/prompt";

export async function POST(req: Request) {
	try {
		// Step 1: Get the current user and parse the incoming request
		const [sessionResult, payloadRaw] = await Promise.all([
			getServerSession(authOptions),
			req.json().catch(() => ({})),
		]);
		const user = sessionResult?.user;

		// Step 2: Validate the request data
		const parseResult = payloadSchema.safeParse(payloadRaw);
		if (!parseResult.success) throw new Error("Data not valid");
		const {
			id: chatId,
			modelConfig,
			messages,
			apiKey,
			messageId,
		} = parseResult.data;

		// Step 3: Find or create the user's billing record
		let billing = await db.billing.findFirst({
			where: { user: { email: user?.email } },
		});

		if (!billing) {
			billing = await db.billing.create({
				data: { user: { connect: { email: user?.email } } },
			});
		}

		// Step 4: Check if the user can use the requested model
		if (!apiKey) {
			// If no API key provided, check if user's tier allows this model
			const canUseModel = ModelProvidersViaTier[billing.level].includes(
				modelConfig.provider
			);
			if (!canUseModel) {
				throw new Error(
					"Your tier doesn't support this model. Please add your API key or change models."
				);
			}

			// Check if free tier user has exceeded token limit
			if (
				billing.level === "FREE" &&
				billing.tokenUsage >= MAX_FREE_TOKEN
			) {
				throw new Error(
					"You've reached your free token limit. Please upgrade your plan."
				);
			}
		}

		// Step 5: Set up the AI model
		const modelToUse = model(
			modelConfig.provider,
			modelConfig.model.value as Models<ModelProviderType>, // validation check in schema, please check,
			!apiKey, // Use our API key if user didn't provide one
			apiKey
		);

		// Step 6: Handle message editing or creation
		if (messageId) {
			// If editing an existing message
			const targetMessage = await db.message.update({
				where: { id: messageId },
				data: { content: messages[messages.length - 1].content },
				select: { createdAt: true },
			});

			// Delete all messages that came after the edited message
			if (targetMessage) {
				await db.message.deleteMany({
					where: {
						chatId,
						createdAt: { gt: targetMessage.createdAt },
					},
				});
			}
		} else if (messages.length > 1) {
			// If creating a new message
			const userMessage = messages[messages.length - 1];
			await db.message.create({
				data: {
					id: userMessage?.id ?? generateId(),
					content: userMessage.content,
					chatId,
					role: userMessage.role,
				},
			});
		}

		// Step 7: Stream the AI response
		return streamText({
			model: modelToUse,
			messages,
			system: generalPrompt,
			onFinish: async (res) => {
				// When the AI finishes responding:

				// Update token usage if using our API
				if (!apiKey) {
					await db.billing.update({
						where: { id: billing.id },
						data: {
							tokenUsage: { increment: res.usage.totalTokens },
						},
					});
				}

				// Save the AI's response to the database
				await db.message.create({
					data: {
						id: res.response.id,
						content: res.text,
						role: "assistant",
						chatId,
					},
				});
			},
		}).toDataStreamResponse();
	} catch (error) {
		return NextResponse.json((error as Error).message, { status: 400 });
	}
}
