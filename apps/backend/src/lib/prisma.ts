import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// 環境に応じた.envファイルを読み込む
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const prisma = new PrismaClient();

export { prisma };