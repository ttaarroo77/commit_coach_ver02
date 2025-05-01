import { z } from 'zod';

/**
 * タスクの優先度
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * タスクのステータス
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

/**
 * タスクの基本スキーマ
 */
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内にしてください'),
  description: z.string().max(2000, '説明は2000文字以内にしてください').optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string().uuid(),
  project_id: z.string().uuid().optional(),
  parent_task_id: z.string().uuid().optional(),
  position: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  assignee_id: z.string().uuid().optional(),
  completed_at: z.string().datetime().optional(),
  estimated_hours: z.number().nonnegative().optional(),
  actual_hours: z.number().nonnegative().optional(),
});

/**
 * タスク作成用スキーマ
 */
export const createTaskSchema = taskSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  completed_at: true,
});

/**
 * タスク更新用スキーマ
 */
export const updateTaskSchema = taskSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    user_id: true,
  })
  .partial();

/**
 * タスクのタイプ定義
 */
export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * サブタスクを含むタスクのタイプ定義
 */
export interface TaskWithSubtasks extends Task {
  subtasks?: TaskWithSubtasks[];
}

/**
 * タスクグループのタイプ定義
 */
export interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
  position: number;
}

export default {
  taskSchema,
  createTaskSchema,
  updateTaskSchema,
};
