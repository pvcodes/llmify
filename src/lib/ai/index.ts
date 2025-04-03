import { createAnthropic } from '@ai-sdk/anthropic';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createOpenAI } from '@ai-sdk/openai';
import { createXai } from '@ai-sdk/xai';

import type { ModelProvider, Models } from './models';

const PROVIDER_API_KEYS = {
  OpenAI: process.env.API_KEY_OPENAI!,
  Anthropic: process.env.API_KEY_ANTHROPIC!,
  DeepSeek: process.env.API_KEY_DEEPSEEK!,
  xAi: process.env.API_KEY_XAI!,
};

/** AI Model Provider Mapping */
const modelProviders = {
  Anthropic: createAnthropic,
  DeepSeek: createDeepSeek,
  OpenAI: createOpenAI,
  xAi: createXai,
} as const;

export function model(
  provider: ModelProvider,
  model: Models<ModelProvider>,
  apiKey: string | undefined
) {
  const API_KEY = apiKey ? apiKey : PROVIDER_API_KEYS[provider];
  const providerInstance = modelProviders[provider];

  if (!providerInstance) {
    throw new Error(`Invalid provider: ${provider}`);
  }
  if (provider === 'OpenAI')
    return providerInstance({ apiKey: API_KEY, compatibility: 'strict' })(model);
  return providerInstance({ apiKey: API_KEY })(model);
}

export type AiModeType = 'normal' | 'creative' | 'analytical';

export const AiMode: AiModeType[] = ['normal', 'creative', 'analytical'];
