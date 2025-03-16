import { z } from "zod";

export const payloadSchema = z.object({
	subject: z.string(),
	message: z.string(),
});

export type PayloadType = z.infer<typeof payloadSchema>;
