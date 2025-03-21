import { z } from "zod";
import {
	AIModelProviders,
	ModelProviders,
	type ModelProviderType,
} from "@/lib/ai/models";

export const payloadSchema = z.object({
	id: z.string(),
	messages: z.array(z.any()),
	modelConfig: z
		.object({
			provider: z.enum(
				ModelProviders as [ModelProviderType, ...ModelProviderType[]]
			),
			model: z.object({
				value: z.string(),
			}),
		})
		.refine(
			({ provider, model }) => {
				if (
					AIModelProviders[provider].find(
						(obj) => obj.value === model.value
					)
				) {
					return true;
				}
				return false;
			},
			{
				message: "Invalid model for the selected provider",
				path: ["model", "value"],
			}
		),
	apiKey: z.string().optional(),
	messageId: z.string().optional(),
});

export type PayloadType = z.infer<typeof payloadSchema>;
