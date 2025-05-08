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
 * タスクのスキーマ定義
 */
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().datetime(),
  projectId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * タスク作成のスキーマ定義
 */
export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * タスク更新のスキーマ定義
 */
export const updateTaskSchema = createTaskSchema.partial();

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
