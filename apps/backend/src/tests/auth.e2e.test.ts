import request from 'supertest';
import { app } from '../app';
import { supabaseAdmin } from '../config/supabase';

describe('認証E2Eテスト', () => {
  // テスト用のユーザー情報
  const testUser = {
    email: 'test@example.com',
    password: 'Test1234!',
    name: 'Test User',
  };

  // テスト前にユーザーを削除
  beforeEach(async () => {
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', testUser.email);

    if (users && users.length > 0) {
      await supabaseAdmin.auth.admin.deleteUser(users[0].id);
    }
  });

  // テスト後にユーザーを削除
  afterEach(async () => {
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', testUser.email);

    if (users && users.length > 0) {
      await supabaseAdmin.auth.admin.deleteUser(users[0].id);
    }
  });

  describe('サインアップ', () => {
    it('新しいユーザーを登録できる', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.name).toBe(testUser.name);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('無効なメールアドレスで登録できない', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          ...testUser,
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Validation failed');
    });

    it('弱いパスワードで登録できない', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          ...testUser,
          password: 'weak',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('ログイン', () => {
    let userId: string;

    beforeEach(async () => {
      // テスト用ユーザーを作成
      const { data: authData } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      });

      if (authData.user) {
        userId = authData.user.id;
        await supabaseAdmin.from('users').insert({
          id: userId,
          email: testUser.email,
          name: testUser.name,
        });
      }
    });

    it('正しい認証情報でログインできる', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('間違ったパスワードでログインできない', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'wrong-password',
      });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('メールアドレスまたはパスワードが正しくありません');
    });

    it('存在しないユーザーでログインできない', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: testUser.password,
      });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('メールアドレスまたはパスワードが正しくありません');
    });
  });

  describe('トークンリフレッシュ', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // テスト用ユーザーを作成してログイン
      const { data: authData } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      });

      if (authData.user) {
        await supabaseAdmin.from('users').insert({
          id: authData.user.id,
          email: testUser.email,
          name: testUser.name,
        });

        // ログインしてリフレッシュトークンを取得
        const loginResponse = await request(app).post('/api/v1/auth/login').send({
          email: testUser.email,
          password: testUser.password,
        });

        refreshToken = loginResponse.body.data.refreshToken;
      }
    });

    it('有効なリフレッシュトークンで新しいトークンを取得できる', async () => {
      const response = await request(app).post('/api/v1/auth/refresh-token').send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('無効なリフレッシュトークンで新しいトークンを取得できない', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('無効なトークンです');
    });
  });

  describe('ログアウト', () => {
    it('ログアウトできる', async () => {
      const response = await request(app).post('/api/v1/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('ログアウトしました');
    });
  });
});
