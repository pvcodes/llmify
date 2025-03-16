import { getServerSession } from "next-auth";
import db from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(auth)/auth";
import { payloadSchema, type PayloadType } from "./schema";

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
		const newChat = await db.chat.create({
			data: {
				id,
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
