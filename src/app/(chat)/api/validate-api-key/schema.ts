import { z } from "zod";
import { ModelProviders, type ModelProvider } from "@/lib/ai/models";

// creating a schema for strings
export const payloadSchema = z.object({
	provider: z.enum(ModelProviders as [ModelProvider, ...ModelProvider[]]),
	apiKey: z.string().min(1, "API key is required"),
});

export type PayloadType = z.infer<typeof payloadSchema>;
