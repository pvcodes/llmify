'use client';

import { useChat } from '@ai-sdk/react';
import { type Billing } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef } from 'react';
import { toast } from 'sonner';

import { useProviderApiKey } from '@/hooks/use-provider-api-key';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import useChatStore from '@/store/useChatStore';

import { Messages } from '../messages';

import ChatInputBox from './chat-inputbox';

import type { Message } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
interface ChatProps {
  id: string;
  initialMessages: Message[];
  isNew?: boolean;
  userBilling: Billing;
}

export default function Chat({ id, initialMessages, userBilling }: ChatProps) {
  const modelConfig = useChatStore((state) => state.config);
  const router = useRouter();

  // Rate limiting
  const lastSubmitTime = useRef(0);
  const RATE_LIMIT_MS = 1000;

  const { dataToSendToAI } = useProviderApiKey();

  // Chat state
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    status,
    error,
    reload,
    setInput,
    setMessages,
  } = useChat({
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
  });

  const handleValidations = useCallback(() => {
    const validationErrors = [
      { condition: !modelConfig, message: 'Choose a model from the navbar' },
      {
        condition: Date.now() - lastSubmitTime.current < RATE_LIMIT_MS,
        message: 'Please wait a moment before sending another message',
      },
      {
        condition: status === 'streaming',
        message: 'Assistant is still typing!',
      },
    ];
    const error = validationErrors.find((validation) => validation.condition);
    return error;
  }, [modelConfig, status]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const error = handleValidations();
      if (error) return toast(error.message);

      lastSubmitTime.current = Date.now();

      handleSubmit(e, {
        body: {
          modelConfig: (await dataToSendToAI()).modelConfig,
        },
        headers: {
          'x-provider-key': (await dataToSendToAI()).apiKey as string,
        },
      });

      router.refresh();
    },
    [handleValidations, handleSubmit, router, dataToSendToAI]
  );

  // Retry handler
  const handleRetry = useCallback(async () => {
    const error = handleValidations();
    if (error) return toast(error.message);

    if (status === 'error') {
      reload({
        body: {
          modelConfig: (await dataToSendToAI()).modelConfig,
        },
        headers: {
          'x-provider-key': (await dataToSendToAI()).apiKey as string,
        },
      });
    }
  }, [handleValidations, dataToSendToAI, reload, status]);

  const handleEditMessageSubmit = useCallback(
    async (e: React.FormEvent, messageId: string, messageIndex: number, content: string) => {
      e.preventDefault();

      const filterdMessages = messages.slice(0, messageIndex);
      const messageToUpdate = {
        id: messages[messageIndex].id,
        content: content,
        role: messages[messageIndex].role,
      };

      filterdMessages.push(messageToUpdate as UIMessage);
      setMessages(filterdMessages);

      reload({
        body: {
          modelConfig: (await dataToSendToAI()).modelConfig,
          editedMessageId: messageId,
        },
        headers: {
          'x-provider-key': (await dataToSendToAI()).apiKey as string,
        },
      });
      router.refresh();
    },
    [dataToSendToAI, messages, setMessages, reload, router]
  );
  const [containerRef, endRef, scrollToBottom] = useScrollToBottom<HTMLDivElement>();

  return (
    <div className='max-w-4xl mx-auto text-sm'>
      <Messages
        containerRef={containerRef}
        endRef={endRef}
        messages={messages}
        handleEditMessageSubmit={handleEditMessageSubmit}
        error={error}
        handleRetry={handleRetry}
        status={status}
        reload={reload}
      />

      <ChatInputBox
        input={input}
        setInput={setInput}
        status={status}
        handleInputChange={handleInputChange}
        onSubmit={handleFormSubmit}
        stop={stop}
        tokenInfo={{ usage: userBilling.tokenUsage, tier: userBilling.level }}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
