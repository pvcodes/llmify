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

export const isApiKeyRequired = (
	tier: BillingLevel,
	modelProvider: ModelProviderType
) => {
	// if the user is accessing that model which is not included in his tier
	if (tier && modelProvider) {
		if (ModelProvidersViaTier[tier].includes(modelProvider)) {
			return false;
		}
	}
	return true;
};
