import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const aiController = new AIController();

// 認証ミドルウェアを適用
router.use(authMiddleware);

// タスクの分解
router.post('/breakdown', aiController.breakDownTask);

// タスクの分析
router.post('/analyze', aiController.analyzeTask);

// プロジェクトの分析
router.post('/analyze-project', aiController.analyzeProject);

export default router; 