import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
  password: process.env.REDIS_PASSWORD,
});

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // IPアドレスごとに15分間に100リクエストまで
  standardHeaders: true, // `RateLimit-*` ヘッダーを追加
  legacyHeaders: false, // `X-RateLimit-*` ヘッダーを無効化
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:',
  }),
  message: {
    status: 429,
    message: 'リクエスト制限を超えました。しばらく待ってから再度お試しください。',
  },
}); 