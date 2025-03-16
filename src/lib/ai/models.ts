import { BillingLevel } from "@prisma/client";

export type ModelProviderType = keyof typeof AIModelProviders;

export interface ModelOption {
	label: string;
	value: string;
}

export const AIModelProviders = {
	OpenAI: [
		{ label: "GPT-4o", value: "gpt-4o" },
		{ label: "GPT-40 Mini", value: "gpt-40-mini" },
		{ label: "GPT-4 Turbo", value: "gpt-4-turbo" },
		{ label: "O1", value: "o1" },
		{ label: "O1 Mini", value: "o1-mini" },
		{ label: "GPT-4", value: "gpt-4" },
	],
	Anthropic: [
		{ label: "Claude 3.5 Haiku", value: "claude-3-5-haiku-latest" },
		{ label: "Claude 3.7 Sonnet", value: "claude-3-7-sonnet-20250219" },
		{ label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20241022" },
	],
	DeepSeek: [{ label: "DeepSeek Chat", value: "deepseek-chat" }],
	xAi: [
		{ label: "Grok 2", value: "grok-2-1212" },
		{ label: "Grok 2 Vision", value: "grok-2-vision-1212" },
		{ label: "Grok Beta", value: "grok-beta" },
	],
} as const;

export const ModelProvidersViaTier: Record<BillingLevel, ModelProviderType[]> =
	{
		FREE: ["Anthropic"],
		PREMIUM: ["Anthropic", "OpenAI", "DeepSeek"],
		ENTERPRISE: Object.keys(AIModelProviders) as ModelProviderType[],
	} as const;

export const ProviderDescriptions: Record<ModelProviderType, string> = {
	OpenAI: "API key for OpenAI models (GPT-4, GPT-3.5, etc.)",
	Anthropic: "API key for Anthropic models (Claude series)",
	DeepSeek: "API key for DeepSeek models",
	xAi: "API key for xAI models (Grok series)",
};

export const ModelProviders = Object.keys(
	AIModelProviders
) as ModelProviderType[];

export type Models<K extends keyof typeof AIModelProviders> =
	(typeof AIModelProviders)[K][number]["value"];

