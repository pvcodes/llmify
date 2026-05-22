import { motion } from 'framer-motion';
import { BotIcon, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

const LOADING_MESSAGES = [
  'Processing your request...',
  'Analyzing context...',
  'Generating response...',
  'Finalizing output...',
];

export function AiResponseLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative'>
      <div
        className={cn(
          'text-sm relative w-full max-w-2xl mb-2 bg-secondary p-3 border border-transparent'
        )}
      >
        <div className='flex items-center mb-3'>
          <div className='w-8 h-8 flex items-center justify-center bg-primary/10 border border-border'>
            <BotIcon className='w-5 h-5' />
          </div>
        </div>

        <div className='space-y-2'>
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='text-sm font-medium text-muted-foreground mb-1.5'
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.p>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>

        <div className='absolute -bottom-5 right-2 flex space-x-2'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-8 w-20' />
        </div>
      </div>
    </div>
  );
}

interface AiResponseErrorProps {
  error: Error | undefined;
  handleRetry: () => void;
}

export function AiResponseError({ error, handleRetry }: AiResponseErrorProps) {
  const getErrorMessage = (msg: string) => {
    if (msg.includes('Failed to fetch')) {
      return 'Connection issue. Please check your network.';
    }
    if (msg.includes('rate limit')) {
      return 'Rate limit reached. Please wait a moment.';
    }
    if (msg.includes('authentication') || msg.includes('api key')) {
      return 'API key issue. Check your settings.';
    }
    if (msg.includes('insufficient')) {
      return 'Credits exhausted. Upgrade for more.';
    }
    return msg.startsWith('"') && msg.endsWith('"') ? msg.slice(1, -1) : msg;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Alert variant='destructive' className='mt-3 sm:mt-4'>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
          <span>{getErrorMessage(error?.message || 'Something went wrong')}</span>
          <Button variant='outline' onClick={handleRetry} size='sm'>
            <RefreshCcw className='w-4 h-4 mr-1' />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
