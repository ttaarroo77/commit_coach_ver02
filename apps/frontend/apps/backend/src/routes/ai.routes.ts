import { Router } from 'express';
// import * as aiController from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 認証ミドルウェアを適用
router.use(authMiddleware);

// 一時的にAI機能を無効化
router.post('/breakdown', (req, res) => {
  res.status(501).json({ error: 'この機能は現在メンテナンス中です' });
});

router.post('/analyze', (req, res) => {
  res.status(501).json({ error: 'この機能は現在メンテナンス中です' });
});

router.post('/analyze-project', (req, res) => {
  res.status(501).json({ error: 'この機能は現在メンテナンス中です' });
});

export default router;
