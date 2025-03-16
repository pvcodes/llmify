import { z } from "zod";

export const payloadSchema = z.object({
	id: z.string().min(1, "Id not valid"),
	prompt: z.string().min(1, "API key is required"),
});

export type PayloadType = z.infer<typeof payloadSchema>;
