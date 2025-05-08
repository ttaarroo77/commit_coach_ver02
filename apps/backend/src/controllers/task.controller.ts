import { Request, Response } from 'express';
import { CreateTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase, GetTaskUseCase } from '@commit-coach/domain/usecases/task';
import { CreateTaskInput, UpdateTaskInput } from '@commit-coach/domain/entities/task';
import { ApiError } from '../middleware/errorHandler';
import { TaskService } from '../services/task.service';
import { TaskStatus } from '../models/task.model';

const taskService = new TaskService();

export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
  ) {}

  /**
   * タスクを作成する
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const input: CreateTaskInput = req.body;
      const task = await this.createTaskUseCase.execute(input);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * タスクを更新する
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateTaskInput = req.body;
      const task = await this.updateTaskUseCase.execute(id, input);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * タスクを削除する
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteTaskUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * タスクを取得する
   */
  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.getTaskUseCase.execute(id);
      res.json(task);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * すべてのタスクを取得する
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.getTaskUseCase.executeAll();
      res.json(tasks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * プロジェクトのタスクを取得する
   */
  async getByProject(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const tasks = await this.getTaskUseCase.executeByProjectId(projectId);
      res.json(tasks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * プロジェクト情報を含むタスクを取得する
   */
  async getWithProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.getTaskUseCase.executeWithProject(id);
      res.json(task);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * タスクのステータスを更新する
   */
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const task = await this.getTaskUseCase.executeUpdateStatus(id, status);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * タスクの優先度を更新する
   */
  async updatePriority(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { priority } = req.body;
      const task = await this.getTaskUseCase.executeUpdatePriority(id, priority);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // グループのタスク一覧取得
  async getTasksByGroup(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { groupId } = req.params;
    const tasks = await this.getTaskUseCase.executeByGroupId(userId, groupId);
    res.json(tasks);
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

    await this.getTaskUseCase.executeUpdateOrder(userId, id, newOrder, projectId, groupId);
    res.status(204).send();
  }

  // サブタスクの取得
  async getSubtasks(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '認証が必要です');
    }

    const { parentId } = req.params;
    const subtasks = await this.getTaskUseCase.executeSubtasks(userId, parentId);
    res.json(subtasks);
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

    const task = await this.getTaskUseCase.executeUpdateDueDate(userId, id, dueDate);
    res.json(task);
  }
}

export const taskController = new TaskController(
  new CreateTaskUseCase(),
  new UpdateTaskUseCase(),
  new DeleteTaskUseCase(),
  new GetTaskUseCase()
);
