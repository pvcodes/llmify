import { useCallback, useState, useEffect, useMemo } from 'react';

import { hasApiKeyForSelectedModel } from '@/lib/utils';
import useChatStore from '@/store/useChatStore';

export function useProviderApiKey() {
  // Get state from store
  const modelConfig = useChatStore((state) => state.config);
  const apiKeys = useChatStore((state) => state.apiKeys);
  const getApiKey = useChatStore((state) => state.getApiKey);

  // Memoize the provider check since it's used in multiple places
  const currentProvider = modelConfig?.provider;
  const hasProvider = !!currentProvider;

  // Memoize the API key check to avoid recalculating
  const checkHasSelectedProviderApiKey = useMemo(() => {
    return hasProvider && hasApiKeyForSelectedModel(currentProvider, apiKeys);
  }, [currentProvider, apiKeys, hasProvider]);

  // State for whether to use the provider's API key
  const [useSelectedProviderApiKey, setUseSelectedProviderApiKey] = useState(
    checkHasSelectedProviderApiKey
  );

  // Update state when dependencies change
  useEffect(() => {
    setUseSelectedProviderApiKey(checkHasSelectedProviderApiKey);
  }, [checkHasSelectedProviderApiKey]);

  // Memoized function to get the API key
  const getSelectedProviderApiKey = useCallback(async () => {
    return hasProvider ? await getApiKey(currentProvider) : undefined;
  }, [currentProvider, getApiKey, hasProvider]);

  // Memoized function to prepare data for AI
  const dataToSendToAI = useCallback(async () => {
    const apiKey = useSelectedProviderApiKey ? await getSelectedProviderApiKey() : undefined;
    return { modelConfig, apiKey };
  }, [modelConfig, getSelectedProviderApiKey, useSelectedProviderApiKey]);

  return {
    hasSelectedProviderApiKey: checkHasSelectedProviderApiKey,
    useSelectedProviderApiKey,
    setUseSelectedProviderApiKey,
    getSelectedProviderApiKey,
    dataToSendToAI,
  };
}
