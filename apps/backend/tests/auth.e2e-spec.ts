import { Express } from 'express';
import request from 'supertest';
import { createServer } from '../src/app';
import { supabase } from '../src/config/database';

/**
 * 認証のE2Eテスト
 * - サインアップ
 * - ログイン
 * - ログアウト
 * - 保護されたルートへのアクセス
 */
describe('認証 E2E テスト', () => {
  let app: Express;
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
    name: 'テストユーザー',
  };
  let accessToken: string;

  // テスト前にサーバーを起動
  beforeAll(async () => {
    app = await createServer();
  });

  // テスト後にテストユーザーを削除
  afterAll(async () => {
    try {
      // テストユーザーがあれば削除
      const { data } = await supabase.auth.admin.listUsers();
      const user = data.users.find((u) => u.email === testUser.email);
      if (user) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    } catch (error) {
      console.error('テストユーザーの削除に失敗しました:', error);
    }
  });

  describe('サインアップ (POST /auth/signup)', () => {
    it('正常: 有効な情報で新規ユーザーを作成できる', async () => {
      const response = await request(app).post('/auth/signup').send(testUser).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('name', testUser.name);
      expect(response.body).not.toHaveProperty('password');
    });

    it('異常: 既存のメールアドレスで登録するとエラーになる', async () => {
      const response = await request(app).post('/auth/signup').send(testUser).expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('異常: 無効なメールアドレスでエラーになる', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('異常: 短すぎるパスワードでエラーになる', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          ...testUser,
          email: `test-short-${Date.now()}@example.com`,
          password: '123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('ログイン (POST /auth/login)', () => {
    it('正常: 有効な認証情報でログインするとJWTトークンが返る', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      accessToken = response.body.accessToken;
    });

    it('異常: 無効なパスワードでログインするとエラーになる', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('異常: 存在しないメールアドレスでログインするとエラーになる', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: `nonexistent-${Date.now()}@example.com`,
          password: testUser.password,
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('ログアウト (POST /auth/logout)', () => {
    it('正常: 有効なトークンでログアウトできる', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Successfully logged out');
    });

    it('異常: トークンなしでログアウトするとエラーになる', async () => {
      const response = await request(app).post('/auth/logout').expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('保護されたルート', () => {
    // 再度ログインしてトークンを取得
    beforeAll(async () => {
      const response = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      accessToken = response.body.accessToken;
    });

    it('認証が必要なルートに有効なトークンでアクセスできる', async () => {
      // /api/v1/projects などの認証が必要なエンドポイントを使用
      // 実際のプロジェクトエンドポイントに合わせて調整が必要
      const response = await request(app)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // レスポンスの内容は実際のAPIに合わせて検証
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('認証が必要なルートに無効なトークンでアクセスするとエラーになる', async () => {
      const response = await request(app)
        .get('/api/v1/projects')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('認証が必要なルートにトークンなしでアクセスするとエラーになる', async () => {
      const response = await request(app).get('/api/v1/projects').expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
