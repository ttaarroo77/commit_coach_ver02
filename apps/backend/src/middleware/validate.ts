import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Zodスキーマを使ってリクエストを検証するミドルウェア
 * @param schema バリデーション用のZodスキーマ
 * @returns Express ミドルウェア
 */
export const validate = (schema: AnyZodObject) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error: any) {
    // Zodエラーを整形
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.errors?.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }
};

/**
 * @deprecated 複雑なスキーマ向け - 必要に応じて
 */
export const validateRequest = (schemaMap: {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schemaMap.body) {
      req.body = schemaMap.body.parse(req.body);
    }

    if (schemaMap.query) {
      req.query = schemaMap.query.parse(req.query);
    }

    if (schemaMap.params) {
      req.params = schemaMap.params.parse(req.params);
    }

    next();
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.errors?.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }
}; 