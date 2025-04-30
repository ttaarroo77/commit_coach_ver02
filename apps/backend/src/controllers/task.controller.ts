import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { ApiError } from '../middleware/errorHandler';
import { CreateTaskInput, UpdateTaskInput, TaskStatus } from '../models/task.model';

const taskService = new TaskService();

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = taskService;
  }

  // タスク作成
  async createTask(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    // user_idはサービス層で追加されるので、ここでは除外
    const validatedData = req.body as CreateTaskInput;
    const task = await this.taskService.createTask(userId, validatedData);
    res.status(201).json(task);
  }

  // プロジェクトのタスク一覧取得
  async getTasksByProject(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { projectId } = req.params;
    const tasks = await this.taskService.getTasksByProject(userId, projectId);
    res.json(tasks);
  }

  // グループのタスク一覧取得
  async getTasksByGroup(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { groupId } = req.params;
    const tasks = await this.taskService.getTasksByGroup(userId, groupId);
    res.json(tasks);
  }

  // タスクの詳細取得
  async getTaskById(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    const task = await this.taskService.getTaskById(userId, id);

    if (!task) {
      throw new ApiError(404, 'タスクが見つかりません');
    }

    res.json(task);
  }

  // タスクの更新
  async updateTask(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    const validatedData = req.body as UpdateTaskInput;
    const task = await this.taskService.updateTask(userId, id, validatedData);
    res.json(task);
  }

  // タスクの削除
  async deleteTask(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    await this.taskService.deleteTask(userId, id);
    res.status(204).send();
  }

  // タスクの順序更新
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

    await this.taskService.updateTaskOrder(userId, id, newOrder, projectId, groupId);
    res.status(204).send();
  }

  // サブタスクの取得
  async getSubtasks(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { parentId } = req.params;
    const subtasks = await this.taskService.getSubtasks(userId, parentId);
    res.json(subtasks);
  }

  // タスクのステータス更新
  async updateTaskStatus(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { id } = req.params;
    const { status } = req.body;

    // TaskStatusの許容値をチェック
    if (!Object.values(TaskStatus).includes(status)) {
      throw new ApiError(400, '無効なステータスです');
    }

    const task = await this.taskService.updateTaskStatus(userId, id, status);
    res.json(task);
  }

  // タスクの期限更新
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

    const task = await this.taskService.updateTaskDueDate(userId, id, dueDate);
    res.json(task);
  }
}

export const taskController = new TaskController();
