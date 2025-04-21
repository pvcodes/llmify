import { permanentRedirect } from 'next/navigation';

import { getUserBilling } from '@/actions/billing';
import { createNewChat, getRecentChat } from '@/actions/chat-message';
import { getAuthenticatedUser } from '@/actions/misc';
import NewChat from '@/components/new-chat';

import type { BillingLevel, Chat, Message } from '@prisma/client';

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string } | undefined>;
}) {
  const user = await getAuthenticatedUser();
  const prompt = (await searchParams)?.q;
  if (prompt) {
    const response = await createNewChat(prompt);
    if (response.success) permanentRedirect(`/chat/${response.id}`);
  }

  const chats = (await getRecentChat(user.email)) as Array<Chat & { messages: Message[] }>;
  const tier = (await getUserBilling(user.id))?.level as BillingLevel;
  return <NewChat recentChats={chats} tier={tier} />;
}
