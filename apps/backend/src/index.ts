import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import router from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import healthRoutes from './routes/health.routes';
import { App } from './app';
import { config } from '@commit-coach/config';

const port = config.port || 3000;
const app = new App(port);

async function startServer() {
  try {
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

    // ルートの設定
    app.use('/api', router);
    app.use('/api/auth', authRouter);
    app.use('/api/health', healthRoutes);

    // エラーハンドリング
    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
