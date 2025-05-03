import { Router } from 'express';
import { authRouter } from './auth';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import aiRoutes from './ai.routes';
import taskGroupRoutes from './task-group.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 認証ルート
router.use('/auth', authRouter);

// 認証が必要なルート
router.use('/projects', authMiddleware, projectRoutes);
router.use('/tasks', authMiddleware, taskRoutes);
router.use('/ai', authMiddleware, aiRoutes);
router.use('/task-groups', authMiddleware, taskGroupRoutes);

// ヘルスチェック
router.get('/health', (req, res) => {
  // パッケージ情報を取得するためのpackage.jsonの読み込み
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageInfo = require('../../package.json');

  // メモリ使用量取得
  const memoryUsage = process.memoryUsage();

  res.json({
    status: 'ok',
    version: packageInfo.version,
    name: packageInfo.name,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    },
    node: process.version,
  });
});

export default router;
