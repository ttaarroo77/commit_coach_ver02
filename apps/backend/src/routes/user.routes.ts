import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { userSchema } from '@commit-coach/domain/schemas/user.schema';

export class UserRoutes {
  private router: Router;
  private userController: UserController;
  private authMiddleware: AuthMiddleware;
  private validationMiddleware: ValidationMiddleware;

  constructor(
    userController: UserController,
    authMiddleware: AuthMiddleware,
    validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.userController = userController;
    this.authMiddleware = authMiddleware;
    this.validationMiddleware = validationMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ユーザーの作成
    this.router.post(
      '/',
      this.validationMiddleware.validate(userSchema.create),
      this.userController.create,
    );

    // ユーザーの更新
    this.router.put(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(userSchema.update),
      this.userController.update,
    );

    // ユーザーの削除
    this.router.delete(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(userSchema.delete),
      this.userController.delete,
    );

    // ユーザーの取得
    this.router.get(
      '/:id',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(userSchema.get),
      this.userController.get,
    );

    // メールアドレスによるユーザー取得
    this.router.get(
      '/email/:email',
      this.authMiddleware.authenticate,
      this.validationMiddleware.validate(userSchema.getByEmail),
      this.userController.getByEmail,
    );

    // 全ユーザーの取得
    this.router.get(
      '/',
      this.authMiddleware.authenticate,
      this.userController.getAll,
    );

    // ユーザー認証
    this.router.post(
      '/auth',
      this.validationMiddleware.validate(userSchema.authenticate),
      this.userController.authenticate,
    );
  }

  getRouter() {
    return this.router;
  }
}
