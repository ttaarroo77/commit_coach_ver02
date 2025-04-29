import { Database } from '@/lib/database.types';

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskAssignee {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  user_id?: string;
  assignee?: TaskAssignee;
  subtasks?: Subtask[];
}

export type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  project_id: string;
  assignee_id?: string;
  subtasks?: Omit<Subtask, 'id'>[];
};

export type TaskFilterValues = {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  project_id: string | 'all';
  assignee_id: string | 'all';
  due_date_range?: {
    from: Date;
    to: Date;
  };
};

// Supabaseの型定義から派生（将来的に使用）
export type TaskRow = Database['public']['Tables']['tasks']['Row'];
