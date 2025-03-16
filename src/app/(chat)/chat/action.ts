import db from "@/db";

export const getIntitalMessages = async (chatId: string) => {
	try {
		const chatWithMessages = await db.chat.findUniqueOrThrow({
			where: { id: chatId },
			include: { messages: true }, // Fetch messages along with chat
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
		});

		return chats;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
