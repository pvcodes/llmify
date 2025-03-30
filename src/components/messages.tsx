'use client';

import equal from 'fast-deep-equal';
// import { motion } from 'framer-motion';
// import { RefreshCcw, BotIcon } from 'lucide-react';
import React, { memo, useEffect } from 'react';

// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
import { useProviderApiKey } from '@/hooks/use-provider-api-key';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';

import { AiResponseError, AiResponseLoading } from './ai-response';
import Markdown from './chat/markdown';
import UserMessage from './chat/user-message';

import type { ChatRequestOptions, UIMessage } from 'ai';

interface PureMessagesProps {
  messages: UIMessage[];
  handleEditMessageSubmit: (
    e: React.FormEvent,
    messageId: string,
    messageIndex: number,
    content: string
  ) => void;
  error: Error | undefined;
  handleRetry: () => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
}

const PureMessages = ({
  messages,
  handleEditMessageSubmit,
  error,
  handleRetry,
  status,
  reload,
}: PureMessagesProps) => {
  const [containerRef, messageEndRef] = useScrollToBottom<HTMLDivElement>();

  const { dataToSendToAI } = useProviderApiKey();

  useEffect(
    () => {
      const fetchInitialResponse = async () => {
        if (messages.length === 1) {
          await reload({
            body: { modelConfig: (await dataToSendToAI()).modelConfig },
            headers: {
              'x-provider-key': (await dataToSendToAI()).apiKey as string,
            },
            allowEmptySubmit: true,
          });
        }
      };

      fetchInitialResponse();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      ref={containerRef}
      className='relative max-w-4xl h-[calc(100vh-100px)] overflow-auto scrollbar-hidden'
    >
      {messages.map((message, index) => (
        <div key={message.id} className='flex flex-col my-2'>
          {message.role === 'assistant' ? (
            <Markdown message={message} />
          ) : (
            <UserMessage
              messageContent={message.content}
              handleEditMessageSubmit={handleEditMessageSubmit}
              messageId={message.id}
              messageIndex={index}
            />
          )}
        </div>
      ))}
      {status === 'submitted' && <AiResponseLoading />}
      {status === 'error' && <AiResponseError error={error} handleRetry={handleRetry} />}
      <div ref={messageEndRef} className='shrink-0 min-w-[24px] min-h-36' />
    </div>
  );
};

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  return true;
});
