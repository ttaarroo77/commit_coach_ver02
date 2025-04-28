import { Request, Response, NextFunction } from 'express';
import { cache } from '../config/cache';

export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // GETリクエストのみキャッシュ
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      // キャッシュからデータを取得
      const cachedData = await cache.get(key);
      if (cachedData) {
        return res.json(cachedData);
      }

      // オリジナルのレスポンスメソッドを保存
      const originalJson = res.json;

      // レスポンスメソッドをオーバーライド
      res.json = function (body: any) {
        // キャッシュに保存
        cache.set(key, body, ttl);
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}; 