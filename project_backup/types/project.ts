import { Database } from '@/lib/database.types';

export type ProjectStatus = 'active' | 'completed' | 'archived';

export type ProjectWithStats = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
  // 統計情報
  taskCount: number;
  completedTaskCount: number;
  progress: number; // 0-100のパーセンテージ
};

export type ProjectFormValues = {
  name: string;
  description: string;
  status: ProjectStatus;
};

export type ProjectFilterValues = {
  search: string;
  status: ProjectStatus | 'all';
  sortBy: 'name' | 'created_at' | 'updated_at';
  sortDirection: 'asc' | 'desc';
};

// Supabaseの型定義から派生
export type Project = Database['public']['Tables']['projects']['Row'] & {
  status: ProjectStatus;
};
