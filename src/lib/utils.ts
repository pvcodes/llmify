import { type BillingLevel } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";
import { ModelProvidersViaTier, type ModelProviderType } from "./ai/models";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const generateChatId = () => {
	const chatId = `ch-${uuid()}`;
	return chatId;
};

export const hasApiKeyForSelectedModel = (
	modelProvider: ModelProviderType,
	apiKeys: Partial<Record<ModelProviderType, string>>
) => {
	if (Object.keys(apiKeys).includes(modelProvider)) return true;
	return false;
};
