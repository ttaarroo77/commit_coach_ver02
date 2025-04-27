import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testUserEmail: string;
  let testUserPassword: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // テスト用ユーザーの作成
    testUserEmail = `test${Date.now()}@example.com`;
    testUserPassword = 'Test123!';

    const { data, error } = await supabase.auth.signUp({
      email: testUserEmail,
      password: testUserPassword,
    });

    if (error) throw error;
  });

  afterAll(async () => {
    await app.close();

    // テスト用ユーザーの削除
    const {
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });

    if (user) {
      await supabase.auth.admin.deleteUser(user.id);
    }
  });

  describe('/auth/signup (POST)', () => {
    it('should create a new user', async () => {
      const newUserEmail = `newuser${Date.now()}@example.com`;
      const response = await request(app.getHttpServer()).post('/auth/signup').send({
        email: newUserEmail,
        password: 'NewUser123!',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');

      // テスト後にユーザーを削除
      const {
        data: { user },
      } = await supabase.auth.signInWithPassword({
        email: newUserEmail,
        password: 'NewUser123!',
      });

      if (user) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return access token for valid credentials', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        email: testUserEmail,
        password: testUserPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        email: testUserEmail,
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('認証に失敗しました');
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should logout successfully', async () => {
      // まずログイン
      const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
        email: testUserEmail,
        password: testUserPassword,
      });

      const { accessToken } = loginResponse.body;

      // ログアウト
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('ログアウトしました');
    });
  });
});
