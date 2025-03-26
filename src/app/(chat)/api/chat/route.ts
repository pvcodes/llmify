import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { generateId, generateText, streamText } from "ai";
import { authOptions } from "@/app/(auth)/auth";
import {
	ModelProvidersViaTier,
	ModelProviderType,
	Models,
} from "@/lib/ai/models";
import { MAX_FREE_TOKEN } from "@/lib/constant";
import { model } from "@/lib/ai";
import { chatSummarisePrompt, generalPrompt } from "@/lib/ai/prompt";
import { BillingLevel, Message } from "@prisma/client";
import { type Message as AiMessage } from "ai";
import { payloadSchema } from "./schema";
import { createAnthropic } from "@ai-sdk/anthropic";

export async function POST(req: NextRequest) {
	try {
		// Step 1: Get the current user and parse the incoming request
		const [sessionResult, payloadRaw] = await Promise.all([
			getServerSession(authOptions),
			req.json().catch(() => ({})),
		]);
		const rawApiKey = req.headers.get("x-provider-key");

		const user = sessionResult?.user;

		// Step 2: Validate the request data
		const parseResult = payloadSchema.safeParse({
			...payloadRaw,
			apiKey: rawApiKey,
		});
		if (!parseResult.success) throw new Error("Data not valid");
		const {
			id: chatId,
			modelConfig,
			messages,
			apiKey,
			editedMessageId,
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
			isPremiumUser(billing.level, modelConfig.provider),
			apiKey
		);

		const userMessageId = generateId();

		// Step 6: Handle message editing or creation
		if (editedMessageId) {
			// If editing an existing message
			const targetMessage = await db.message.update({
				where: { id: editedMessageId },
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
					id: userMessageId,
					content: userMessage.content,
					chatId,
					role: userMessage.role,
				},
			});
		}

		// check if summarization required
		const messagesToAI = await chatSummarise(
			billing.id,
			chatId,
			messages,
			!!apiKey
		);

		// Step 7: Stream the AI response
		return streamText({
			model: modelToUse,
			messages: messagesToAI as AiMessage[],
			system: generalPrompt,
			onFinish: async (res) => {
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
			onError: (err) => {
				console.log(err);
			},
		}).toDataStreamResponse();
	} catch (error) {
		return NextResponse.json((error as Error).message, { status: 400 });
	}
}

const isPremiumUser = (tier: BillingLevel, provider: ModelProviderType) => {
	return ModelProvidersViaTier[tier].includes(provider);
};

const chatSummarise = async (
	billingId: number,
	chatId: string,
	messages: Message[],
	hasToUpdateBilling: boolean
) => {
	try {
		console.log("aaya for summary");
		const aiSummaryMessage = (content: string): AiMessage => ({
			id: "pvcodes",
			role: "assistant",
			content: `This is the summary of existing chat:\n${content}\n\n`,
			parts: [
				{
					type: "text",
					text: `This is the summary of existing chat:\n${content}\n\n`,
				},
			],
		});

		// Scenario 1: Less than 10 messages
		if (messages.length < 10) return messages;

		// Scenario 2: Exactly 10 messages (initial summary)
		if (messages.length === 10) {
			const { summary, usage } = await summarize("", messages);
			await db.chatSummary.create({ data: { chatId, summary } });
			if (hasToUpdateBilling) {
				await db.billing.update({
					where: { id: billingId },
					data: {
						tokenUsage: { increment: usage.totalTokens },
					},
				});
			}
			return [aiSummaryMessage(summary), ...messages.slice(-10)];
		}

		// Retrieve existing summary if needed
		const chatSummary = await db.chatSummary.findUnique({
			where: { chatId },
		});


		// Ensure chatSummary exists before accessing .summary
		const existingSummary = chatSummary?.summary || "";

		// Scenario 3: Multiple of 10 messages
		if (messages.length % 10 === 0) {
			const { summary: newSummary, usage } = await summarize(
				existingSummary,
				messages
			);
			await db.chatSummary.upsert({
				where: { chatId },
				update: { summary: newSummary },
				create: { chatId, summary: newSummary },
			});
			if (hasToUpdateBilling) {
				await db.billing.update({
					where: { id: billingId },
					data: {
						tokenUsage: { increment: usage.totalTokens },
					},
				});
			}
			return [aiSummaryMessage(newSummary), ...messages.slice(-10)];
		}

		// Scenario 4: Other message counts
		return [aiSummaryMessage(existingSummary), ...messages.slice(-10)];
	} catch (error) {
		console.error("Error in chatSummarise:", error);
		return messages; // Return messages array to prevent breaking the app
	}
};

const summarize = async (existingSummary: string, messages: Message[]) => {
	const anthropic = createAnthropic({
		apiKey: process.env.API_KEY_ANTHROPIC,
	});

	const { text: summary, usage } = await generateText({
		model: anthropic("claude-3-5-haiku-latest"),
		prompt: chatSummarisePrompt(existingSummary, messages),
	});

	return { summary, usage };
};
