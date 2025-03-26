import type { BillingLevel } from "@prisma/client";

/** Represents the available AI model providers. */
export type ModelProvider = "OpenAI" | "Anthropic" | "DeepSeek" | "xAi";

/** Defines a selectable model with a display label and unique value. */
export interface ModelOption {
	label: string;
	value: string;
}

export const ModelProviders: ModelProvider[] = [
	"OpenAI",
	"Anthropic",
	"DeepSeek",
	"xAi",
];

export const allModels: Record<ModelProvider, ModelOption[]> = {
	OpenAI: [
		{ label: "GPT-4o", value: "gpt-4o" },
		{ label: "GPT-4o Mini", value: "gpt-40-mini" },
		{ label: "O1", value: "o1" },
		{ label: "O1 Mini", value: "o1-mini" },
	],
	Anthropic: [
		{ label: "Claude 3.5 Haiku", value: "claude-3-5-haiku-latest" },
		{ label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20241022" },
		{ label: "Claude 3.7 Sonnet", value: "claude-3-7-sonnet-20250219" },
	],
	DeepSeek: [
		{ label: "DeepSeek Chat", value: "deepseek-chat" },
		{ label: "DeepSeek Reasoner", value: "deepseek-reasoner" },
	],
	xAi: [
		{ label: "Grok 2", value: "grok-2-1212" },
		{ label: "Grok 2 Vision", value: "grok-2-vision-1212" },
	],
} as const;

/** Maps billing tiers to available model providers and their model options. */
export const ModelProvidersViaTier: Record<
	BillingLevel,
	Record<ModelProvider, ModelOption[]>
> = {
	FREE: {
		OpenAI: allModels.OpenAI.filter((m) =>
			["gpt-40-mini"].includes(m.value)
		),
		Anthropic: allModels.Anthropic.filter(
			(m) => m.value === "claude-3-5-haiku-latest"
		),
		DeepSeek: allModels.DeepSeek.filter((m) => m.value === "deepseek-chat"),
		xAi: [],
	},
	PREMIUM: {
		OpenAI: allModels.OpenAI.filter((m) =>
			["gpt-4o", "gpt-40-mini", "o1-mini"].includes(m.value)
		),
		Anthropic: allModels.Anthropic.filter(
			(m) => m.value !== "claude-3-7-sonnet-20250219"
		),
		DeepSeek: allModels.DeepSeek,
		xAi: allModels.xAi,
	},
	ENTERPRISE: {
		OpenAI: allModels.OpenAI,
		Anthropic: allModels.Anthropic,
		DeepSeek: allModels.DeepSeek,
		xAi: allModels.xAi,
	},
} as const;

export const ProviderDescriptions: Record<ModelProvider, string> = {
	OpenAI: "API key for OpenAI models (GPT-4, GPT-3.5, etc.)",
	Anthropic: "API key for Anthropic models (Claude series)",
	DeepSeek: "API key for DeepSeek models",
	xAi: "API key for xAI models (Grok series)",
};

export type Models<K extends ModelProvider> =
	(typeof ModelProvidersViaTier)[keyof typeof ModelProvidersViaTier][K][number]["value"];

/** Get available models for a provider at a specific billing level. */
export function getModelsForProvider(
	tier: BillingLevel,
	provider: ModelProvider
): ModelOption[] {
	return ModelProvidersViaTier[tier][provider];
}
