import { Request, Response, NextFunction } from 'express';
import { logger, logError } from '../utils/logger';

/**
 * APIエラークラス
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: Error,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 共通エラーハンドラーミドルウェア
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // 構造化されたログを出力
  logError(err, req);

  // エラーの詳細情報（開発環境のみ）
  const errorDetails =
    process.env.NODE_ENV === 'development'
      ? {
          stack: err.stack,
          originalError: err instanceof ApiError ? err.originalError?.message : undefined,
        }
      : undefined;

  // ApiErrorの場合
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.errorCode || 'API_ERROR',
        statusCode: err.statusCode,
        ...(errorDetails && { details: errorDetails }),
      },
    });
  }

  // Supabaseエラーの場合
  if (err.name === 'PostgrestError') {
    const pgError = err as any;
    return res.status(400).json({
      error: {
        message: pgError.message || 'Database error',
        code: `DB_${pgError.code || 'ERROR'}`,
        statusCode: 400,
        ...(errorDetails && { details: errorDetails }),
      },
    });
  }

  // JWT認証エラーの場合
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        message: 'Invalid or expired token',
        code: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        statusCode: 401,
        ...(errorDetails && { details: errorDetails }),
      },
    });
  }

  // その他の全てのエラーの場合
  logger.error(
    {
      error: {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      },
      path: req.path,
      method: req.method,
      ip: req.ip || req.headers['x-forwarded-for'],
    },
    '予期せぬエラーが発生しました'
  );

  res.status(500).json({
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      ...(errorDetails && { details: errorDetails }),
    },
  });
};

/**
 * 存在しないルートのハンドラー
 */
export const notFoundHandler = (req: Request, res: Response) => {
  // 404エラーをログに記録
  logger.warn(
    {
      path: req.path,
      method: req.method,
      ip: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
    },
    'リソースが見つかりません'
  );

  res.status(404).json({
    error: {
      message: 'The requested resource was not found',
      code: 'RESOURCE_NOT_FOUND',
      statusCode: 404,
    },
  });
};
