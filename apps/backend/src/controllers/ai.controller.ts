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
    const config = await aiService.getUserConfig(req.user.id);
    res.json(config);
  } catch (error) {
    throw new ApiError(500, 'AI設定の取得に失敗しました');
  }
};

export const updateAIConfig = async (req: Request, res: Response) => {
  try {
    const config = aiConfigSchema.parse(req.body);
    await aiService.saveUserConfig(req.user.id, config);
    res.json(config);
  } catch (error) {
    throw new ApiError(400, 'AI設定の更新に失敗しました');
  }
};

export const getAIMessages = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const messages = await aiService.getMessages(req.user.id, limit);
    res.json(messages);
  } catch (error) {
    throw new ApiError(500, 'メッセージ履歴の取得に失敗しました');
  }
};

export const breakDownTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = taskBreakdownSchema.parse(req.body);
    const userId = req.user.id;

    const subtasks = await aiService.breakDownTask(userId, taskId);
    res.json(subtasks);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error.errors);
    }
    throw error;
  }
};

export const analyzeTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = taskAnalysisSchema.parse(req.body);
    const userId = req.user.id;

    const analysis = await aiService.analyzeTask(userId, taskId);
    res.json(analysis);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error.errors);
    }
    throw error;
  }
};

export const analyzeProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = projectAnalysisSchema.parse(req.body);
    const userId = req.user.id;

    const analysis = await aiService.analyzeProject(userId, projectId);
    res.json(analysis);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, '無効なリクエストデータ', error.errors);
    }
    throw error;
  }
}; 