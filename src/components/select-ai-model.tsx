'use client';

import { Check, ChevronsUpDown, KeyRound, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback, memo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ModelProvider } from '@/lib/ai/models';
import { ModelProviders, ModelProvidersViaTier, allModels } from '@/lib/ai/models';
import { cn } from '@/lib/utils';
import useChatStore from '@/store/useChatStore';

import type { BillingLevel } from '@prisma/client';

interface SelectAiModelProps {
  setSheetOpen: (open: boolean) => void;
  tier: BillingLevel;
}

const ModelSelector = ({ setSheetOpen, tier }: SelectAiModelProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [availableProviders, setAvailableProviders] = useState(ModelProvidersViaTier[tier]);

  const { setModelConfig, config, apiKeys, getApiKey, cryptoKey } = useChatStore();

  const handleSetupApiKeys = useCallback(() => {
    setOpen(false);
    setSheetOpen(false);
    router.push('/settings');
  }, [router, setSheetOpen]);

  const handleModelSelect = useCallback(
    (provider: ModelProvider, model: { value: string; label: string }) => {
      setModelConfig(provider, model);
      setOpen(false);
      setSheetOpen(false);
    },
    [setModelConfig, setSheetOpen]
  );

  useEffect(() => {
    const updateModels = async () => {
      if (!cryptoKey) return;

      const updated = { ...ModelProvidersViaTier[tier] };
      await Promise.all(
        ModelProviders.map(async (provider) => {
          const key = await getApiKey(provider);
          if (key) updated[provider] = allModels[provider];
        })
      );
      setAvailableProviders(updated);
    };

    updateModels();
  }, [apiKeys, tier, cryptoKey, getApiKey]);

  const hasNoApiKeys = Object.keys(availableProviders).length === 0;

  return (
    <div className='w-full max-w-md'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn('w-full justify-between', hasNoApiKeys && 'border-warning')}
          >
            {hasNoApiKeys ? (
              <span className='flex items-center gap-2'>
                <Lock className='h-4 w-4' />
                Set up API key
              </span>
            ) : (
              <span className='truncate'>{config?.model?.label || 'Select Model'}</span>
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='w-[var(--radix-popover-trigger-width)] lg:w-[300px] p-0'
          align='start'
        >
          <Command className='min-w-fit'>
            <CommandInput placeholder='Search model...' />
            <CommandList className='max-h-[300px]'>
              <CommandEmpty>No models found</CommandEmpty>

              {hasNoApiKeys ? (
                <div className='grid place-items-center p-6 gap-3 text-center'>
                  <KeyRound className='h-12 w-12 opacity-40' />
                  <div>
                    <p className='font-medium'>API key required</p>
                    <p className='text-sm opacity-70 mt-1'>
                      Set up at least one API key to use models
                    </p>
                  </div>
                  <Button onClick={handleSetupApiKeys} size='sm' variant='secondary'>
                    Set up API Keys
                  </Button>
                </div>
              ) : (
                <>
                  {Object.entries(availableProviders)
                    .filter(([, models]) => models.length > 0)
                    .map(([provider, models]) => (
                      <CommandGroup key={provider}>
                        <p className='text-xs font-medium opacity-70 px-2 py-1.5'>{provider}</p>
                        {models.map((model) => (
                          <CommandItem
                            key={model.value}
                            value={model.value}
                            onSelect={() => handleModelSelect(provider as ModelProvider, model)}
                            className='gap-2'
                          >
                            <Check
                              className={cn(
                                'h-4 w-4 shrink-0',
                                config?.model?.value === model.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <span className='truncate'>{model.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}

                  <div className='border-t p-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full text-sm opacity-70'
                            onClick={handleSetupApiKeys}
                          >
                            <KeyRound className='h-3 w-3 mr-2' />
                            Manage API Keys
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Configure additional models</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(ModelSelector);
