import { z } from 'zod';

/**
 * プロジェクトタイプの列挙型
 */
export enum ProjectType {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  DESIGN = 'design',
  BACKEND = 'backend',
  FRONTEND = 'frontend',
  FULLSTACK = 'fullstack',
  OTHER = 'other',
}

/**
 * プロジェクトのステータス
 */
export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

/**
 * プロジェクトのスキーマ定義
 */
export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * プロジェクト作成のスキーマ定義
 */
export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * プロジェクト更新のスキーマ定義
 */
export const updateProjectSchema = createProjectSchema.partial();

/**
 * プロジェクトのタイプ定義
 */
export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

/**
 * タスク統計情報を含むプロジェクト
 */
export interface ProjectWithStats extends Project {
  taskStats?: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
  };
}
