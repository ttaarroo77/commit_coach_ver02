import { Router } from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userProfile.controller';
import { validate } from '../middleware/validate';
import { userProfileSchema } from '../models/userProfile';
import { cacheMiddleware } from '../middleware/cache';
import { authenticate } from '../middleware/auth';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'user-profiles',
    timestamp: new Date().toISOString(),
  });
});

// プロファイルの取得
router.get('/:userId', cacheMiddleware(3600), getUserProfile);

// プロファイルの更新
router.put('/:userId', authenticate, validate(userProfileSchema), updateUserProfile);

// プロファイルの削除
router.delete('/:userId', authenticate, deleteUserProfile);

export { router as userProfileRouter }; 