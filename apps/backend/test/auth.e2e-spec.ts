import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import * as dotenv from 'dotenv';
import { app } from '../src/app';
import request from 'supertest';
import { createTestUser, createTestToken, getTestHeaders, cleanupTestUser } from './helpers/auth';
import { supabase } from '../src/config/database';
import '@types/jest';

dotenv.config();

describe('認証エンドポイント (e2e)', () => {
  let server: any;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  };

  beforeAll(async () => {
    server = app.listen(0);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /api/auth/signup', () => {
    it('新規ユーザー登録が成功すること', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('name', testUser.name);
    });

    it('既存のメールアドレスで登録を試みるとエラーになること', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(400);
    });

    it('無効なデータでリクエストするとエラーになること', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('ログインが成功すること', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('無効な認証情報でログインを試みるとエラーになること', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrong-password',
        })
        .expect(401);
    });
  });
});
