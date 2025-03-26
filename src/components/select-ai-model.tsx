'use client';

import { Check, ChevronsUpDown, KeyRound, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

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
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tier: BillingLevel;
}

export default function SelectAiModel({ setSheetOpen, tier }: SelectAiModelProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  // Store providers and their available models based on tier and API keys
  const [availableProvidersWithModels, setAvailableProvidersWithModels] = React.useState(
    ModelProvidersViaTier[tier]
  );

  const setConfig = useChatStore((state) => state.setConfig);
  const config = useChatStore((state) => state.config);
  const apiKeys = useChatStore((state) => state.apiKeys);
  const getApiKey = useChatStore((state) => state.getApiKey);
  const cryptoKey = useChatStore((state) => state.cryptoKey);

  React.useEffect(() => {
    const checkApiKeys = async () => {
      if (!cryptoKey) return;

      // Start with tier-based models
      const updatedModels = ModelProvidersViaTier[tier];

      // Check each provider for an API key and unlock higher-tier models if present
      for (const provider of ModelProviders) {
        const key = await getApiKey(provider);
        if (key) {
          // If an API key exists, use the fullest set of models (e.g., ENTERPRISE tier)
          updatedModels[provider] = allModels[provider];
        }
      }

      setAvailableProvidersWithModels(updatedModels);
    };
    checkApiKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeys, tier, cryptoKey]);

  const handleSetupApiKeys = () => {
    setOpen(false);
    setSheetOpen(false);
    router.push('/settings');
  };

  // Check if there are no available providers (i.e., no models at all)
  const hasNoApiKeys = Object.keys(availableProvidersWithModels).length === 0;

  return (
    <div className='w-full max-w-md'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'w-full justify-between px-3 py-2 text-sm sm:text-base h-10',
              hasNoApiKeys && 'text-amber-500 border-amber-200'
            )}
          >
            {hasNoApiKeys ? (
              <span className='flex items-center'>
                <Lock className='mr-2 h-4 w-4' />
                Set up API key
              </span>
            ) : (
              <span className='truncate'>{config?.model?.label || 'Select Model'}</span>
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 flex-shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-[var(--radix-popover-trigger-width)] p-0 lg:w-[300px] lg:mr-16'
          align='start'
        >
          <Command>
            <CommandInput placeholder='Search model...' className='h-9' />
            <CommandList className='max-h-[300px]'>
              <CommandEmpty>No models found.</CommandEmpty>
              {hasNoApiKeys ? (
                <div className='py-6 text-center'>
                  <KeyRound className='mx-auto h-12 w-12 text-amber-500/40 mb-2' />
                  <p className='text-sm font-medium'>API key required</p>
                  <p className='text-xs text-muted-foreground mt-1 mb-4 px-4'>
                    You need to set up at least one API key to use the available models
                  </p>
                  <Button
                    onClick={handleSetupApiKeys}
                    size='sm'
                    variant='secondary'
                    className='mx-auto'
                  >
                    Set up API Keys
                  </Button>
                </div>
              ) : (
                <>
                  {Object.entries(availableProvidersWithModels).map(([provider, models]) => (
                    <CommandGroup key={provider}>
                      <p className='px-2 py-1.5 text-xs font-medium text-muted-foreground capitalize sm:text-sm'>
                        {provider}
                      </p>
                      {models.map((model) => (
                        <CommandItem
                          key={model.value}
                          value={model.value}
                          onSelect={() => {
                            setConfig(provider as ModelProvider, {
                              value: model.value,
                              label: model.label,
                            });
                            setOpen(false);
                            setSheetOpen(false);
                          }}
                          className='flex items-center gap-2 text-sm'
                        >
                          <Check
                            className={cn(
                              'h-4 w-4 flex-shrink-0',
                              config?.model?.value === model.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <span className='truncate'>{model.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                  <div className='p-2 border-t'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='w-full text-xs text-muted-foreground'
                            onClick={handleSetupApiKeys}
                          >
                            <KeyRound className='h-3 w-3 mr-1' />
                            Manage API Keys
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Configure additional models</p>
                        </TooltipContent>
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
}
