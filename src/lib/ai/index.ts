import type { Models, ModelProviderType } from "./models";

/**
 * Validates an API key for the specified model provider.
 * @param provider The AI model provider
 * @param apiKey The API key to validate
 * @returns Promise resolving to whether the API key is valid
 */
export async function validateProviderAPIKey(
	provider: ModelProviderType,
	apiKey: string
): Promise<boolean> {
	if (!apiKey || typeof apiKey !== "string") {
		return false;
	}

	try {
		switch (provider) {
			case "OpenAI": {
				const response = await fetch(
					"https://api.openai.com/v1/models",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${apiKey}`,
						},
					}
				);
				return response.ok;
			}
			case "Anthropic": {
				const response = await fetch(
					"https://api.anthropic.com/v1/models",
					{
						method: "GET",
						headers: {
							"x-api-key": apiKey,
							"anthropic-version": "2023-06-01", // Include API version header
						},
					}
				);
				return response.ok;
			}
			case "DeepSeek": {
				const response = await fetch(
					"https://api.deepseek.com/v1/models",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${apiKey}`,
						},
					}
				);
				return response.ok;
			}
			case "xAi": {
				const response = await fetch(`https://api.x.ai/v1/api-key`, {
					method: "GET",
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

import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";

function getApiKey(
	provider: ModelProviderType,
	isPremiumUser: boolean,
	apiKey?: string
) {
	if (!isPremiumUser && !apiKey) {
		throw new Error("Invalid access: No API key provided");
	}
	const envKeys = {
		OpenAI: process.env.API_KEY_OPENAI,
		Anthropic: process.env.API_KEY_ANTHROPIC,
		DeepSeek: process.env.API_KEY_DEEPSEEK,
		xAi: process.env.API_KEY_XAI,
	};
	return isPremiumUser ? envKeys[provider] : apiKey;
}

/** AI Model Provider Mapping */
const modelProviders = {
	Anthropic: createAnthropic,
	DeepSeek: createDeepSeek,
	OpenAI: createOpenAI,
	xAi: createXai,
} as const;

export function model(
	provider: ModelProviderType,
	model: Models<ModelProviderType>,
	isPremiumUser = true,
	apiKey?: string
) {
	const API_KEY = getApiKey(provider, isPremiumUser, apiKey);
	const providerInstance = modelProviders[provider];

	if (!providerInstance) {
		throw new Error(`Invalid provider: ${provider}`);
	}

	return providerInstance({ apiKey: API_KEY })(model);
}
