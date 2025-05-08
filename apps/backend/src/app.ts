import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { TaskRoutes } from './routes/task.routes';
import { ProjectRoutes } from './routes/project.routes';
import { UserRoutes } from './routes/user.routes';
import { TaskController } from './controllers/task.controller';
import { ProjectController } from './controllers/project.controller';
import { UserController } from './controllers/user.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ValidationMiddleware } from './middlewares/validation.middleware';
import { ErrorMiddleware } from './middlewares/error.middleware';

// 環境変数の読み込み
dotenv.config();

const app = express();

// セキュリティヘッダーの設定
app.use(helmet());

// CORSの設定
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    credentials: true,
  })
);

// リクエストボディのパース
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 圧縮
app.use(compression());

// リクエストのログ
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// レート制限
if (process.env.NODE_ENV === 'production') {
  app.use(
    '/api/',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分
      max: 100, // IPごとに100リクエストまで
      standardHeaders: true,
      legacyHeaders: false,
      message: 'リクエスト数が多すぎます。しばらく待ってから再試行してください。',
    })
  );
}

// ルーティング
app.use(router);
app.use('/api/auth', authRouter);

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
app.use('/api/tasks', taskRoutes.getRouter());
app.use('/api/projects', projectRoutes.getRouter());
app.use('/api/users', userRoutes.getRouter());

// 404エラーハンドラー
app.use(notFoundHandler);

// エラーハンドラー
app.use(errorHandler);

export default app;
