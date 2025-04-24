import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import aiRoutes from './ai.routes';
import taskGroupRoutes from './task-group.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 認証ルート
router.use('/auth', authRoutes);

// 認証が必要なルート
router.use('/projects', authMiddleware, projectRoutes);
router.use('/tasks', authMiddleware, taskRoutes);
router.use('/ai', authMiddleware, aiRoutes);
router.use('/task-groups', authMiddleware, taskGroupRoutes);

// ヘルスチェック
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router; 