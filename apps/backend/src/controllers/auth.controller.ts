import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ApiError } from '../middleware/ApiError';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

const signupSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  name: z.string().min(2, '名前は2文字以上で入力してください'),
});

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
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

/**
 * サインアップ
 */
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = signupSchema.parse(req.body);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new ApiError(409, 'このメールアドレスは既に登録されています');
      }
      throw new ApiError(400, error.message);
    }

    if (!data.user) {
      throw new ApiError(500, 'ユーザー登録に失敗しました');
    }

    return res.status(201).json({
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.name,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ログイン
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new ApiError(401, 'メールアドレスまたはパスワードが正しくありません');
      }
      throw new ApiError(400, error.message);
    }

    if (!data.user) {
      throw new ApiError(500, 'ログインに失敗しました');
    }

    const { accessToken, refreshToken } = generateTokens(data.user.id);

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * トークンのリフレッシュ
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
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
};

/**
 * ログアウト
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * パスワードリセットリクエスト
 */
export const resetPasswordRequest = async (req: Request, res: Response, next: NextFunction) => {
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
};

/**
 * パスワードリセット
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
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
};
