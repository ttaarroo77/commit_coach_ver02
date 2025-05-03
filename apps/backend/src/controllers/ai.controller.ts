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

    // AIServiceにタスクをそのまま渡す

    // AIServiceのbreakDownTaskメソッドにタスクをそのまま渡す
    const subtasks = await aiService.breakDownTask(task);
    res.json(subtasks);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error as Error);
    }
    throw error;
  }
};

// タスク分析機能
export const analyzeTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = taskAnalysisSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    // タスクを取得
    const task = await taskService.getTaskById(userId, taskId);
    if (!task) {
      throw new ApiError(404, 'タスクが見つかりません');
    }

    // タスク分析を実行
    const analysis = await aiService.analyzeTask(task);
    res.json({ taskId, analysis });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error as Error);
    }
    throw error;
  }
};

// プロジェクト分析機能
export const analyzeProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = projectAnalysisSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    // プロジェクトを取得
    // TaskServiceにはgetProjectByIdメソッドがないため、直接データベースから取得する
    const dbService = (await import('../services/database.service')).default;
    const { data: projects, error } = await dbService.select('projects', {
      filters: { id: projectId, user_id: userId },
    });

    if (error || !projects || projects.length === 0) {
      throw new ApiError(404, 'プロジェクトが見つかりません');
    }

    const project = projects[0];

    // プロジェクト分析を実行
    const analysis = await aiService.analyzeProject(project);
    res.json({ projectId, analysis });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error as Error);
    }
    throw error;
  }
};
