import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  ownerId: z.string(),
  members: z.array(z.string()).optional(),
  status: z.enum(['active', 'archived', 'completed']).default('active'),
});

export type Project = z.infer<typeof projectSchema>;

export const updateProjectSchema = projectSchema.partial();
export type UpdateProject = z.infer<typeof updateProjectSchema>;
