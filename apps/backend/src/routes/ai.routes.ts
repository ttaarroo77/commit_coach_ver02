import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 認証ミドルウェアを適用
router.use(authMiddleware);

// AI設定関連
router.get('/config', aiController.getAIConfig);
router.put('/config', aiController.updateAIConfig);

// AIメッセージ履歴
router.get('/messages', aiController.getAIMessages);

// タスク分解
router.post('/breakdown', aiController.breakDownTask);

// タスク分析（現在はスタブ実装）
router.post('/analyze', aiController.analyzeTask);

// プロジェクト分析
router.post('/analyze-project', aiController.analyzeProject);

export default router;
