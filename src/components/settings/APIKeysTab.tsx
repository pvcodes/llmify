'use client';

import { Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Accordion } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ProviderDescriptions as descriptions,
  type ModelProvider,
  ModelProviders,
} from '@/lib/ai/models';
import useChatStore from '@/store/useChatStore';

import { APIKeyAccordion } from './APIKeyAccordion';
import { validateApiKey } from './utils';

import type { APIKeyState } from './types';

const llmProviders = ModelProviders;

export function APIKeysTab() {
  const { getApiKey, setApiKey, cryptoKey, initializeCryptoKey } = useChatStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [state, setState] = useState<APIKeyState>({
    tempKeys: {},
    displayKeys: {},
    showKey: {},
    status: {},
  });

  useEffect(() => {
    const initialize = async () => {
      if (!cryptoKey) await initializeCryptoKey();
      setIsInitializing(false);
    };
    initialize();
  }, [cryptoKey, initializeCryptoKey]);

  useEffect(() => {
    const loadApiKeys = async () => {
      if (!cryptoKey) return;
      const keys: Record<string, string> = {};
      for (const provider of llmProviders) {
        const key = await getApiKey(provider);
        if (key) keys[provider] = key;
      }
      setState((prev) => ({ ...prev, displayKeys: keys }));
    };
    loadApiKeys();
  }, [cryptoKey, getApiKey]);

  const handleSaveKey = async (provider: ModelProvider) => {
    if (!cryptoKey) return;
    const key = state.tempKeys[provider] || state.displayKeys[provider];
    if (!key) return;

    setState((prev) => ({
      ...prev,
      status: { ...prev.status, [provider]: null },
    }));

    const isValid = await validateApiKey(provider, key);

    if (isValid) {
      await setApiKey(provider, key);
      setState((prev) => {
        // Create a new tempKeys object without the provider key
        const newTempKeys = { ...prev.tempKeys };
        delete newTempKeys[provider];

        return {
          ...prev,
          status: { ...prev.status, [provider]: 'saved' },
          displayKeys: { ...prev.displayKeys, [provider]: key },
          tempKeys: newTempKeys,
        };
      });
      setTimeout(
        () =>
          setState((prev) => ({
            ...prev,
            status: { ...prev.status, [provider]: null },
          })),
        2000
      );
    } else {
      setState((prev) => ({
        ...prev,
        status: { ...prev.status, [provider]: 'error' },
      }));
      setTimeout(
        () =>
          setState((prev) => ({
            ...prev,
            status: { ...prev.status, [provider]: null },
          })),
        3000
      );
    }
  };

  const handleCopyKey = async (provider: ModelProvider) => {
    const key = state.tempKeys[provider] || state.displayKeys[provider];
    if (key) {
      await navigator.clipboard.writeText(key);
      setState((prev) => ({
        ...prev,
        status: { ...prev.status, [provider]: 'copied' },
      }));
      setTimeout(
        () =>
          setState((prev) => ({
            ...prev,
            status: { ...prev.status, [provider]: null },
          })),
        2000
      );
    }
  };

  const toggleShowKey = (provider: ModelProvider) => {
    setState((prev) => ({
      ...prev,
      showKey: { ...prev.showKey, [provider]: !prev.showKey[provider] },
    }));
  };

  const handleKeyChange = (provider: ModelProvider, value: string) => {
    setState((prev) => ({
      ...prev,
      tempKeys: { ...prev.tempKeys, [provider]: value },
    }));
  };

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-xl font-semibold tracking-tight'>
          API Keys Configuration
        </CardTitle>
        <p className='text-sm text-muted-foreground'>Manage your API keys for AI providers</p>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='px-6 py-4'>
          <Alert variant='default' className='mb-6 rounded-md bg-muted'>
            <Lock className='h-4 w-4 text-muted-foreground' />
            <AlertDescription className='text-sm'>
              Your API keys are encrypted and stored locally using a browser-managed secure key.
            </AlertDescription>
          </Alert>
        </div>
        {isInitializing ? (
          <div className='px-6 py-4 text-center text-muted-foreground'>
            Initializing secure key storage...
          </div>
        ) : cryptoKey ? (
          <Accordion type='single' collapsible className='w-full'>
            {llmProviders.map((provider) => (
              <APIKeyAccordion
                key={provider}
                provider={provider}
                description={descriptions[provider]}
                hasKey={Boolean(state.displayKeys[provider])}
                {...state}
                handleSaveKey={handleSaveKey}
                handleCopyKey={handleCopyKey}
                toggleShowKey={toggleShowKey}
                handleKeyChange={handleKeyChange}
              />
            ))}
          </Accordion>
        ) : (
          <div className='px-6 py-4 text-center text-muted-foreground'>
            Failed to initialize secure key storage. Please refresh and try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
