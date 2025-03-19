import { generateId, Message, streamText } from "ai";
import { NextResponse } from "next/server";
import db from "@/db";
import {
	ModelProvidersViaTier,
	type ModelProviderType,
	type Models,
} from "@/lib/ai/models";
import { payloadSchema, PayloadType } from "./schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(auth)/auth";
import { MAX_FREE_TOKEN } from "@/lib/constant";
import { model } from "@/lib/ai";
import { generalPrompt } from "@/lib/ai/prompt";

export async function POST(req: Request) {
	try {
		const user = (await getServerSession(authOptions))?.user;

		const payload: PayloadType = await req.json().catch(() => ({}));
		const parseResult = payloadSchema.safeParse(payload);
		if (!parseResult.success) {
			throw new Error("Data not valid");
		}
		const { id: chatId, modelConfig, messages, apiKey } = parseResult.data;

		let billing = await db.billing.findFirst({
			where: { user: { email: user?.email } },
		});

		if (!billing) {
			billing = await db.billing.create({
				data: {
					user: {
						connect: {
							email: user?.email,
						},
					},
				},
			});
		}

		// validations if not api key check has valid tier
		if (
			!apiKey &&
			!ModelProvidersViaTier[billing.level].includes(modelConfig.provider)
		) {
			throw new Error(
				"Not a valid tier, please add your api key or change the model"
			);
		}

		if (
			!apiKey &&
			billing.level === "FREE" &&
			billing.tokenUsage >= MAX_FREE_TOKEN
		)
			throw new Error(
				"Token Limit exceeded, Please add upgrade your tier"
			);

		const modelToUse = model(
			modelConfig.provider,
			modelConfig.model.value as Models<ModelProviderType>,
			apiKey ? false : true,
			apiKey
		);

		if (messages.length > 1) {
			const userMessageFromBody = messages.slice(-1).pop() as Message;
			const userMessage = {
				id: userMessageFromBody?.id ?? generateId(),
				content: userMessageFromBody.content,
				chatId,
				role: userMessageFromBody.role,
			};
			await db.message.create({
				data: userMessage,
			});
		}

		// TODO for v2: Filter out user messages, then check if more messages are more than 10 messages, create a summary of those messages, and update summary in db @chat table

		const result = streamText({
			model: modelToUse,
			messages,
			system: generalPrompt,
			// prompt: generalPrompt,
			onFinish: async (res) => {
				if (!apiKey) {
					// using our service
					const token = res.usage.totalTokens;
					await db.billing.update({
						where: {
							id: billing.id,
						},
						data: {
							tokenUsage: {
								increment: token,
							},
						},
					});
				}

				await db.message.create({
					data: {
						id: res.response.id,
						content: res.text,
						role: "assistant",
						chatId,
					},
				});
			},
		});

		return result.toDataStreamResponse();
	} catch (error) {
		return NextResponse.json((error as Error).message, { status: 400 });
	}
}
