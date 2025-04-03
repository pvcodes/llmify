import { getServerSession } from 'next-auth';

import { getRecentChat } from '@/actions/chat-message';
import { authOptions } from '@/app/(auth)/auth';
import NewChat from '@/components/new-chat';

import type { Chat, Message } from '@prisma/client';

export default async function NewChatPage() {
  const session = await getServerSession(authOptions);
  const chats = (await getRecentChat(session!.user.email)) as Array<Chat & { messages: Message[] }>; //TODO: Prisma automatically add Message type as it is part of same query
  return <NewChat recentChats={chats} />;
}
