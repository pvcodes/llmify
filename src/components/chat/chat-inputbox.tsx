'use client';

import { BillingLevel } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, Square, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProviderApiKey } from '@/hooks/use-provider-api-key';
import type { AiModeType } from '@/lib/ai';
import { AiMode } from '@/lib/ai';
import { MAX_FREE_TOKEN } from '@/lib/constant';
import { cn } from '@/lib/utils';
import useChatStore from '@/store/useChatStore';

import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Toggle } from '../ui/toggle';

interface ChatInputBoxProps {
  input: string;
  setInput?: (value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  stop: () => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  tokenInfo: { usage: number; tier: string };
  placeholder?: string;
  maxHeight?: number;
  scrollToBottom?: () => void;
}

export default function ChatInputBox({
  input,
  setInput,
  handleInputChange,
  onSubmit,
  stop,
  status,
  placeholder = 'Type a message...',
  maxHeight = 200,
  tokenInfo,
  scrollToBottom,
}: ChatInputBoxProps) {
  const { hasSelectedProviderApiKey, setUseSelectedProviderApiKey, useSelectedProviderApiKey } =
    useProviderApiKey();

  const modelSetting = useChatStore((state) => state.config?.setting);
  const modelConfig = useChatStore((state) => state.config?.model);
  const setModelSetting = useChatStore((state) => state.setModelSetting);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (setInput) {
          const start = e.currentTarget.selectionStart;
          const end = e.currentTarget.selectionEnd;
          setInput(input.substring(0, start) + '\n' + input.substring(end));
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        scrollToBottom?.();
        onSubmit(e);
      }
    },
    [input, setInput, onSubmit, scrollToBottom]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [input, maxHeight]);

  return (
    <div className='sticky bottom-0 border-t p-3 flex-shrink-0 bg-background z-10'>
      <form
        onSubmit={(e) => {
          scrollToBottom?.();
          onSubmit(e);
        }}
        className='relative flex items-end gap-2 max-w-4xl mx-auto w-full px-2 sm:px-0'
      >
        <Textarea
          ref={inputRef}
          className={cn(
            'w-full py-2.5 px-3 text-sm bg-muted border resize-none',
            'border-border transition-colors duration-200',
            'placeholder:text-muted-foreground/60'
          )}
          style={{ maxHeight: `${maxHeight}px` }}
          value={input}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            e.target.classList.remove('border-border');
            e.target.classList.add('border-primary');
          }}
          onBlur={(e) => {
            e.target.classList.remove('border-primary');
            e.target.classList.add('border-border');
          }}
          disabled={status === 'streaming'}
          aria-label='Chat input'
          rows={1}
        />
        {status === 'streaming' ? (
          <Button onClick={stop} type='button' size='icon' className='h-9 w-9'>
            <Square className='w-4 h-4' />
          </Button>
        ) : (
          <motion.div
            animate={input.trim() && status !== 'submitted' ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Button
              type='submit'
              size='icon'
              className='h-9 w-9'
              disabled={!input.trim() || status === 'submitted'}
            >
              <SendHorizontal className='w-4 h-4' />
            </Button>
          </motion.div>
        )}
      </form>

      <div className='flex items-center justify-between mt-2 max-w-4xl mx-auto'>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='text-xs'>
            {(tokenInfo.usage / 1000).toFixed(1)}K
            {tokenInfo.tier === BillingLevel.FREE && ` / ${MAX_FREE_TOKEN / 1000}K`}
          </Badge>
          <span className='text-xs text-muted-foreground hidden sm:inline'>
            {modelConfig?.label}
          </span>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowSettings(!showSettings)}
          className='text-xs h-7'
        >
          {showSettings ? <X className='w-3 h-3 mr-1' /> : null}
          {showSettings ? 'Hide' : 'Settings'}
        </Button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='mt-3 pt-3 border-t flex flex-wrap gap-4 items-center max-w-4xl mx-auto overflow-hidden'
          >
            <div className='flex items-center gap-2'>
              <Label className='text-xs'>Style</Label>
              <Select
                value={modelSetting?.mode ?? 'normal'}
                onValueChange={(val: AiModeType) => setModelSetting('mode', val)}
              >
                <SelectTrigger className='h-8 w-28'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AiMode.map((mode) => (
                    <SelectItem key={mode} value={mode} className='text-xs'>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Toggle
              onPressedChange={setUseSelectedProviderApiKey}
              pressed={useSelectedProviderApiKey}
              disabled={!hasSelectedProviderApiKey}
              className={cn('h-8 text-xs gap-1.5 px-2', !hasSelectedProviderApiKey && 'opacity-50')}
            >
              {useSelectedProviderApiKey ? 'Your key' : 'LLMify'}
            </Toggle>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
