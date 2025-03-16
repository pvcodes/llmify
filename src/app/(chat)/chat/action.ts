"use server";
import db from "@/db";
import { revalidatePath } from "next/cache";

export const getIntitalMessages = async (chatId: string) => {
	try {
		const chatWithMessages = await db.chat.findUniqueOrThrow({
			where: { id: chatId },
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		const messages = chatWithMessages.messages;

		return messages;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const getChats = async (email: string) => {
	try {
		const chats = await db.chat.findMany({
			where: {
				user: {
					email,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return chats;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export async function revalidateSidebar() {
	revalidatePath("/", "layout");
}
