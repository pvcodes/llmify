import { motion } from 'framer-motion';
import { BotIcon, RefreshCcw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

export function AiResponseLoading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        scale: { type: 'spring', damping: 10 },
      }}
      className='text-sm relative w-full max-w-3xl mb-4 bg-gray-100/80 dark:bg-gray-800/90 p-3 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50'
    >
      <div className='flex items-start gap-3'>
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            y: [0, -2, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 2,
            ease: 'easeInOut',
          }}
          className='flex-shrink-0 p-1.5 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-xs'
        >
          <BotIcon className='w-5 h-5 text-gray-700 dark:text-gray-300' />
        </motion.div>

        <div className='flex-1 min-w-0'>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5'
          >
            Thinking...
          </motion.p>

          <div className='flex items-center gap-1'>
            {[0, 0.15, 0.3].map((delay) => (
              <motion.span
                key={delay}
                animate={{
                  y: [0, -3, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay,
                  ease: 'easeInOut',
                }}
                className='w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400'
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
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
