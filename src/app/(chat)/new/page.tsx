import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/(auth)/auth';
import NewChat from '@/components/new-chat';

import { getRecentChat } from './action';

import type { Chat, Message } from '@prisma/client';

export default async function NewChatPage() {
  const session = await getServerSession(authOptions);
  const chats = (await getRecentChat(session!.user.email)) as Array<Chat & { messages: Message[] }>;
  return <NewChat recentChats={chats} />;
}
