import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export class ValidationMiddleware {
  validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            message: 'バリデーションエラー',
            errors: error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          });
        }
        next(error);
      }
    };
  };
}
