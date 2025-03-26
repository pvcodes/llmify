'use client';

import { useChat } from '@ai-sdk/react';
import { BillingLevel, type Billing } from '@prisma/client';
import { RefreshCcw, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollToBottom } from '@/hooks/use-scroll-to-botton';
import { MAX_FREE_TOKEN } from '@/lib/constant';
import { cn, hasApiKeyForSelectedModel } from '@/lib/utils';
import useChatStore from '@/store/useChatStore';

import ScrollToBottom from '../ScrollToBottom';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';

import ChatInputBox from './chat-inputbox';
import Markdown from './markdown';
import UserMessageBox from './user-message-box';

import type { Message } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

interface ChatProps {
  id: string;
  initialMessages: Message[];
  isNew?: boolean;
  userBilling: Billing;
}

export default function Chat({ id, initialMessages, isNew = false, userBilling }: ChatProps) {
  const isMobile = useIsMobile();
  const isMac = typeof navigator !== 'undefined' ? navigator.platform.includes('Mac') : false;

  const modelConfig = useChatStore((state) => state.config);
  const getApiKey = useChatStore((state) => state.getApiKey);
  const apiKeys = useChatStore((state) => state.apiKeys);
  const router = useRouter();

  // Refs
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const chatInputBoxRef = useRef<HTMLTextAreaElement | null>(null);

  // Rate limiting
  const lastSubmitTime = useRef(0);
  const RATE_LIMIT_MS = 1000;

  const hasSelectedProviderApiKey = useCallback(() => {
    if (modelConfig?.provider && hasApiKeyForSelectedModel(modelConfig.provider, apiKeys))
      return true;
    return false;
  }, [modelConfig, apiKeys])();

  const [useSelectedProviderApiKey, setUseSelectedProviderApiKey] =
    useState(hasSelectedProviderApiKey);

  const getSelectedProviderApiKey = useCallback(async () => {
    const apiKey = modelConfig?.provider ? await getApiKey(modelConfig.provider) : undefined;
    return apiKey;
  }, [modelConfig, getApiKey]);

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
  });

  const dataToSendToAI = useCallback(
    async () => ({
      modelConfig,
      apiKey: useSelectedProviderApiKey ? await getSelectedProviderApiKey() : undefined,
    }),
    [modelConfig, getSelectedProviderApiKey, useSelectedProviderApiKey]
  );

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

      filterdMessages.push(messageToUpdate as UIMessage); // had no other option, if you got, help us
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

  // Initialize new chat
  useEffect(() => {
    const fetchInitialResponse = async () => {
      if (isNew) {
        reload({
          body: { modelConfig: (await dataToSendToAI()).modelConfig },
          headers: {
            'x-provider-key': (await dataToSendToAI()).apiKey as string,
          },
        });
      }
    };

    fetchInitialResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col relative min-h-screen max-w-5xl mx-auto'>
      <div className='flex-1 overflow-y-auto' ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <div key={message.id} className='flex flex-col my-2 px-1 md:p-4'>
            {message.role === 'assistant' ? (
              <Markdown markdown={message.content} />
            ) : (
              <UserMessageBox
                messageContent={message.content}
                handleEditMessageSubmit={handleEditMessageSubmit}
                messageId={message.id}
                messageIndex={index}
              />
            )}
          </div>
        ))}
      </div>

      {status === 'error' && (
        <Alert
          variant='destructive'
          className='mt-3 sm:mt-4 rounded-lg text-gray-900 dark:text-gray-50'
        >
          <AlertTitle>Failed</AlertTitle>
          <AlertDescription className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-gray-900 dark:text-gray-50'>
            {modelConfig ? (
              <>
                <span className='text-gray-900 dark:text-gray-50'>
                  {error?.message.startsWith('"') && error.message.endsWith('"')
                    ? error.message.slice(1, -1)
                    : error?.message}
                </span>
                <Button
                  variant='outline'
                  onClick={handleRetry}
                  size='sm'
                  className='rounded-full text-gray-900 dark:text-gray-50'
                >
                  <RefreshCcw className='w-4 h-4 mr-1' />
                  Retry
                </Button>
              </>
            ) : (
              <>
                <span className='text-gray-900 dark:text-gray-50'>Please add an API Key</span>
                <Button
                  variant='outline'
                  onClick={() => router.push('/settings')}
                  size='sm'
                  className='rounded-full text-gray-900 dark:text-gray-50'
                >
                  <Settings className='w-4 h-4 mr-1' />
                  Settings
                </Button>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className='sticky bottom-0 left-0 right-0 w-full shadow-md bg-background'>
        {(status === 'streaming' || status === 'submitted') && (
          <div className='flex flex-col items-center justify-center p-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span>{status === 'submitted' ? 'Thinking...' : 'Assistant is typing...'}</span>
            </div>
            <Button
              type='button'
              onClick={stop}
              size='sm'
              variant='outline'
              className='mt-3 rounded-full'
              disabled={status !== 'streaming'}
            >
              Stop Generating
            </Button>
          </div>
        )}
        <ChatInputBox
          inputRef={chatInputBoxRef}
          input={input}
          onInputChange={handleInputChange}
          onSubmit={handleFormSubmit}
          setInput={setInput}
          isDisabled={status === 'streaming' || status === 'submitted'}
          tokenInfo={
            userBilling ? { usage: userBilling.tokenUsage, limit: MAX_FREE_TOKEN } : undefined
          }
        />
        <div className='mt-2 p-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground w-full'>
          {!isMobile && (
            <span className='hidden sm:inline'>
              Press <kbd className='px-1 py-0.5 bg-muted rounded border'>Enter</kbd> to send,{' '}
              <kbd className='px-1 py-0.5 bg-muted rounded border'>{isMac ? 'Cmd' : 'Ctrl'}</kbd>+
              <kbd className='px-1 py-0.5 bg-muted rounded border'>Enter</kbd> for new line
            </span>
          )}

          {userBilling.tokenUsage && (
            <span className='px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm'>
              Token usage:{' '}
              <span className='font-semibold text-primary'>
                {(userBilling.tokenUsage / 1000).toFixed(1)}K
              </span>
              {userBilling.level === BillingLevel.FREE && (
                <span className='font-semibold'> / {MAX_FREE_TOKEN / 1000}K</span>
              )}
            </span>
          )}
        </div>
      </div>
      <ScrollToBottom />
      <div ref={messagesEndRef} />

      <div className='flex items-center justify-between p-2 rounded-lg border bg-card text-card-foreground shadow-sm transition-all'>
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              useSelectedProviderApiKey ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
            )}
          />

          <Badge variant='secondary' className='font-normal'>
            {useSelectedProviderApiKey
              ? `Using ${modelConfig?.provider}'s API Key provided by you!`
              : 'Powered by LLMify'}
          </Badge>
        </div>

        <div className='flex items-center gap-2'>
          <Link className='text-sm text-muted-foreground underline' href='/settings'>
            API Key
          </Link>
          <Switch
            checked={useSelectedProviderApiKey}
            onCheckedChange={setUseSelectedProviderApiKey}
            disabled={!hasSelectedProviderApiKey}
            className={cn(
              'data-[state=checked]:bg-primary',
              !hasSelectedProviderApiKey && 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>
      </div>
    </div>
  );
}
