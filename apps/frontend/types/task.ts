// タスクの優先度
export type TaskPriority = 'low' | 'medium' | 'high';

// タスクのステータス
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

// サブタスクの型定義
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

// タスクのタグ型定義
export interface TaskTag {
  id: string;
  name: string;
  color: string;
}

// タスクの型定義
export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assigneeId: string | null;
  subtasks?: SubTask[];
  completed: boolean;
  tags?: TaskTag[];
}

// タスクフォームの値型
export interface TaskFormValues {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
  tags?: TaskTag[];
}

// タスクグループの型定義
export interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
}

// カンバン列の型定義
export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}
