import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        email?: string;
        role?: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, '認証トークンが必要です');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, '無効な認証トークンです');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret') as {
      userId: string;
    };

    req.user = { id: decoded.userId, userId: decoded.userId };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, '無効な認証トークンです'));
    } else {
      next(error);
    }
  }
};
