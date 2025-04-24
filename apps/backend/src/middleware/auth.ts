import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';
import { ApiError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

/**
 * JWT認証ミドルウェア
 * このミドルウェアはリクエストヘッダーからJWTトークンを取得し、
 * 検証後にユーザー情報をリクエストに追加します
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorization ヘッダーからトークンを取得
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError(401, '認証トークンがありません');
    }

    try {
      // トークンを検証
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'jwt_secret'
      ) as { userId: string };

      // ユーザーが実際に存在するか確認
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        throw new ApiError(401, 'ユーザーが見つかりません');
      }

      // リクエストにユーザー情報を追加
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, '無効なトークンです');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'トークンの有効期限が切れています');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 特定のロールを持つユーザーのみアクセスを許可するミドルウェア
 * @param roles 許可するロールの配列
 */
export const restrictTo = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, '認証されていません');
      }

      // ユーザーのロールを取得
      const { data: userData, error } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !userData) {
        throw new ApiError(401, 'ユーザーが見つかりません');
      }

      // 許可されたロールでない場合はアクセス拒否
      if (!roles.includes(userData.role)) {
        throw new ApiError(403, 'この操作を行う権限がありません');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * リソースの所有者かチェックするミドルウェアを生成する関数
 * @param resourceType リソースの種類（テーブル名）
 * @param paramIdField リクエストパラメータのIDフィールド（デフォルト: id）
 * @param userIdField テーブル内のユーザーIDフィールド（デフォルト: user_id）
 */
export const isOwner = (
  resourceType: string,
  paramIdField = 'id',
  userIdField = 'user_id'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, '認証されていません');
      }

      const resourceId = req.params[paramIdField];
      if (!resourceId) {
        throw new ApiError(400, 'リソースIDが指定されていません');
      }

      // リソースの所有者を確認
      const { data, error } = await supabaseAdmin
        .from(resourceType)
        .select('id')
        .eq('id', resourceId)
        .eq(userIdField, req.user.id)
        .single();

      if (error || !data) {
        throw new ApiError(403, 'このリソースにアクセスする権限がありません');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
