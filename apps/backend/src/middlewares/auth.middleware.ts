import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '@commit-coach/domain/entities/user';

interface JwtPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthMiddleware {
  private readonly secret: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    this.secret = secret;
  }

  authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: '認証が必要です' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'トークンが無効です' });
      }

      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'トークンが無効です' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'トークンの有効期限が切れています' });
      }
      return res.status(500).json({ message: '認証処理中にエラーが発生しました' });
    }
  };

  authorize = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ message: '認証が必要です' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'アクセス権限がありません' });
      }

      next();
    };
  };
}
