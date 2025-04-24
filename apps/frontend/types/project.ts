import { TaskGroup, TaskPriorityEn, TaskPriorityJa, TaskPriority, PRIORITY_MAP, PRIORITY_REVERSE_MAP } from './dashboard'

export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold'
// Projectの優先度はTask型と共通化
export type { TaskPriorityEn as ProjectPriorityEn, TaskPriorityJa as ProjectPriorityJa, TaskPriority as ProjectPriority }

export interface Project {
  id: string
  title: string
  description?: string
  startDate?: string
  dueDate?: string
  status: ProjectStatus
  priority: TaskPriority // 共通の優先度型を使用
  progress: number
  color?: string
  taskGroups: TaskGroup[]
  tags?: string[]
  owner: string
  collaborators?: string[]
  createdAt: string
  updatedAt: string
  estimatedHours?: number // 見積時間の追加
  actualHours?: number    // 実績時間の追加
  isTemplate?: boolean    // テンプレートフラグの追加
  archived?: boolean      // アーカイブフラグの追加
  category?: string       // カテゴリ分類の追加
}

export interface ProjectSummary {
  id: string
  title: string
  description?: string
  dueDate?: string
  status: ProjectStatus
  priority: TaskPriority // 共通の優先度型を使用
  progress: number
  color?: string
  taskCount: number
  completedTaskCount: number
  estimatedHours?: number // 見積時間の追加
  actualHours?: number    // 実績時間の追加 
  isTemplate?: boolean    // テンプレートフラグの追加
  archived?: boolean      // アーカイブフラグの追加
  lastUpdated?: string    // 最終更新日時の追加
}
