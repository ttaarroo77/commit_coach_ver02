import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { ApiError } from './errorHandler';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const rateLimit = (windowMs: number, max: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `rate-limit:${req.ip}:${req.path}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowMs / 1000);
    }

    if (current > max) {
      throw new ApiError(429, 'リクエスト制限を超えました。しばらく待ってから再試行してください。');
    }

    next();
  };
};
