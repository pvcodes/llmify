'use client';

import equal from 'fast-deep-equal';
import React, { memo, useEffect } from 'react';

import { useProviderApiKey } from '@/hooks/use-provider-api-key';

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
  containerRef: React.RefObject<HTMLDivElement | null>;
  endRef: React.RefObject<HTMLDivElement | null>;
}

const PureMessages = ({
  messages,
  handleEditMessageSubmit,
  error,
  handleRetry,
  status,
  reload,
  containerRef,
  endRef,
}: PureMessagesProps) => {
  const { dataToSendToAI } = useProviderApiKey();

  useEffect(
    () => {
      const fetchInitialResponse = async () => {
        await reload({
          body: { modelConfig: (await dataToSendToAI()).modelConfig },
          headers: {
            'x-provider-key': (await dataToSendToAI()).apiKey as string,
          },
        });
      };

      if (messages.length === 1) fetchInitialResponse();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      ref={containerRef}
      className='relative max-w-4xl h-[calc(100vh-100px)] overflow-auto scrollbar-hidden px-2 md:px-4'
    >
      {messages.map((message, index) => (
        <div key={message.id} className='flex flex-col my-2'>
          {message.role === 'assistant' ? (
            <Markdown message={message} />
          ) : (
            <UserMessage
              message={message}
              index={index}
              handleEditMessageSubmit={handleEditMessageSubmit}
            />
          )}
        </div>
      ))}
      {status === 'submitted' && <AiResponseLoading />}
      {status === 'error' && <AiResponseError error={error} handleRetry={handleRetry} />}
      <div ref={endRef} className='shrink-0 min-w-[24px] min-h-36' />
    </div>
  );
};

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  return true;
});
