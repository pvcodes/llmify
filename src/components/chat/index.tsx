'use client';

import { useChat } from '@ai-sdk/react';
import { type Billing } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef } from 'react';
import { toast } from 'sonner';

import { useProviderApiKey } from '@/hooks/use-provider-api-key';
import useChatStore from '@/store/useChatStore';

import { Messages } from '../messages';

import ChatInputBox from './chat-inputbox';

import type { Message } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

interface ChatProps {
  id: string;
  initialMessages: Message[];
  userBilling: Billing;
}

export default function Chat({ id, initialMessages, userBilling }: ChatProps) {
  const modelConfig = useChatStore((state) => state.config);
  const router = useRouter();
  const lastSubmitTime = useRef(0);
  const RATE_LIMIT_MS = 1000;
  const { dataToSendToAI } = useProviderApiKey();

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
    if (!modelConfig) return { condition: true, message: 'Choose a model' };
    if (Date.now() - lastSubmitTime.current < RATE_LIMIT_MS)
      return { condition: true, message: 'Wait a moment' };
    if (status === 'streaming') return { condition: true, message: 'Still typing...' };
    return { condition: false, message: '' };
  }, [modelConfig, status]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const error = handleValidations();
      if (error.condition) return toast(error.message);
      lastSubmitTime.current = Date.now();
      handleSubmit(e, {
        body: { modelConfig: (await dataToSendToAI()).modelConfig },
        headers: {
          'x-provider-key': (await dataToSendToAI()).apiKey as string,
        },
      });
      router.refresh();
    },
    [handleValidations, handleSubmit, router, dataToSendToAI]
  );

  const handleRetry = useCallback(async () => {
    const error = handleValidations();
    if (error.condition) return toast(error.message);
    if (status === 'error') {
      reload({
        body: { modelConfig: (await dataToSendToAI()).modelConfig },
        headers: {
          'x-provider-key': (await dataToSendToAI()).apiKey as string,
        },
      });
    }
  }, [handleValidations, dataToSendToAI, reload, status]);

  const handleEditMessageSubmit = useCallback(
    async (e: React.FormEvent, messageId: string, messageIndex: number, content: string) => {
      e.preventDefault();
      const filteredMessages = messages.slice(0, messageIndex);
      filteredMessages.push({
        id: messages[messageIndex].id,
        content,
        role: messages[messageIndex].role,
      } as UIMessage);
      setMessages(filteredMessages);
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

  return (
    <div className='flex flex-col h-full min-h-0 w-full max-w-4xl mx-auto px-2 sm:px-0'>
      <Messages
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
      />
    </div>
  );
}
