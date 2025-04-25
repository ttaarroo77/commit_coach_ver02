import { createClient } from '@supabase/supabase-js';
import { Task, TaskUpdate, TaskPriority, TaskStatus } from '../types/task.types';
import { ApiError } from '../middleware/errorHandler';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

/**
 * タスク管理サービス
 * タスクのCRUD操作やステータス更新などの機能を提供する
 */
export class TaskService {
  async createTask(userId: string, data: Omit<Task, 'order'>): Promise<Task> {
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

    // グループの所有権を確認（指定されている場合）
    if (data.group_id) {
      const { data: group, error: groupError } = await supabase
        .from('task_groups')
        .select('id')
        .eq('id', data.group_id)
        .eq('user_id', userId)
        .single();

      if (groupError || !group) {
        throw new ApiError(404, 'タスクグループが見つかりません');
      }
    }

    // 親タスクの所有権を確認（指定されている場合）
    if (data.parent_id) {
      const { data: parent, error: parentError } = await supabase
        .from('tasks')
        .select('id')
        .eq('id', data.parent_id)
        .eq('user_id', userId)
        .single();

      if (parentError || !parent) {
        throw new ApiError(404, '親タスクが見つかりません');
      }
    }

    // 新しいタスクの順序を決定
    const { data: lastTask, error: lastTaskError } = await supabase
      .from('tasks')
      .select('order')
      .eq('project_id', data.project_id)
      .eq('group_id', data.group_id || null)
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const order = lastTask ? lastTask.order + 1 : 0;

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({ ...data, order, user_id: userId })
      .select()
      .single();

    if (error) {
      throw new ApiError(500, 'タスクの作成に失敗しました');
    }

    return task;
  }

  async getTasksByProject(userId: string, projectId: string): Promise<Task[]> {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .order('order', { ascending: true });

    if (error) {
      throw new ApiError(500, 'タスクの取得に失敗しました');
    }

    return tasks;
  }

  async getTasksByGroup(userId: string, groupId: string): Promise<Task[]> {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .order('order', { ascending: true });

    if (error) {
      throw new ApiError(500, 'タスクの取得に失敗しました');
    }

    return tasks;
  }

  async getTaskById(userId: string, id: string): Promise<Task | null> {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new ApiError(500, 'タスクの取得に失敗しました');
    }

    return task;
  }

  async updateTask(
    userId: string,
    id: string,
    updates: TaskUpdate
  ): Promise<Task> {
    const { data: task, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ApiError(404, 'タスクが見つかりません');
      }
      throw new ApiError(500, 'タスクの更新に失敗しました');
    }

    return task;
  }

  async deleteTask(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new ApiError(500, 'タスクの削除に失敗しました');
    }
  }

  async updateTaskOrder(
    userId: string,
    id: string,
    newOrder: number,
    projectId: string,
    groupId?: string
  ): Promise<void> {
    // トランザクション内で順序の更新を行う
    const { error } = await supabase.rpc('update_task_order', {
      p_user_id: userId,
      p_task_id: id,
      p_new_order: newOrder,
      p_project_id: projectId,
      p_group_id: groupId || null,
    });

    if (error) {
      throw new ApiError(500, 'タスクの順序更新に失敗しました');
    }
  }

  /**
   * 親タスクに紐づくサブタスクを取得する
   * @param userId ユーザーID
   * @param parentId 親タスクID
   * @returns サブタスク一覧
   */
  async getSubtasks(userId: string, parentId: string): Promise<Task[]> {
    try {
      const { data: subtasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('parent_id', parentId)
        .eq('user_id', userId)
        .order('order', { ascending: true });

      if (error) {
        throw new ApiError(500, `サブタスク取得エラー: ${error.message}`);
      }

      return subtasks || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'サブタスク取得中に予期せぬエラーが発生しました');
    }
  }

  async updateTaskStatus(
    userId: string,
    id: string,
    status: TaskStatus
  ): Promise<Task> {
    const { data: task, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ApiError(404, 'タスクが見つかりません');
      }
      throw new ApiError(500, 'タスクのステータス更新に失敗しました');
    }

    return task;
  }

  /**
   * タスクの期限を更新する
   * @param userId ユーザーID
   * @param id タスクID
   * @param dueDate 期限日
   * @returns 更新されたタスク
   */
  async updateTaskDueDate(
    userId: string,
    id: string,
    dueDate: string
  ): Promise<Task> {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .update({ due_date: dueDate })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError(404, 'タスクが見つかりません');
        }
        throw new ApiError(500, `タスクの期限更新エラー: ${error.message}`);
      }

      return task;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスクの期限更新中に予期せぬエラーが発生しました');
    }
  }
  
  /**
   * タスクの優先度を更新する
   * @param userId ユーザーID
   * @param id タスクID
   * @param priority 優先度
   * @returns 更新されたタスク
   */
  async updateTaskPriority(
    userId: string,
    id: string,
    priority: TaskPriority
  ): Promise<Task> {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .update({ priority })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError(404, 'タスクが見つかりません');
        }
        throw new ApiError(500, `タスクの優先度更新エラー: ${error.message}`);
      }

      return task;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスクの優先度更新中に予期せぬエラーが発生しました');
    }
  }
  
  /**
   * 複数のタスクを一括更新する
   * @param userId ユーザーID
   * @param tasks 更新するタスクの配列
   * @returns 更新されたタスクの配列
   */
  async bulkUpdateTasks(
    userId: string,
    tasks: { id: string; updates: TaskUpdate }[]
  ): Promise<Task[]> {
    try {
      // トランザクションを開始
      const { error: beginError } = await supabase.rpc('begin_transaction');
      if (beginError) {
        throw new ApiError(500, `トランザクション開始エラー: ${beginError.message}`);
      }
      
      const updatedTasks: Task[] = [];
      
      // 各タスクを更新
      for (const task of tasks) {
        const { data, error } = await supabase
          .from('tasks')
          .update(task.updates)
          .eq('id', task.id)
          .eq('user_id', userId)
          .select()
          .single();
          
        if (error) {
          // エラーが発生した場合はロールバック
          await supabase.rpc('rollback_transaction');
          if (error.code === 'PGRST116') {
            throw new ApiError(404, `タスクID ${task.id} が見つかりません`);
          }
          throw new ApiError(500, `タスク一括更新エラー: ${error.message}`);
        }
        
        if (data) updatedTasks.push(data);
      }
      
      // トランザクションをコミット
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) {
        throw new ApiError(500, `トランザクションコミットエラー: ${commitError.message}`);
      }
      
      return updatedTasks;
    } catch (error) {
      // 予期せぬエラーが発生した場合はロールバックを試みる
      try {
        await supabase.rpc('rollback_transaction');
      } catch (rollbackError) {
        console.error('ロールバック失敗:', rollbackError);
      }
      
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク一括更新中に予期せぬエラーが発生しました');
    }
  }
} 