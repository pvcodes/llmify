import { getIntitalMessages } from '@/actions/chat-message';
import { getAuthenticatedUser, getUserTierDetails } from '@/actions/misc';
import Chat from '@/components/chat';
import { ChatNotFound } from '@/components/chat-notfound';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  const { id } = await params;

  let messages;
  let userBilling;

  try {
    messages = await getIntitalMessages(id);
    userBilling = await getUserTierDetails(user.email);
    if (!userBilling) return <ChatNotFound id={id} />;
  } catch {
    return <ChatNotFound id={id} />;
  }

  return <Chat initialMessages={messages} id={id} userBilling={userBilling} />;
}
