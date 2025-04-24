import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskPriority, TaskStatus } from '../../types/task.types';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const createTestUser = async () => {
  const email = `test-${uuidv4()}@example.com`;
  const password = 'password123';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data.user!;
};

export const deleteTestUser = async (userId: string) => {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
};

export const createTestProject = async (userId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: 'テストプロジェクト',
      description: 'テスト用のプロジェクトです',
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTestProject = async (id: string) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

export const createTestTaskGroup = async (userId: string, projectId: string) => {
  const { data, error } = await supabase
    .from('task_groups')
    .insert({
      title: 'テストタスクグループ',
      description: 'テスト用のタスクグループです',
      project_id: projectId,
      user_id: userId,
      order: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTestTaskGroup = async (id: string) => {
  const { error } = await supabase.from('task_groups').delete().eq('id', id);
  if (error) throw error;
};

export const createTestTask = async (
  userId: string,
  projectId: string,
  groupId?: string,
  parentId?: string
): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: 'テストタスク',
      description: 'テスト用のタスクです',
      project_id: projectId,
      group_id: groupId || null,
      parent_id: parentId || null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      due_date: new Date().toISOString(),
      user_id: userId,
      order: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTestTask = async (id: string) => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}; 