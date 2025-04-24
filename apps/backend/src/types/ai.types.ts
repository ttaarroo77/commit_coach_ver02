import { z } from 'zod';

export const aiConfigSchema = z.object({
  model: z.enum(['gpt-3.5-turbo', 'gpt-4']).default('gpt-3.5-turbo'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4096).default(1000),
  systemPrompt: z.string().optional(),
});

export type AIConfig = z.infer<typeof aiConfigSchema>;

export const taskBreakdownSchema = z.object({
  taskId: z.string(),
  breakdown: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    estimatedTime: z.number().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  })),
});

export type TaskBreakdown = z.infer<typeof taskBreakdownSchema>;

export const aiMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export type AIMessage = z.infer<typeof aiMessageSchema>; 