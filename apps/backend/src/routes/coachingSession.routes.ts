import { Router } from 'express';
import {
  createCoachingSession,
  getCoachingSession,
  updateCoachingSession,
  deleteCoachingSession,
  getClientSessions,
  getCoachSessions,
} from '../controllers/coachingSession.controller';
import { validateRequest } from '../middleware/validateRequest';
import { coachingSessionSchema } from '../models/coachingSession';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// コーチングセッションの作成
router.post('/', authMiddleware, validateRequest(coachingSessionSchema), createCoachingSession);

// 特定のセッションの取得
router.get('/:sessionId', authMiddleware, getCoachingSession);

// セッションの更新
router.put('/:sessionId', authMiddleware, validateRequest(coachingSessionSchema), updateCoachingSession);

// セッションの削除
router.delete('/:sessionId', authMiddleware, deleteCoachingSession);

// クライアントのセッション一覧取得
router.get('/client/:clientId', authMiddleware, getClientSessions);

// コーチのセッション一覧取得
router.get('/coach/:coachId', authMiddleware, getCoachSessions);

export default router;