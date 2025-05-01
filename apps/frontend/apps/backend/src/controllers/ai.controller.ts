import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { TaskService } from '../services/task.service';
import { aiConfigSchema } from '../types/ai.types';
import { ApiError } from '../middleware/errorHandler';
import { z } from 'zod';

const aiService = new AIService();
const taskService = new TaskService();

const taskBreakdownSchema = z.object({
  taskId: z.string().uuid(),
});

const taskAnalysisSchema = z.object({
  taskId: z.string().uuid(),
});

const projectAnalysisSchema = z.object({
  projectId: z.string().uuid(),
});

export const getAIConfig = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const config = await aiService.getUserConfig(userId);
    res.json(config);
  } catch (error) {
    throw new ApiError(500, 'AI設定の取得に失敗しました');
  }
};

export const updateAIConfig = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const config = aiConfigSchema.parse(req.body);
    await aiService.saveUserConfig(userId, config);
    res.json(config);
  } catch (error) {
    throw new ApiError(400, 'AI設定の更新に失敗しました');
  }
};

export const getAIMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const messages = await aiService.getMessages(userId, limit);
    res.json(messages);
  } catch (error) {
    throw new ApiError(500, 'メッセージ履歴の取得に失敗しました');
  }
};

export const breakDownTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = taskBreakdownSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    // タスクを取得してからAIServiceに渡す
    const task = await taskService.getTaskById(userId, taskId);
    if (!task) {
      throw new ApiError(404, 'タスクが見つかりません');
    }

    // AIServiceが期待する形式にタスクを変換
    const statusMap: Record<string, string> = {
      todo: 'TODO',
      in_progress: 'IN_PROGRESS',
      review: 'IN_PROGRESS', // reviewもIN_PROGRESSとして扱う
      done: 'DONE',
    };

    const priorityMap: Record<string, string> = {
      low: 'LOW',
      medium: 'MEDIUM',
      high: 'HIGH',
      urgent: 'HIGH', // urgentはHIGHとして扱う
    };

    // タスクデータ構造のための型定義
    interface TaskForAI {
      title: string;
      description: string;
      order: number;
      project_id: string;
      status: 'TODO' | 'IN_PROGRESS' | 'DONE';
      priority: 'LOW' | 'MEDIUM' | 'HIGH';
      due_date?: string;
      group_id?: string;
      parent_id?: string;
    }

    // taskオブジェクトから必要なプロパティを取得
    const taskForAI: TaskForAI = {
      title: task.title,
      description: task.description || '',
      order: task.position || 0,
      project_id: task.project_id || '',
      status: statusMap[task.status.toLowerCase()] as 'TODO' | 'IN_PROGRESS' | 'DONE',
      priority: priorityMap[task.priority.toLowerCase()] as 'LOW' | 'MEDIUM' | 'HIGH',
    };

    // オプショナルプロパティは存在する場合のみ追加
    if (task.due_date) {
      // 型判定ではなく、メソッド存在チェックで安全に変換
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateObj = task.due_date as any;
        if (typeof dateObj.toISOString === 'function') {
          taskForAI.due_date = dateObj.toISOString();
        } else {
          taskForAI.due_date = String(task.due_date);
        }
      } catch {
        taskForAI.due_date = String(task.due_date);
      }
    }

    // 特別なプロパティを安全に追加
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyTask = task as any;
    if (anyTask.group_id) {
      taskForAI.group_id = anyTask.group_id;
    }

    if (anyTask.parent_task_id || anyTask.parent_id) {
      taskForAI.parent_id = anyTask.parent_task_id || anyTask.parent_id;
    }

    const subtasks = await aiService.breakDownTask(taskForAI);
    res.json(subtasks);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error as Error);
    }
    throw error;
  }
};

// 現在のAIServiceにはanalyzeTaskメソッドが実装されていないため、一時的にスタブ実装
export const analyzeTask = async (req: Request, res: Response) => {
  try {
    // パースしたデータを確認（taskIdが使用されることを示す）
    const parsedData = taskAnalysisSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    // 実際の実装がないため、エラーを返す
    res.status(501).json({
      error: 'この機能は現在実装されていません',
      taskId: parsedData.taskId, // 一応送り返して使っていることを示す
      timestamp: new Date().toISOString(),
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error as Error);
    }
    throw error;
  }
};

// 現在のAIServiceにはanalyzeProjectメソッドが実装されていないため、一時的にスタブ実装
export const analyzeProject = async (req: Request, res: Response) => {
  try {
    // パースしたデータを確認（projectIdが使用されることを示す）
    const parsedData = projectAnalysisSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    // 実際の実装がないため、エラーを返す
    res.status(501).json({
      error: 'この機能は現在実装されていません',
      projectId: parsedData.projectId, // 一応送り返して使っていることを示す
      timestamp: new Date().toISOString(),
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error as Error);
    }
    throw error;
  }
};
