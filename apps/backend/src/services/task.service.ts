import { ApiError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { CreateTaskInput, UpdateTaskInput } from '../models/task.model';
import dbService from './database.service';

/**
 * タスク関連のサービスクラス
 * タスクのCRUD操作やステータス更新などの機能を提供する
 */
export class TaskService {
  async createTask(userId: string, data: CreateTaskInput): Promise<Task> {
    try {
      logger.info({ userId, taskData: data }, 'タスク作成開始');

      // プロジェクトの所有権を確認
      const { data: projects, error: projectError } = await dbService.select('projects', {
        filters: { id: data.project_id, user_id: userId },
      });

      if (projectError || !projects || projects.length === 0) {
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }

      // 親タスクの所有権を確認（指定されている場合）
      if (data.parent_task_id) {
        const { data: parents, error: parentError } = await dbService.select('tasks', {
          filters: { id: data.parent_task_id, user_id: userId },
        });

        if (parentError || !parents || parents.length === 0) {
          throw new ApiError(404, '親タスクが見つかりません');
        }
      }

      // 新しいタスクの順序を決定
      const { data: lastTasks } = await dbService.select('tasks', {
        filters: { project_id: data.project_id },
        orderBy: { column: 'position', ascending: false },
        limit: 1,
      });

      const position = lastTasks && lastTasks.length > 0 ? lastTasks[0].position + 1 : 0;

      // タスクを作成
      const { data: newTask, error } = await dbService.insert('tasks', {
        ...data,
        position,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error({ error }, 'タスク作成エラー');
        throw new ApiError(500, 'タスクの作成に失敗しました');
      }

      logger.info({ taskId: newTask?.[0]?.id }, 'タスク作成成功');
      return newTask?.[0] as Task;
    } catch (error) {
      logger.error({ error }, 'タスク作成例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク作成中に予期せぬエラーが発生しました');
    }
  }

  async getTasksByProject(userId: string, projectId: string): Promise<Task[]> {
    try {
      logger.info({ userId, projectId }, 'プロジェクトのタスク取得開始');

      // プロジェクトの所有権を確認
      const { data: projects, error: projectError } = await dbService.select('projects', {
        filters: { id: projectId, user_id: userId },
      });

      if (projectError || !projects || projects.length === 0) {
        throw new ApiError(404, 'プロジェクトが見つかりません');
      }

      // プロジェクトに属するタスクを取得
      const { data: tasks, error } = await dbService.select('tasks', {
        filters: { project_id: projectId },
        orderBy: { column: 'position', ascending: true },
      });

      if (error) {
        logger.error({ error }, 'タスク取得エラー');
        throw new ApiError(500, 'タスクの取得に失敗しました');
      }

      logger.info({ taskCount: tasks?.length }, 'タスク取得成功');
      return tasks || [];
    } catch (error) {
      logger.error({ error }, 'タスク取得例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク取得中に予期せぬエラーが発生しました');
    }
  }

  async getTasksByGroup(userId: string, groupId: string): Promise<Task[]> {
    try {
      logger.info({ userId, groupId }, 'グループのタスク取得開始');

      // グループの所有権を確認
      const { data: groups, error: groupError } = await dbService.select('task_groups', {
        filters: { id: groupId, user_id: userId },
      });

      if (groupError || !groups || groups.length === 0) {
        throw new ApiError(404, 'タスクグループが見つかりません');
      }

      // グループに属するタスクを取得
      const { data: tasks, error } = await dbService.select('tasks', {
        filters: { group_id: groupId },
        orderBy: { column: 'position', ascending: true },
      });

      if (error) {
        logger.error({ error }, 'タスク取得エラー');
        throw new ApiError(500, 'タスクの取得に失敗しました');
      }

      logger.info({ taskCount: tasks?.length }, 'タスク取得成功');
      return tasks || [];
    } catch (error) {
      logger.error({ error }, 'タスク取得例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク取得中に予期せぬエラーが発生しました');
    }
  }

  async getTaskById(userId: string, id: string): Promise<Task | null> {
    try {
      logger.info({ userId, taskId: id }, 'タスク詳細取得開始');

      const { data: tasks, error } = await dbService.select('tasks', {
        filters: { id, user_id: userId },
      });

      if (error) {
        logger.error({ error }, 'タスク取得エラー');
        throw new ApiError(500, 'タスクの取得に失敗しました');
      }

      if (!tasks || tasks.length === 0) {
        logger.info({ taskId: id }, 'タスクが見つかりません');
        return null;
      }

      logger.info({ taskId: id }, 'タスク取得成功');
      return tasks[0] as Task;
    } catch (error) {
      logger.error({ error }, 'タスク取得例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク取得中に予期せぬエラーが発生しました');
    }
  }

  async updateTask(userId: string, id: string, updates: UpdateTaskInput): Promise<Task> {
    try {
      logger.info({ userId, taskId: id, updates }, 'タスク更新開始');

      // タスクの存在と所有権を確認
      const { data: tasks, error: checkError } = await dbService.select('tasks', {
        filters: { id, user_id: userId },
      });

      if (checkError || !tasks || tasks.length === 0) {
        logger.error({ error: checkError }, 'タスク確認エラー');
        throw new ApiError(404, 'タスクが見つかりません');
      }

      // タスクを更新
      const { data: updatedTask, error } = await dbService.update('tasks', id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error({ error }, 'タスク更新エラー');
        throw new ApiError(500, 'タスクの更新に失敗しました');
      }

      logger.info({ taskId: id }, 'タスク更新成功');
      return updatedTask?.[0] as Task;
    } catch (error) {
      logger.error({ error }, 'タスク更新例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク更新中に予期せぬエラーが発生しました');
    }
  }

  async deleteTask(userId: string, id: string): Promise<void> {
    try {
      logger.info({ userId, taskId: id }, 'タスク削除開始');

      // タスクの存在と所有権を確認
      const { data: tasks, error: checkError } = await dbService.select('tasks', {
        filters: { id, user_id: userId },
      });

      if (checkError || !tasks || tasks.length === 0) {
        logger.error({ error: checkError }, 'タスク確認エラー');
        throw new ApiError(404, 'タスクが見つかりません');
      }

      // タスクを削除
      const { error } = await dbService.delete('tasks', id);

      if (error) {
        logger.error({ error }, 'タスク削除エラー');
        throw new ApiError(500, 'タスクの削除に失敗しました');
      }

      logger.info({ taskId: id }, 'タスク削除成功');
    } catch (error) {
      logger.error({ error }, 'タスク削除例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク削除中に予期せぬエラーが発生しました');
    }
  }

  async updateTaskOrder(
    userId: string,
    id: string,
    newOrder: number,
    projectId: string,
    groupId?: string
  ): Promise<void> {
    try {
      logger.info({ userId, taskId: id, newOrder, projectId, groupId }, 'タスク順序更新開始');

      // タスクの存在と所有権を確認
      const { data: tasks, error: checkError } = await dbService.select('tasks', {
        filters: { id, user_id: userId },
      });

      if (checkError || !tasks || tasks.length === 0) {
        logger.error({ error: checkError }, 'タスク確認エラー');
        throw new ApiError(404, 'タスクが見つかりません');
      }

      // トランザクション内で順序の更新を行う
      // サーバーサイド関数の呼び出しは保持
      const { error } = await dbService.rpc('update_task_order', {
        p_user_id: userId,
        p_task_id: id,
        p_new_order: newOrder,
        p_project_id: projectId,
        p_group_id: groupId || null,
      });

      if (error) {
        logger.error({ error }, 'タスク順序更新エラー');
        throw new ApiError(500, 'タスクの順序更新に失敗しました');
      }

      logger.info({ taskId: id, newOrder }, 'タスク順序更新成功');
    } catch (error) {
      logger.error({ error }, 'タスク順序更新例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク順序更新中に予期せぬエラーが発生しました');
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
      logger.info({ userId, parentId }, 'サブタスク取得開始');

      // 親タスクの存在と所有権を確認
      const { data: parentTasks, error: parentError } = await dbService.select('tasks', {
        filters: { id: parentId, user_id: userId },
      });

      if (parentError || !parentTasks || parentTasks.length === 0) {
        logger.error({ error: parentError }, '親タスク確認エラー');
        throw new ApiError(404, '親タスクが見つかりません');
      }

      // サブタスクを取得
      const { data: subtasks, error } = await dbService.select('tasks', {
        filters: { parent_id: parentId, user_id: userId },
        orderBy: { column: 'order', ascending: true },
      });

      if (error) {
        logger.error({ error }, 'サブタスク取得エラー');
        throw new ApiError(500, 'サブタスクの取得に失敗しました');
      }

      logger.info({ parentId, subtaskCount: subtasks?.length }, 'サブタスク取得成功');
      return subtasks || [];
    } catch (error) {
      logger.error({ error }, 'サブタスク取得例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'サブタスク取得中に予期せぬエラーが発生しました');
    }
  }

  async updateTaskStatus(userId: string, id: string, status: TaskStatus): Promise<Task> {
    try {
      logger.info({ userId, taskId: id, status }, 'タスクステータス更新開始');

      // タスクの存在と所有権を確認
      const { data: tasks, error: checkError } = await dbService.select('tasks', {
        filters: { id, user_id: userId },
      });

      if (checkError || !tasks || tasks.length === 0) {
        logger.error({ error: checkError }, 'タスク確認エラー');
        throw new ApiError(404, 'タスクが見つかりません');
      }

      // タスクステータスを更新
      const { data: updatedTask, error } = await dbService.update('tasks', id, {
        status,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error({ error }, 'タスクステータス更新エラー');
        throw new ApiError(500, 'タスクのステータス更新に失敗しました');
      }

      logger.info({ taskId: id, status }, 'タスクステータス更新成功');
      return updatedTask?.[0] as Task;
    } catch (error) {
      logger.error({ error }, 'タスクステータス更新例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスクステータス更新中に予期せぬエラーが発生しました');
    }
  }

  /**
   * タスクの期日を更新する
   */
  async updateTaskDueDate(userId: string, id: string, dueDate: string): Promise<Task> {
    try {
      logger.info({ userId, taskId: id, dueDate }, 'タスク期日更新開始');

      // タスクの存在と所有権を確認
      const { data: tasks, error: checkError } = await dbService.select('tasks', {
        filters: { id, user_id: userId },
      });

      if (checkError || !tasks || tasks.length === 0) {
        logger.error({ error: checkError }, 'タスク確認エラー');
        throw new ApiError(404, 'タスクが見つかりません');
      }

      // タスク期日を更新
      const { data: updatedTask, error } = await dbService.update('tasks', id, {
        due_date: dueDate,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error({ error }, 'タスク期日更新エラー');
        throw new ApiError(500, 'タスクの期日更新に失敗しました');
      }

      logger.info({ taskId: id, dueDate }, 'タスク期日更新成功');
      return updatedTask?.[0] as Task;
    } catch (error) {
      logger.error({ error }, 'タスク期日更新例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク期日更新中に予期せぬエラーが発生しました');
    }
  }

  /**
   * タスクの優先度を更新する
   */
  async updateTaskPriority(userId: string, id: string, priority: TaskPriority): Promise<Task> {
    try {
      logger.info({ userId, taskId: id, priority }, 'タスク優先度更新開始');

      // タスクの存在と所有権を確認
      const { data: tasks, error: checkError } = await dbService.select('tasks', {
        filters: { id, user_id: userId },
      });

      if (checkError || !tasks || tasks.length === 0) {
        logger.error({ error: checkError }, 'タスク確認エラー');
        throw new ApiError(404, 'タスクが見つかりません');
      }

      // タスク優先度を更新
      const { data: updatedTask, error } = await dbService.update('tasks', id, {
        priority,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error({ error }, 'タスク優先度更新エラー');
        throw new ApiError(500, 'タスクの優先度更新に失敗しました');
      }

      logger.info({ taskId: id, priority }, 'タスク優先度更新成功');
      return updatedTask?.[0] as Task;
    } catch (error) {
      logger.error({ error }, 'タスク優先度更新例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク優先度更新中に予期せぬエラーが発生しました');
    }
  }

  /**
   * タスクの位置を更新する
   */
  async updateTaskPosition(userId: string, id: string, position: number): Promise<Task> {
    try {
      logger.info({ userId, taskId: id, position }, 'タスク位置更新開始');

      // タスクの存在と所有権を確認
      const { data: tasks, error: checkError } = await dbService.select('tasks', {
        filters: { id, user_id: userId },
      });

      if (checkError || !tasks || tasks.length === 0) {
        logger.error({ error: checkError }, 'タスク確認エラー');
        throw new ApiError(404, 'タスクが見つかりません');
      }

      // タスク位置を更新
      const { data: updatedTask, error } = await dbService.update('tasks', id, {
        position,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error({ error }, 'タスク位置更新エラー');
        throw new ApiError(500, 'タスクの位置更新に失敗しました');
      }

      logger.info({ taskId: id, position }, 'タスク位置更新成功');
      return updatedTask?.[0] as Task;
    } catch (error) {
      logger.error({ error }, 'タスク位置更新例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスク位置更新中に予期せぬエラーが発生しました');
    }
  }

  /**
   * 複数のタスクを一括更新する
   */
  async bulkUpdateTasks(
    userId: string,
    tasks: { id: string; updates: UpdateTaskInput }[]
  ): Promise<Task[]> {
    try {
      logger.info({ userId, taskCount: tasks.length }, 'タスク一括更新開始');

      const updatedTasks: Task[] = [];

      // 各タスクを更新
      for (const task of tasks) {
        // タスクの存在と所有権を確認
        const { data: existingTasks, error: checkError } = await dbService.select('tasks', {
          filters: { id: task.id, user_id: userId },
        });

        if (checkError || !existingTasks || existingTasks.length === 0) {
          logger.error({ taskId: task.id, error: checkError }, 'タスク確認エラー');
          throw new ApiError(404, `タスクID ${task.id} が見つかりません`);
        }

        // タスクを更新
        const { data: updated, error } = await dbService.update('tasks', task.id, {
          ...task.updates,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          logger.error({ taskId: task.id, error }, 'タスク更新エラー');
          throw new ApiError(500, `タスクID ${task.id} の更新に失敗しました`);
        }

        if (updated && updated.length > 0) {
          updatedTasks.push(updated[0] as Task);
        }
      }

      logger.info({ taskCount: updatedTasks.length }, 'タスク一括更新成功');
      return updatedTasks;
    } catch (error) {
      logger.error({ error }, 'タスク一括更新例外');
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'タスクの一括更新中に予期せぬエラーが発生しました');
    }
  }
}
