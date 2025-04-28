import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.statusCode,
    });
  }

  // その他のエラーの場合
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    code: 500,
  });
};

/**
 * 存在しないルートのハンドラー
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'The requested resource was not found',
      code: 'RESOURCE_NOT_FOUND',
      statusCode: 404,
    },
  });
};
