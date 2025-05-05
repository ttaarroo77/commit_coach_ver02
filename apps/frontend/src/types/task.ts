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
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'todo' | 'in-progress' | 'completed';
  project_id?: string;
  project?: string;
  priority?: string;
  progress: number;
  subtasks: SubTask[];
  expanded?: boolean;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskGroup {
  id: string;
  title: string;
  expanded: boolean;
  tasks: Task[];
  dueDate?: string;
  completed: boolean;
}