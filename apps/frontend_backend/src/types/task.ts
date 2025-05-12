export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Subtask extends SubTask {
  // 互換性のために残す
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskGroup {
  id: string;
  title: string;
  expanded: boolean;
  tasks: Task[];
  dueDate?: string;
  completed: boolean;
}
