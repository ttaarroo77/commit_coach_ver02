import { Request, Response } from 'express';
import { TaskGroupService } from '../services/task-group.service';
import { taskGroupSchema, taskGroupUpdateSchema } from '../types/task-group.types';
import { ApiError } from '../middleware/error.middleware';
import { z } from 'zod';

const orderUpdateSchema = z.object({
  id: z.string().uuid(),
  newOrder: z.number().int().min(0),
  projectId: z.string().uuid(),
});

export class TaskGroupController {
  private taskGroupService: TaskGroupService;

  constructor() {
    this.taskGroupService = new TaskGroupService();
  }

  createTaskGroup = async (req: Request, res: Response) => {
    try {
      const data = taskGroupSchema.parse(req.body);
      const userId = req.user.id;

      const taskGroup = await this.taskGroupService.createTaskGroup(userId, data);
      res.status(201).json(taskGroup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(400, '無効なリクエストデータ', error.errors);
      }
      throw error;
    }
  };

  getTaskGroupsByProject = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.projectId;
      const userId = req.user.id;

      const taskGroups = await this.taskGroupService.getTaskGroupsByProject(
        userId,
        projectId
      );
      res.json(taskGroups);
    } catch (error) {
      throw error;
    }
  };

  getTaskGroupById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const userId = req.user.id;

      const taskGroup = await this.taskGroupService.getTaskGroupById(userId, id);
      if (!taskGroup) {
        throw new ApiError(404, 'タスクグループが見つかりません');
      }
      res.json(taskGroup);
    } catch (error) {
      throw error;
    }
  };

  updateTaskGroup = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updates = taskGroupUpdateSchema.parse(req.body);
      const userId = req.user.id;

      const taskGroup = await this.taskGroupService.updateTaskGroup(
        userId,
        id,
        updates
      );
      res.json(taskGroup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(400, '無効なリクエストデータ', error.errors);
      }
      throw error;
    }
  };

  deleteTaskGroup = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const userId = req.user.id;

      await this.taskGroupService.deleteTaskGroup(userId, id);
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  };

  updateTaskGroupOrder = async (req: Request, res: Response) => {
    try {
      const { id, newOrder, projectId } = orderUpdateSchema.parse(req.body);
      const userId = req.user.id;

      await this.taskGroupService.updateTaskGroupOrder(
        userId,
        id,
        newOrder,
        projectId
      );
      res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(400, '無効なリクエストデータ', error.errors);
      }
      throw error;
    }
  };
} 