import compression from 'compression';
import { Request, Response, NextFunction } from 'express';

export const compressionMiddleware = compression({
  level: 6, // 圧縮レベル（1-9）
  threshold: 1024, // 1KB以上のレスポンスを圧縮
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}); 