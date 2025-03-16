import { z } from "zod";
import { ModelProviders, type ModelProviderType } from "@/lib/ai/models";

// creating a schema for strings
export const payloadSchema = z.object({
	provider: z.enum(
		ModelProviders as [ModelProviderType, ...ModelProviderType[]]
	),
	apiKey: z.string().min(1, "API key is required"),
});

export type PayloadType = z.infer<typeof payloadSchema>;
