import { z } from "zod";
import { ModelProviders, type ModelProviderType } from "@/lib/ai/models";

export const payloadSchema = z.object({
	id: z.string(),
	messages: z.array(z.any()),
	modelConfig: z.object({
		provider: z.enum(
			ModelProviders as [ModelProviderType, ...ModelProviderType[]]
		),
		model: z.object({
			value: z.string().or(z.null()),
		}),
	}),
	apiKey: z.string().optional(),
});

export type PayloadType = z.infer<typeof payloadSchema>;
