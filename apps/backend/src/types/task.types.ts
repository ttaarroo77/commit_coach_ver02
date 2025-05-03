import { z } from 'zod';

// タスクの優先度と状態の定数
export const TaskPriority = {
  LOW: 'LOW' as const,
  MEDIUM: 'MEDIUM' as const,
  HIGH: 'HIGH' as const,
} as const;

export const TaskStatus = {
  TODO: 'TODO' as const,
  IN_PROGRESS: 'IN_PROGRESS' as const,
  DONE: 'DONE' as const,
} as const;

// タスクの優先度
export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);

// タスクの基本スキーマ
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  project_id: z.string().uuid(),
  group_id: z.string().uuid().optional(),
  parent_id: z.string().uuid().optional(),
  priority: taskPriorityEnum.default('MEDIUM'),
  status: taskStatusEnum.default('TODO'),
  due_date: z.string().datetime().optional(),
  position: z.number().int().min(0),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// タスクの更新スキーマ
export const taskUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  group_id: z.string().uuid().optional(),
  parent_id: z.string().uuid().optional(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
  due_date: z.string().datetime().optional(),
  position: z.number().int().min(0).optional(),
});

// タスクの型
export type Task = z.infer<typeof taskSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;
export type TaskPriority = z.infer<typeof taskPriorityEnum>;
export type TaskStatus = z.infer<typeof taskStatusEnum>;

// タスクのレスポンス型
export interface TaskResponse extends Task {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}
