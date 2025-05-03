import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().uuid().optional(), // データベースで自動生成される場合はoptional
  title: z.string().min(1).max(100), // nameと同じ意味だが、UIとの一貫性のために追加
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  ownerId: z.string(),
  members: z.array(z.string()).optional(),
  status: z.enum(['active', 'archived', 'completed']).default('active'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Project = z.infer<typeof projectSchema>;

// データベースから取得したプロジェクトの型（idが必須）
export interface ProjectWithId extends Project {
  id: string;
}

export const updateProjectSchema = projectSchema.partial();
export type UpdateProject = z.infer<typeof updateProjectSchema>;
