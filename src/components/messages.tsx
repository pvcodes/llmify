import equal from 'fast-deep-equal';
import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useEffect, useRef, useLayoutEffect } from 'react';

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
}

function PureMessages({
  messages,
  handleEditMessageSubmit,
  error,
  handleRetry,
  status,
  reload,
}: PureMessagesProps) {
  const { dataToSendToAI } = useProviderApiKey();
  const containerRef = useRef<HTMLDivElement>(null);

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div ref={containerRef} className='flex-1 overflow-y-auto px-4 py-4'>
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='py-2'
          >
            {message.role === 'assistant' ? (
              <Markdown message={message} />
            ) : (
              <UserMessage
                message={message}
                index={index}
                handleEditMessageSubmit={handleEditMessageSubmit}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {status === 'submitted' && <AiResponseLoading />}
      {status === 'error' && <AiResponseError error={error} handleRetry={handleRetry} />}
    </div>
  );
}

export const Messages = memo(PureMessages, equal);
