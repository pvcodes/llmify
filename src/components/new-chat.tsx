'use client';

import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { createNewChat, revalidateSidebar } from '@/actions/chat-message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { useSidebar } from './ui/sidebar';

import type { BillingLevel, Chat } from '@prisma/client';
import type { Message } from 'ai';

const EXAMPLE_PROMPTS = [
  'how to optimize React performance',
  'explain quantum computing simply',
  'best practices for TypeScript',
];

const QuickActionCard = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className='text-left p-4 border bg-card hover:bg-secondary/20 hover:border-primary/50 transition-all cursor-pointer group'
  >
    <div className='flex items-start justify-between gap-4'>
      <div className='flex-1 min-w-0'>
        <h3 className='text-sm font-medium mb-1'>{title}</h3>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
      <ArrowRight className='w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all' />
    </div>
  </button>
);

const RecentChatItem = ({ chat }: { chat: Chat & { messages: Message[] } }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/chat/${chat.id}`)}
      className='w-full text-left p-3 border bg-card hover:bg-secondary/20 hover:border-primary/50 transition-all'
    >
      <div className='flex items-start gap-3'>
        <MessageSquare className='w-4 h-4 text-muted-foreground/60 mt-0.5' />
        <div className='flex-1 min-w-0'>
          <h4 className='text-sm font-medium truncate'>{chat.name}</h4>
          <p className='text-xs text-muted-foreground line-clamp-1 mt-0.5'>
            {chat.messages?.[0]?.content || 'Empty conversation'}
          </p>
          <p className='text-xs text-muted-foreground/60 mt-1'>
            {formatDistanceToNow(chat.updatedAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </button>
  );
};

const ChatInput = ({
  inputRef,
  isFocused,
  setIsFocused,
  prompt,
  setPrompt,
  isLoading,
  handleKeyDown,
}: {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Enter a message to start');
      return;
    }

    try {
      setError('');
      const response = await createNewChat(prompt);
      if (!response.success) {
        setError(response.error || 'Failed to create chat');
        return;
      }
      await revalidateSidebar();
      router.push(`/chat/${response.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className='w-full max-w-4xl'>
      <form onSubmit={handleSubmit} className='relative'>
        <Textarea
          ref={inputRef}
          className={cn(
            'w-full py-3 px-4 pr-12 text-sm bg-card border resize-none',
            isFocused ? 'border-primary' : 'border-border',
            'placeholder:text-muted-foreground/50'
          )}
          placeholder='Ask anything...'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={3}
        />

        <Button
          type='submit'
          size='icon'
          className={cn(
            'absolute right-2.5 bottom-2.5 h-8 w-8 transition-colors',
            prompt.trim() && !isLoading ? 'bg-primary hover:bg-primary/90' : 'bg-muted'
          )}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <div className='w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin' />
          ) : (
            <ArrowRight className='w-3.5 h-3.5' />
          )}
        </Button>
      </form>

      {error && <p className='text-xs text-destructive mt-2'>{error}</p>}

      <div className='flex items-center gap-2 mt-3 justify-center'>
        <span className='text-xs text-muted-foreground/70'>Try:</span>
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example}
            onClick={() => {
              setPrompt(example);
              inputRef.current?.focus();
            }}
            className='text-xs text-muted-foreground hover:text-foreground transition-colors'
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

interface NewChatProps {
  recentChats: Array<Chat & { messages: Message[] }>;
  tier: BillingLevel;
}

export default function NewChat({ recentChats, tier }: NewChatProps) {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOpenMobile(false);
    inputRef.current?.focus();
  }, [setOpenMobile]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        setPrompt(prompt.substring(0, start) + '\n' + prompt.substring(end));
        setTimeout(() => inputRef.current?.focus(), 0);
      } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsLoading(true);
        createNewChat(prompt)
          .then(async (response) => {
            if (response.success) {
              await revalidateSidebar();
              router.push(`/chat/${response.id}`);
            }
          })
          .finally(() => setIsLoading(false));
      }
    },
    [prompt, router]
  );

  return (
    <div className='flex flex-col min-h-0'>
      <div className='flex-1 flex flex-col items-center justify-center px-6 py-12'>
        <div className='w-full max-w-4xl text-center mb-6'>
          <h1 className='text-2xl font-display uppercase tracking-tight mb-2'>
            What would you like to explore?
          </h1>
          <p className='text-sm text-muted-foreground'>
            Interact with GPT, Claude, DeepSeek, and more.
          </p>
        </div>

        <ChatInput
          inputRef={inputRef}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          handleKeyDown={handleKeyDown}
        />
      </div>

      <div className='border-t bg-muted/20 px-6 py-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='grid sm:grid-cols-2 gap-3'>
            <QuickActionCard
              title='Add API Key'
              description='Use your own keys for more options'
              onClick={() => router.push('/settings')}
            />
            <QuickActionCard
              title={tier === 'FREE' ? 'View Plans' : 'Manage Plan'}
              description={
                tier === 'FREE' ? 'Get more credits and features' : 'Your current subscription'
              }
              onClick={() => router.push('/plans')}
            />
          </div>
        </div>
      </div>

      {recentChats.length > 0 && (
        <div className='border-t px-6 py-6'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-sm font-medium text-muted-foreground mb-3'>Recent</h2>
            <div className='grid sm:grid-cols-2 gap-2'>
              {recentChats.slice(0, 4).map((chat) => (
                <RecentChatItem key={chat.id} chat={chat} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
