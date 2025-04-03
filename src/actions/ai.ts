'use server';

import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

import { type ModelProvider } from '@/lib/ai/models';
const DEFAULT_MODEL = createAnthropic({ apiKey: process.env.API_KEY_ANTHROPIC })(
  'claude-3-5-haiku-latest'
);

export async function validateProviderAPIKey(
  provider: ModelProvider,
  apiKey: string
): Promise<boolean> {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  try {
    switch (provider) {
      case 'OpenAI': {
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        return response.ok;
      }
      case 'Anthropic': {
        const response = await fetch('https://api.anthropic.com/v1/models', {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01', // Include API version header
          },
        });
        return response.ok;
      }
      case 'DeepSeek': {
        const response = await fetch('https://api.deepseek.com/v1/models', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        return response.ok;
      }
      case 'xAi': {
        const response = await fetch(`https://api.x.ai/v1/api-key`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        return response.ok;
      }
      default: {
        console.warn(`Unrecognized provider: ${provider}`);
        return false;
      }
    }
  } catch (error) {
    console.error(`Error validating API key for ${provider}:`, error);
    return false;
  }
}

export const generateFromAi = async ({
  prompt,
  systemPrompt,
}: {
  prompt: string;
  systemPrompt: string;
}) => {
  try {
    const { text } = await generateText({
      model: DEFAULT_MODEL,
      system: systemPrompt,
      prompt,
    });
    return text;
  } catch (error) {
    console.error(error);
    return null;
  }
};
