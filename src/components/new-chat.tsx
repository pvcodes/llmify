'use client';

import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  LayoutDashboard,
  Settings,
  MessageSquare,
  ArrowRight,
  MessageCircleIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { createNewChat, revalidateSidebar } from '@/actions/chat-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { useSidebar } from './ui/sidebar';

import type { Chat } from '@prisma/client';
import type { Message } from 'ai';

// Constants
const FEATURES = [
  {
    icon: <Sparkles className='w-6 h-6' />,
    title: 'Smart AI Models',
    description: 'Choose from our curated selection of cutting-edge AI models',
  },
  {
    icon: <LayoutDashboard className='w-6 h-6' />,
    title: 'Customizable UI',
    description: 'Tailor the interface to your workflow with adjustable layouts',
  },
  {
    icon: <Settings className='w-6 h-6' />,
    title: 'Fine-Tuned Controls',
    description: 'Adjust creativity levels, response length, and technical depth',
  },
];

const EXAMPLE_PROMPTS = [
  'how to optimize React performance',
  'explain quantum computing simply',
  'best practices for TypeScript',
  'how to build a REST API with Next.js',
];

// Components
const FeatureCard = ({ feature, index }: { feature: (typeof FEATURES)[0]; index: number }) => (
  <motion.div
    key={index}
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
  >
    <Card className='h-full transition-all hover:border-primary/50'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-primary/10 text-primary'>{feature.icon}</div>
          <CardTitle>{feature.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{feature.description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

const RecentChatCard = ({
  chat,
  index,
}: {
  chat: Chat & { messages: Message[] };
  index: number;
}) => {
  const router = useRouter();

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className='cursor-pointer transition-all hover:border-primary/50 h-40 flex flex-col w-80  md:w-full'
        onClick={() => router.push(`/chat/${chat.id}`)}
      >
        <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
          <div className='overflow-hidden'>
            <CardTitle className='text-lg truncate'>{chat.name}</CardTitle>
            <CardDescription className='line-clamp-1'>
              {chat?.messages?.[0]?.content ?? 'Nothing yet'}
            </CardDescription>
          </div>
          <MessageSquare className='h-5 w-5 flex-shrink-0 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex-grow flex items-end'>
          <p className='text-xs text-muted-foreground mt-auto'>
            {formatDistanceToNow(chat.updatedAt, { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HeroTextbox = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [randomPrompt] = useState(
    () => EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)]
  );
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => inputRef.current?.focus(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await createNewChat(prompt);

      if (!response.success) {
        setError(response.error!);
      }
      await revalidateSidebar();
      router.push(`/chat/${response.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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
        // Use the current textarea value instead of state
        const currentValue = e.currentTarget.value;
        if (!currentValue.trim()) {
          setError('Prompt cannot be empty');
          return;
        }
        setPrompt(currentValue); // Sync the state
        handleSubmit(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prompt]
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col items-center w-full max-w-3xl mx-auto'
      >
        <motion.div
          className={cn(
            'w-full relative transition-all duration-300',
            isFocused ? 'scale-[1.02]' : 'scale-100'
          )}
        >
          <motion.div
            className='absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10'
            animate={{ opacity: isFocused ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          />

          <form onSubmit={handleSubmit} className='relative'>
            <Textarea
              ref={inputRef}
              className={cn(
                'w-full rounded-2xl py-5 px-6 text-lg border-0 shadow-lg',
                'bg-background/80 backdrop-blur-sm resize-none pr-16',
                'focus-visible:ring-2 focus-visible:ring-primary/50',
                'max-h-[200px]'
              )}
              value={prompt}
              placeholder='Ask me anything...'
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label='AI Chat Input'
              rows={3}
            />

            <motion.div
              className='absolute right-3 bottom-3'
              animate={{ scale: isFocused ? 1.1 : 1 }}
            >
              <Button
                type='submit'
                size='icon'
                className='rounded-full w-10 h-10 shadow-md bg-primary/90 hover:bg-primary'
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <div className='w-5 h-5 border-2 border-background rounded-full animate-spin' />
                ) : (
                  <ArrowRight className='w-5 h-5' />
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          className='mt-4 text-sm text-muted-foreground flex items-center gap-1'
          animate={{ opacity: isFocused ? 0.7 : 1, y: isFocused ? 5 : 0 }}
        >
          <span>Try asking about</span>
          <motion.span
            className='text-primary font-medium'
            animate={{ x: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            &quot;{randomPrompt}&quot;
          </motion.span>
          <ArrowRight className='w-4 h-4' />
        </motion.div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-sm text-destructive mt-2'
        >
          {error}
        </motion.p>
      )}
    </>
  );
};
// Main Component
interface NewChatProps {
  recentChats: Array<Chat & { messages: Message[] }>;
}

export default function NewChat({ recentChats }: NewChatProps) {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  useEffect(
    () => setOpenMobile(false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='container mx-auto px-4 py-8 md:py-12'
    >
      {/* Hero Section */}
      <div className='flex flex-col items-center text-center mb-16'>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='flex items-center justify-center mb-6'
        >
          <Badge variant='outline' className='px-4 py-1 text-sm border-primary/50 bg-primary/10'>
            <Zap className='w-4 h-4 mr-2' />
            Introducing LLMify
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'
        >
          Your Intelligent Chat Companion
        </motion.h1>

        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='text-xl text-muted-foreground max-w-3xl mb-8'
        >
          Experience seamless conversations with AI that understands context, remembers details, and
          adapts to your needs.
        </motion.p>

        <HeroTextbox />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='w-full'
      >
        <Card className='border-primary/50 bg-primary/10'>
          <CardHeader>
            <CardTitle className='text-sm font-medium'>Already have an API key?</CardTitle>
            <CardDescription className='text-xs text-muted-foreground'>
              Add your key in settings to switch models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/settings')}>
              Add API Key
              <ArrowRight className='w-3 h-3 ml-1' />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Chats Section */}
      {recentChats.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className='mb-20'
        >
          <h2 className='text-2xl font-bold mt-10 mb-6'>Continue Where You Left Off</h2>
          <div className='grid md:grid-cols-3 gap-3'>
            {recentChats.map((chat, index) => (
              <RecentChatCard key={chat.id} chat={chat} index={index} />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex flex-col items-center justify-center text-center p-4 bg-secondary/50 rounded-lg my-6'>
            <MessageCircleIcon className='h-16 w-16 text-muted-foreground mb-4' strokeWidth={1.5} />
            <div className='space-y-2'>
              <h2 className='text-xl font-semibold'>No Recent Chats</h2>
              <p className='text-muted-foreground'>Start chatting by entering your first prompt</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='grid md:grid-cols-3 gap-6 mb-20'
      >
        {FEATURES.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </motion.div>
    </motion.div>
  );
}
