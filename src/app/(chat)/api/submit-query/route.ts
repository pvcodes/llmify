import { NextRequest, NextResponse } from "next/server";
import { payloadSchema, PayloadType } from "./schema";
import db from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(auth)/auth";

export async function POST(req: NextRequest) {
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
	const { message, subject } = parseResult.data;

	try {
		const user = (await getServerSession(authOptions))?.user;

		await db.supportQuery.create({
			data: {
				message,
				subject,
				user: {
					connect: {
						email: user?.email,
					},
				},
			},
		});
		return NextResponse.json({
			success: true,
		});
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
