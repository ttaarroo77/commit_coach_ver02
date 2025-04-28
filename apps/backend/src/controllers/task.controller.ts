import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { ApiError } from '../middleware/errorHandler';
import { CreateTaskInput, UpdateTaskInput, TaskStatus } from '../models/task.model';

const taskService = new TaskService();

// タスク作成
export async function createTask(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, '認証が必要です');
  }

  // user_idはサービス層で追加されるので、ここでは除外
  const validatedData = req.body as CreateTaskInput;
  const task = await taskService.createTask(userId, validatedData);
  res.status(201).json(task);
}

// プロジェクトのタスク一覧取得
export async function getTasksByProject(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, '認証が必要です');
  }

  const { projectId } = req.params;
  const tasks = await taskService.getTasksByProject(userId, projectId);
  res.json(tasks);
}

// グループのタスク一覧取得
export async function getTasksByGroup(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, '認証が必要です');
  }

  const { groupId } = req.params;
  const tasks = await taskService.getTasksByGroup(userId, groupId);
  res.json(tasks);
}

// タスク一覧取得
export async function getTasks(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, '認証が必要です');
  }

  const tasks = await taskService.getTasks(userId);
  res.json(tasks);
}

// タスクの詳細取得
export async function getTask(req: Request, res: Response) {
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

// タスクの更新
export async function updateTask(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, '認証が必要です');
  }

  const { id } = req.params;
  const validatedData = req.body as UpdateTaskInput;
  const task = await taskService.updateTask(userId, id, validatedData);
  res.json(task);
}

// タスクの削除
export async function deleteTask(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, '認証が必要です');
  }

  const { id } = req.params;
  await taskService.deleteTask(userId, id);
  res.status(204).send();
}

// タスクの順序更新
export async function updateTaskOrder(req: Request, res: Response) {
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

// サブタスクの取得
export async function getSubtasks(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, '認証が必要です');
  }

  const { parentId } = req.params;
  const subtasks = await taskService.getSubtasks(userId, parentId);
  res.json(subtasks);
}

// タスクのステータス更新
export async function updateTaskStatus(req: Request, res: Response) {
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

  const task = await taskService.updateTaskStatus(userId, id, status);
  res.json(task);
}

// タスクの期限更新
export async function updateTaskDueDate(req: Request, res: Response) {
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
