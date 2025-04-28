import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1).max(1000),
});

export type ChatRequest = z.infer<typeof chatSchema>; 