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
  OTHER = 'other'
}

/**
 * プロジェクトのステータス
 */
export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

/**
 * プロジェクトの基本スキーマ
 */
export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'プロジェクト名は必須です').max(100, 'プロジェクト名は100文字以内にしてください'),
  description: z.string().max(2000, '説明は2000文字以内にしてください').optional(),
  type: z.nativeEnum(ProjectType).default(ProjectType.WEB_APP),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PLANNING),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  user_id: z.string().uuid(),
  team_id: z.string().uuid().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  is_favorite: z.boolean().default(false),
  github_repo: z.string().optional(),
  tech_stack: z.array(z.string()).optional(),
});

/**
 * プロジェクト作成用スキーマ
 */
export const createProjectSchema = projectSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

/**
 * プロジェクト更新用スキーマ
 */
export const updateProjectSchema = projectSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    user_id: true
  })
  .partial();

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

export default {
  projectSchema,
  createProjectSchema,
  updateProjectSchema,
};
