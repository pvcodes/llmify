import { z } from 'zod';

import type { ModelProvider } from '@/lib/ai/models';
import { ModelProviders, getModelsForProvider } from '@/lib/ai/models';

export const payloadSchema = z.object({
  id: z.string(),
  messages: z.array(z.any()),
  modelConfig: z
    .object({
      provider: z.enum(ModelProviders as [ModelProvider, ...ModelProvider[]]), // Updated to use ModelProvider
      model: z.object({
        value: z.string(), // Updated to use Value
      }),
    })
    .refine(
      ({ provider, model }) => {
        // ENTERPRISE as it will have all provided models,
        return getModelsForProvider('ENTERPRISE', provider).some(
          (obj) => obj.value === model.value
        );
      },
      {
        message: 'Invalid model for the selected provider',
        path: ['model', 'Value'], // Updated to use Value
      }
    ),
  apiKey: z
    .string()
    .optional()
    .transform((apiKey) => (apiKey === 'undefined' ? undefined : apiKey)),
  editedMessageId: z.string().optional(),
});

export type PayloadType = z.infer<typeof payloadSchema>;
