import { getRecentChat } from '@/actions/chat-message';
import { getAuthenticatedUser } from '@/actions/misc';
import NewChat from '@/components/new-chat';

import type { Chat, Message } from '@prisma/client';

export default async function NewChatPage() {
  const user = await getAuthenticatedUser();
  const chats = (await getRecentChat(user.email)) as Array<Chat & { messages: Message[] }>; //TODO: Prisma automatically add Message type as it is part of same query
  return <NewChat recentChats={chats} />;
}
