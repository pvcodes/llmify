import { motion } from 'framer-motion';
import { BotIcon, RefreshCcw } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export function AiResponseLoading() {
  return (
    <div className='relative'>
      <div
        className={cn(
          'text-sm relative w-full max-w-2xl mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg'
        )}
      >
        <div className='flex items-center mb-3'>
          {/* <Skeleton className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-600" /> */}
          <BotIcon className='w-6 h-6 p-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 shadow-sm' />
        </div>

        <div className='space-y-2'>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='text-sm font-medium text-muted-foreground mb-1.5'
          >
            Thinking...
          </motion.p>
          <Skeleton className='h-4 w-full bg-gray-300 dark:bg-gray-600' />
          <Skeleton className='h-4 w-3/4 bg-gray-300 dark:bg-gray-600' />
          <Skeleton className='h-4 w-1/2 bg-gray-300 dark:bg-gray-600' />
        </div>

        <div className='absolute -bottom-5 right-2 flex space-x-2'>
          <Skeleton className='h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded-md' />
          <Skeleton className='h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded-md' />
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
  return (
    <Alert
      variant='destructive'
      className='mt-3 sm:mt-4 rounded-lg text-gray-900 dark:text-gray-50'
    >
      <AlertTitle>Failed</AlertTitle>
      <AlertDescription className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-gray-900 dark:text-gray-50'>
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
      </AlertDescription>
    </Alert>
  );
}
