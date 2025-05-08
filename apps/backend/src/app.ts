import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { TaskRoutes } from './routes/task.routes';
import { ProjectRoutes } from './routes/project.routes';
import { UserRoutes } from './routes/user.routes';
import { TaskController } from './controllers/task.controller';
import { ProjectController } from './controllers/project.controller';
import { UserController } from './controllers/user.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ValidationMiddleware } from './middlewares/validation.middleware';
import { ErrorMiddleware } from './middlewares/error.middleware';

export class App {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // セキュリティ対策
    this.app.use(helmet());

    // CORS設定
    this.app.use(cors());

    // リクエストボディのパース
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // レスポンス圧縮
    this.app.use(compression());
  }

  private initializeRoutes() {
    // ミドルウェアのインスタンス化
    const authMiddleware = new AuthMiddleware();
    const validationMiddleware = new ValidationMiddleware();

    // コントローラーのインスタンス化
    const taskController = new TaskController();
    const projectController = new ProjectController();
    const userController = new UserController();

    // ルーターのインスタンス化
    const taskRoutes = new TaskRoutes(
      taskController,
      authMiddleware,
      validationMiddleware,
    );
    const projectRoutes = new ProjectRoutes(
      projectController,
      authMiddleware,
      validationMiddleware,
    );
    const userRoutes = new UserRoutes(
      userController,
      authMiddleware,
      validationMiddleware,
    );

    // ルーターの登録
    this.app.use('/api/tasks', taskRoutes.getRouter());
    this.app.use('/api/projects', projectRoutes.getRouter());
    this.app.use('/api/users', userRoutes.getRouter());
  }

  private initializeErrorHandling() {
    const errorMiddleware = new ErrorMiddleware();
    this.app.use(errorMiddleware.handleError);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 サーバーが起動しました - ポート: ${this.port}`);
    });
  }

  public getApp() {
    return this.app;
  }
}
