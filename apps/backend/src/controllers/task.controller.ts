import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { ApiError } from '../middleware/error.middleware';
import { taskSchema, taskUpdateSchema } from '../types/task.types';
import { TaskPriority, TaskStatus } from '../types/task.types';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const validatedData = taskSchema.parse(req.body);
    const task = await taskService.createTask(userId, validatedData);
    res.status(201).json(task);
  }

  async getTasksByProject(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { projectId } = req.params;
    const tasks = await taskService.getTasksByProject(userId, projectId);
    res.json(tasks);
  }

  async getTasksByGroup(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { groupId } = req.params;
    const tasks = await taskService.getTasksByGroup(userId, groupId);
    res.json(tasks);
  }

  async getTaskById(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    const task = await taskService.getTaskById(userId, id);

    if (!task) {
      throw new ApiError(404, 'タスクが見つかりません');
    }

    res.json(task);
  }

  async updateTask(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    const validatedData = taskUpdateSchema.parse(req.body);
    const task = await taskService.updateTask(userId, id, validatedData);
    res.json(task);
  }

  async deleteTask(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    await taskService.deleteTask(userId, id);
    res.status(204).send();
  }

  async updateTaskOrder(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    const { newOrder, projectId, groupId } = req.body;

    if (typeof newOrder !== 'number' || !projectId) {
      throw new ApiError(400, '無効なリクエストです');
    }

    await taskService.updateTaskOrder(userId, id, newOrder, projectId, groupId);
    res.status(204).send();
  }

  async getSubtasks(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { parentId } = req.params;
    const subtasks = await taskService.getSubtasks(userId, parentId);
    res.json(subtasks);
  }

  async updateTaskStatus(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(TaskStatus).includes(status)) {
      throw new ApiError(400, '無効なステータスです');
    }

    const task = await taskService.updateTaskStatus(userId, id, status);
    res.json(task);
  }

  async updateTaskDueDate(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    const { dueDate } = req.body;

    if (!dueDate || isNaN(Date.parse(dueDate))) {
      throw new ApiError(400, '無効な期限です');
    }

    const task = await taskService.updateTaskDueDate(userId, id, dueDate);
    res.json(task);
  }
} 