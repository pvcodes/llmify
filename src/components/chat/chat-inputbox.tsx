'use client';

import { BillingLevel } from '@prisma/client';
import {
  CheckCircle2Icon,
  Cloud,
  LucideSquareSquare,
  SendHorizonal,
  Settings2Icon,
  X,
} from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
}

export default function ChatInputBox({
  input,
  setInput,
  handleInputChange,
  onSubmit,
  stop,
  status,
  placeholder = 'Drop your thoughts here...',
  maxHeight = 200,
  tokenInfo,
}: ChatInputBoxProps) {
  const { hasSelectedProviderApiKey, setUseSelectedProviderApiKey, useSelectedProviderApiKey } =
    useProviderApiKey();

  const modelSetting = useChatStore((state) => state.config?.setting);
  const modelConfig = useChatStore((state) => state.config?.model);
  const setModelSetting = useChatStore((state) => state.setModelSetting);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showTuneSetting, setShowTuneSetting] = useState(false);
  const [charCount, setCharCount] = useState(0);

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
        onSubmit(e);
      }
    },
    [input, setInput, onSubmit]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, maxHeight)}px`;
      setCharCount(input.length);
    }
  }, [input, maxHeight]);

  return (
    <div className='fixed bottom-0 p-2 mx-auto backdrop-blur-3xl max-w-4xl w-full flex flex-col gap-3 rounded-3xl mb-2'>
      <form onSubmit={onSubmit} className='relative w-full flex items-end gap-3'>
        <div className='relative flex-1'>
          <Textarea
            ref={inputRef}
            className='w-full rounded-xl py-3 px-4 text-sm border-opacity-40 focus:ring-opacity-50 shadow-inner resize-none pr-20'
            style={{ maxHeight: `${maxHeight}px` }}
            value={input}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={status === 'streaming'}
            aria-label='AI Chat Input'
            rows={2}
          />
          <div className='absolute right-2 bottom-2 flex items-center gap-2'>
            <span className={cn('text-xs opacity-60', charCount > 2000 && 'text-red-700')}>
              {charCount}/2000
            </span>
          </div>
        </div>
        {status === 'streaming' ? (
          <Button
            onClick={stop}
            className='rounded-full w-12 h-12 shadow-md transition-all duration-200 ring-1 ring-opacity-40 hover:ring-opacity-60'
          >
            <LucideSquareSquare className='w-6 h-6' />
          </Button>
        ) : (
          <Button
            type='submit'
            size='icon'
            className='rounded-full w-12 h-12 shadow-md transition-all duration-200 ring-1 ring-opacity-40 hover:ring-opacity-60'
            disabled={status === 'submitted'}
          >
            <SendHorizonal className='w-6 h-6' />
          </Button>
        )}
      </form>

      <div className='flex flex-col-reverse md:flex-row md:justify-between w-full gap-2 md:gap-0'>
        <div className='flex items-center gap-3 justify-between'>
          <Badge variant='outline' className='border-opacity-40'>
            Tokens Usage: {(tokenInfo.usage / 1000).toFixed(1)}K{' '}
            {tokenInfo.tier === BillingLevel.FREE && ` / ${MAX_FREE_TOKEN / 1000}K`}
          </Badge>
          <Badge variant='secondary' className='opacity-80'>
            {modelSetting?.mode.charAt(0).toUpperCase() + modelSetting?.mode.slice(1)} Mode
          </Badge>
          <Badge variant='secondary' className='opacity-80'>
            {modelConfig.label}
          </Badge>
          {useSelectedProviderApiKey && (
            <Badge variant='secondary' className='opacity-80'>
              <>
                <CheckCircle2Icon className='w-4 h-4 text-green-500' />
                User API Key
              </>
            </Badge>
          )}
        </div>
        <Button variant='secondary' size='sm' onClick={() => setShowTuneSetting((prev) => !prev)}>
          {showTuneSetting ? (
            <>
              <X className='w-5 h-5 mr-1' /> Close
            </>
          ) : (
            <>
              <Settings2Icon className='w-5 h-5 mr-1' /> Tune
            </>
          )}
        </Button>
      </div>

      {showTuneSetting && (
        <>
          <div className='mt-1 flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <div className='flex gap-3'>
                <Label className='flex items-center'>Response Style</Label>
                <Select
                  value={modelSetting?.mode ?? 'normal'}
                  onValueChange={(val: AiModeType) => {
                    setModelSetting('mode', val);
                  }}
                >
                  <SelectTrigger defaultValue={modelSetting?.mode}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AiMode.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Toggle
                        onPressedChange={setUseSelectedProviderApiKey}
                        pressed={useSelectedProviderApiKey}
                        disabled={!hasSelectedProviderApiKey}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 transition',
                          !hasSelectedProviderApiKey && 'cursor-not-allowed opacity-50'
                        )}
                      >
                        {useSelectedProviderApiKey ? (
                          <>
                            <CheckCircle2Icon className='w-4 h-4 text-green-500' />
                            <span className='text-sm'>Use My API Key</span>
                          </>
                        ) : (
                          <>
                            <Cloud className='w-4 h-4 text-blue-500' />
                            <span className='text-sm'>Use LLMify&apos;s API</span>
                          </>
                        )}
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      {useSelectedProviderApiKey
                        ? 'Requests will be sent using your API key. You are responsible for any associated costs.'
                        : "Requests will be sent using LLMify's API. Usage limits may apply."}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
