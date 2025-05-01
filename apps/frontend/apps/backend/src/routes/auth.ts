import { Router } from 'express';
import {
  login,
  signup,
  logout,
  refreshToken,
  resetPasswordRequest,
  resetPassword,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import {
  loginSchema,
  signupSchema,
  refreshTokenSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// ユーザー登録
router.post('/signup', validate(signupSchema), signup);

// ログイン
router.post('/login', validate(loginSchema), login);

// ログアウト
router.post('/logout', logout);

// トークンリフレッシュ
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);

// パスワードリセットリクエスト
router.post('/reset-password-request', validate(resetPasswordRequestSchema), resetPasswordRequest);

// パスワードリセット
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export { router as authRouter };
