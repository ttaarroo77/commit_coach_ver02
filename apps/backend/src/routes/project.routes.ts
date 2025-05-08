import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { projectSchema } from '@commit-coach/domain/schemas/project.schema';

export class ProjectRoutes {
  private router: Router;
  private projectController: ProjectController;
  private authMiddleware: AuthMiddleware;
  private validationMiddleware: ValidationMiddleware;

  constructor(
    projectController: ProjectController,
    authMiddleware: AuthMiddleware,
    validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.projectController = projectController;
    this.authMiddleware = authMiddleware;
    this.validationMiddleware = validationMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // プロジェクトの作成
    this.router.post(
      '/',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(projectSchema.create),
      this.projectController.create,
    );

    // プロジェクトの更新
    this.router.put(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(projectSchema.update),
      this.projectController.update,
    );

    // プロジェクトの削除
    this.router.delete(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(projectSchema.delete),
      this.projectController.delete,
    );

    // プロジェクトの取得
    this.router.get(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(projectSchema.get),
      this.projectController.get,
    );

    // 全プロジェクトの取得
    this.router.get(
      '/',
      this.authMiddleware.authenticate,
      this.projectController.getAll,
    );

    // プロジェクトの統計情報取得
    this.router.get(
      '/:id/stats',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(projectSchema.getWithStats),
      this.projectController.getWithStats,
    );

    // プロジェクトのステータス更新
    this.router.patch(
      '/:id/status',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(projectSchema.updateStatus),
      this.projectController.updateStatus,
    );

    // プロジェクトのタイプ更新
    this.router.patch(
      '/:id/type',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(projectSchema.updateType),
      this.projectController.updateType,
    );
  }

  getRouter() {
    return this.router;
  }
}
