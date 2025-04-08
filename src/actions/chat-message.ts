'use server';

import { revalidatePath } from 'next/cache';

import db from '@/db';
import { CHAT_TITLE_PROMPT } from '@/lib/ai/prompt';
import { generateChatId } from '@/lib/utils';

import { generateFromAi } from './ai';
import { getAuthenticatedUser } from './misc';

export const createNewChat = async (prompt: string) => {
  try {
    const user = await getAuthenticatedUser();
    const id = generateChatId();
    const name = (await generateFromAi({ prompt, systemPrompt: CHAT_TITLE_PROMPT })) ?? 'Untitled';

    // TODO: MAKE TRANSCATION
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
        role: 'user',
      },
    });

    return { success: true, id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const updateChatName = async ({ chatId, name }: { chatId: string; name: string }) => {
  try {
    const user = await getAuthenticatedUser();
    await db.chat.update({
      where: {
        id: chatId,
        user: {
          email: user.email,
        },
      },
      data: { name },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getIntitalMessages = async (chatId: string) => {
  try {
    const chatWithMessages = await db.chat.findUniqueOrThrow({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
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
        createdAt: 'desc',
      },
    });

    return chats;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export async function revalidateSidebar() {
  revalidatePath('/', 'layout');
}

export const getRecentChat = async (userEmail: string) => {
  return db.chat.findMany({
    where: {
      user: {
        email: userEmail,
      },
    },
    take: 3, // Limit to 3 results
    orderBy: {
      createdAt: 'desc', // Sort by newest first
    },
    include: {
      messages: {
        where: {
          role: 'user',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          content: true,
          createdAt: true,
        },
      },
    },
  });
};
