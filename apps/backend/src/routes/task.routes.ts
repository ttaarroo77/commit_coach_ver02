import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { taskSchema } from '@commit-coach/domain/schemas/task.schema';

export class TaskRoutes {
  private router: Router;
  private taskController: TaskController;
  private authMiddleware: AuthMiddleware;
  private validationMiddleware: ValidationMiddleware;

  constructor(
    taskController: TaskController,
    authMiddleware: AuthMiddleware,
    validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.taskController = taskController;
    this.authMiddleware = authMiddleware;
    this.validationMiddleware = validationMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // タスクの作成
    this.router.post(
      '/',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(taskSchema.create),
      this.taskController.create,
    );

    // タスクの更新
    this.router.put(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(taskSchema.update),
      this.taskController.update,
    );

    // タスクの削除
    this.router.delete(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(taskSchema.delete),
      this.taskController.delete,
    );

    // タスクの取得
    this.router.get(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(taskSchema.get),
      this.taskController.get,
    );

    // プロジェクトに紐づくタスクの取得
    this.router.get(
      '/project/:projectId',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(taskSchema.getByProject),
      this.taskController.getByProjectId,
    );

    // タスクのステータス更新
    this.router.patch(
      '/:id/status',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(taskSchema.updateStatus),
      this.taskController.updateStatus,
    );

    // タスクの優先度更新
    this.router.patch(
      '/:id/priority',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(taskSchema.updatePriority),
      this.taskController.updatePriority,
    );
  }

  getRouter() {
    return this.router;
  }
}
