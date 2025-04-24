import { z } from 'zod';

export const taskGroupSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  project_id: z.string().uuid(),
  order: z.number().int().min(0),
});

export const taskGroupUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0).optional(),
});

export type TaskGroup = z.infer<typeof taskGroupSchema>;
export type TaskGroupUpdate = z.infer<typeof taskGroupUpdateSchema>; 