import { Router } from 'express';

const router = Router();

/**
 * @route GET /api/health
 * @desc ヘルスチェックエンドポイント
 * @access Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
