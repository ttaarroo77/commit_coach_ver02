export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'blocked' | 'review'

// 優先度は英語と日本語表記の両方に対応
export type TaskPriorityEn = 'low' | 'medium' | 'high' | 'urgent'
export type TaskPriorityJa = '低' | '中' | '高' | '緊急'
export type TaskPriority = TaskPriorityEn | TaskPriorityJa

// 優先度の変換マッピング
export const PRIORITY_MAP: Record<TaskPriorityEn, TaskPriorityJa> = {
  'low': '低',
  'medium': '中',
  'high': '高',
  'urgent': '緊急'
}

export const PRIORITY_REVERSE_MAP: Record<TaskPriorityJa, TaskPriorityEn> = {
  '低': 'low',
  '中': 'medium',
  '高': 'high',
  '緊急': 'urgent'
}

export interface SubTask {
  id: string
  title: string
  description?: string
  completed: boolean
  assignee?: string
  createdAt?: string
  updatedAt?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  startTime?: string
  endTime?: string
  status: TaskStatus
  projectId: string  // 必須フィールドに変更
  priority: TaskPriority
  progress: number
  subtasks: SubTask[]
  expanded?: boolean
  dueDate?: string
  assignee?: string
  tags?: string[]
  createdAt: string   // 必須フィールドに変更
  updatedAt: string   // 必須フィールドに変更
  estimatedHours?: number // 追加：見積時間
  actualHours?: number    // 追加：実績時間
  isTemplate?: boolean    // 追加：テンプレートフラグ
  completed?: boolean     // 追加：project-template.tsxで使用されているため互換性維持用に追加
}

export interface TaskGroup {
  id: string
  title: string
  description?: string
  expanded: boolean
  tasks: Task[]
  dueDate?: string
  completed: boolean
  color?: string
  order?: number
}

export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  upcomingDeadlines: number
  overdueTasks: number
}

export interface UserActivity {
  id: string
  userId: string
  action: 'created' | 'updated' | 'completed' | 'deleted'
  entityType: 'task' | 'project' | 'group'
  entityId: string
  timestamp: string
  details?: string
}