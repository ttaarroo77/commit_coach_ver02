import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// 環境変数の読み込み
dotenv.config();

export async function createServer() {
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

  // 404エラーハンドラー
  app.use(notFoundHandler);

  // エラーハンドラー
  app.use(errorHandler);

  return app;
}

export default createServer();
