import { Clipboard, Check } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

interface CopyButtonProps {
  content: string;
  className?: string;
}

const CopyButton = ({ content, className }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      setIsCopied(true);
      await navigator.clipboard.writeText(content);
      setTimeout(() => setIsCopied(false), 1500); // Reset after 1.5 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      className={cn('p-2 rounded-md transition-all', className)}
      onClick={handleCopy}
      aria-label={isCopied ? 'Copied!' : 'Copy to clipboard'}
      size='icon'
      variant='secondary'
    >
      {isCopied ? (
        <Check className='w-5 h-5 text-green-600 transition-opacity duration-200' />
      ) : (
        <Clipboard className='w-5 h-5 text-gray-500 transition-opacity duration-200 hover:text-gray-700' />
      )}
    </Button>
  );
};

export default CopyButton;
