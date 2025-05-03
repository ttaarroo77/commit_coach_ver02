import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
// import { prisma } from '../lib/prisma';

// 環境変数がない場合のデフォルト値
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iwyztimustunsapozimt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * JWTトークンを生成する
 */
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'jwt_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret',
    { expiresIn: '7d' } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Prismaの代わりにモックデータを使用
      const mockUser = {
        id: '1',
        email: email,
        name: 'テストユーザー',
        password: 'password123'
      };

      if (mockUser.password !== password) {
        return res.status(401).json({ error: '認証情報が無効です' });
      }

      const token = jwt.sign(
        { userId: mockUser.id },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        token,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'バリデーションエラー' });
      }
      return res.status(500).json({ error: '内部サーバーエラー' });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = signupSchema.parse(req.body);

      // モックデータを使用
      const mockUser = {
        id: '2',
        email: email,
        password: password,
        name: name || 'New User'
      };

      const token = jwt.sign(
        { userId: mockUser.id },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'バリデーションエラー' });
      }
      return res.status(500).json({ error: '内部サーバーエラー' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // 実際のアプリケーションでは、トークンの無効化やセッションの削除などを行う
      return res.status(200).json({ message: 'ログアウトしました' });
    } catch (error) {
      return res.status(500).json({ error: '内部サーバーエラー' });
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken: token } = req.body;

      if (!token) {
        throw new ApiError(400, 'リフレッシュトークンが必要です');
      }

      // リフレッシュトークンを検証
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret') as {
          userId: string;
        };

        // 新しいトークンを生成
        const { accessToken, refreshToken } = generateTokens(decoded.userId);

        res.status(200).json({
          status: 'success',
          data: {
            accessToken,
            refreshToken,
          },
        });
      } catch (error) {
        throw new ApiError(401, '無効なトークンです');
      }
    } catch (error) {
      next(error);
    }
  }

  async resetPasswordRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      // Supabaseでパスワードリセットメールを送信
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
      });

      if (error) {
        throw new ApiError(400, error.message);
      }

      res.status(200).json({
        status: 'success',
        message: 'パスワードリセットメールを送信しました',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;

      // Supabaseでパスワードをリセット
      const { error } = await supabase.auth.admin.updateUserById(token, {
        password,
      });

      if (error) {
        throw new ApiError(400, error.message);
      }

      res.status(200).json({
        status: 'success',
        message: 'パスワードをリセットしました',
      });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

export const login = authController.login.bind(authController);
export const signup = authController.signup.bind(authController);
export const logout = authController.logout.bind(authController);
export const refreshToken = authController.refreshToken.bind(authController);
export const resetPasswordRequest = authController.resetPasswordRequest.bind(authController);
export const resetPassword = authController.resetPassword.bind(authController);
