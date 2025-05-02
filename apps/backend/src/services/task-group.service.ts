import { TaskGroup, TaskGroupUpdate } from '../types/task-group.types';
import { ApiError } from '../middleware/errorHandler';
import { supabaseAnon } from '../config/supabase';

// config/supabase.tsから初期化済みのクライアントを使用
const supabase = supabaseAnon;

export class TaskGroupService {
  async createTaskGroup(userId: string, data: Omit<TaskGroup, 'order'>): Promise<TaskGroup> {
    // プロジェクトの所有権を確認
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', data.project_id)
      .eq('user_id', userId)
      .single();

    if (projectError || !project) {
      throw new ApiError(404, 'プロジェクトが見つかりません');
    }

    // 新しいタスクグループの順序を決定
    const { data: lastGroup, error: lastGroupError } = await supabase
      .from('task_groups')
      .select('order')
      .eq('project_id', data.project_id)
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const order = lastGroup ? lastGroup.order + 1 : 0;

    const { data: taskGroup, error } = await supabase
      .from('task_groups')
      .insert({ ...data, order, user_id: userId })
      .select()
      .single();

    if (error) {
      throw new ApiError(500, 'タスクグループの作成に失敗しました');
    }

    return taskGroup;
  }

  async getTaskGroupsByProject(userId: string, projectId: string): Promise<TaskGroup[]> {
    const { data: taskGroups, error } = await supabase
      .from('task_groups')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .order('order', { ascending: true });

    if (error) {
      throw new ApiError(500, 'タスクグループの取得に失敗しました');
    }

    return taskGroups;
  }

  async getTaskGroupById(userId: string, id: string): Promise<TaskGroup | null> {
    const { data: taskGroup, error } = await supabase
      .from('task_groups')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new ApiError(500, 'タスクグループの取得に失敗しました');
    }

    return taskGroup;
  }

  async updateTaskGroup(userId: string, id: string, updates: TaskGroupUpdate): Promise<TaskGroup> {
    const { data: taskGroup, error } = await supabase
      .from('task_groups')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ApiError(404, 'タスクグループが見つかりません');
      }
      throw new ApiError(500, 'タスクグループの更新に失敗しました');
    }

    return taskGroup;
  }

  async deleteTaskGroup(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('task_groups')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new ApiError(500, 'タスクグループの削除に失敗しました');
    }
  }

  async updateTaskGroupOrder(
    userId: string,
    id: string,
    newOrder: number,
    projectId: string
  ): Promise<void> {
    // トランザクション内で順序の更新を行う
    const { error } = await supabase.rpc('update_task_group_order', {
      p_user_id: userId,
      p_group_id: id,
      p_new_order: newOrder,
      p_project_id: projectId,
    });

    if (error) {
      throw new ApiError(500, 'タスクグループの順序更新に失敗しました');
    }
  }
}

export const taskGroupService = new TaskGroupService();
