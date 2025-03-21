import { getServerSession } from "next-auth";
import db from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(auth)/auth";
import { payloadSchema, type PayloadType } from "./schema";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { CHAT_TITLE_PROMPT } from "@/lib/ai/prompt";

const anthropic = createAnthropic({ apiKey: process.env.API_KEY_ANTHROPIC });

export async function POST(req: NextRequest) {
	try {
		const user = (await getServerSession(authOptions))?.user;

		const payload: PayloadType = await req.json().catch(() => ({}));

		const parseResult = payloadSchema.safeParse(payload);
		if (!parseResult.success) {
			return NextResponse.json(
				{
					success: false,
					error: parseResult.error.message,
				},
				{ status: 400 }
			);
		}
		const { id, prompt } = parseResult.data;

		const { text: name } = await generateText({
			model: anthropic("claude-3-5-haiku-latest"),
			system: CHAT_TITLE_PROMPT,
			prompt,
		});

		const newChat = await db.chat.create({
			data: {
				id,
				name,
				user: {
					connect: {
						email: user?.email,
					},
				},
			},
		});
		await db.message.create({
			data: {
				id: `${id}-0`,
				content: prompt,
				chatId: newChat.id,
				role: "user",
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: {
					message:
						(error as Error)?.message ||
						(typeof error === "string" ? error : null) ||
						"Something went wrong",
				},
			},
			{ status: 400 }
		);
	}
}
