import { getServerSession } from 'next-auth';

import { getIntitalMessages } from '@/actions/chat-message';
import { getUserTierDetails } from '@/actions/misc';
import { authOptions } from '@/app/(auth)/auth';
import Chat from '@/components/chat';
import { ChatNotFound } from '@/components/chat-notfound';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const user = (await getServerSession(authOptions))?.user;
  const { id } = await params;
  let messages;
  let userBilling;

  try {
    messages = await getIntitalMessages(id);
    userBilling = await getUserTierDetails(user?.email as string);
    if (!userBilling) return;
  } catch (err) {
    console.error(err);
    return <ChatNotFound id={id} />;
  }
  const isNew = messages.length === 1 && messages[0].role === 'user'; // new chat aai hai bhai, generate krwao

  return <Chat initialMessages={messages} id={id} isNew={isNew} userBilling={userBilling} />;
}
