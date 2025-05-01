import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/lib/prisma';

describe('認証E2Eテスト', () => {
  beforeAll(async () => {
    // テスト用データベースのセットアップ
    await prisma.$connect();
  });

  afterAll(async () => {
    // テスト用データベースのクリーンアップ
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // 各テスト前にデータベースをクリーンアップ
    await prisma.user.deleteMany();
  });

  describe('POST /auth/login', () => {
    it('正しい認証情報でログインできること', async () => {
      // テスト用ユーザーの作成
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashed_password', // 実際のアプリケーションではハッシュ化されたパスワードを使用
        },
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('無効な認証情報でログインできないこと', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/signup', () => {
    it('新規ユーザーを登録できること', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('newuser@example.com');
    });

    it('重複するメールアドレスで登録できないこと', async () => {
      // 既存ユーザーの作成
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: 'hashed_password',
        },
      });

      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Existing User',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/logout', () => {
    it('ログアウトできること', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 