import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class ErrorMiddleware {
  handle = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'バリデーションエラー',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: error.message || 'リソースが見つかりません',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message || 'バリデーションエラー',
      });
    }

    if (error.name === 'UnauthorizedError') {
      return res.status(401).json({
        message: error.message || '認証が必要です',
      });
    }

    if (error.name === 'ForbiddenError') {
      return res.status(403).json({
        message: error.message || 'アクセス権限がありません',
      });
    }

    return res.status(500).json({
      message: 'サーバーエラーが発生しました',
    });
  };

  notFound = (req: Request, res: Response) => {
    res.status(404).json({
      message: 'リクエストされたリソースが見つかりません',
    });
  };
}
