import { Request, Response, NextFunction } from 'express';

/**
 * APIエラークラス
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 共通エラーハンドラーミドルウェア
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('エラーが発生しました:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.statusCode,
        details: err.originalError?.message,
        error: err.name,
      }
    });
  }

  // Supabaseエラーの場合
  if (err.name === 'PostgrestError') {
    const pgError = err as any;
    return res.status(400).json({
      status: 'error',
      message: pgError.message || 'Database error',
      code: pgError.code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // JWT認証エラーの場合
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // その他の全てのエラーの場合
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred.',
  });
};

/**
 * 存在しないルートのハンドラー
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found.',
  });
}; 