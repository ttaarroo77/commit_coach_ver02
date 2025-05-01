import { prisma } from '../src/lib/prisma';

// テスト用データベースのセットアップ
beforeAll(async () => {
  await prisma.$connect();
});

// テスト用データベースのクリーンアップ
afterAll(async () => {
  await prisma.$disconnect();
});

// 各テスト前のデータベースクリーンアップ
beforeEach(async () => {
  await prisma.user.deleteMany();
}); 