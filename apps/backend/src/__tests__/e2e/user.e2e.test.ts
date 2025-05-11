import request from 'supertest';
import { app } from '../../app';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

describe('User E2E Tests', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // テストユーザーの作成
    const hashedPassword = await hash('testpassword', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });
    testUserId = user.id;

    // 認証トークンの取得
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // テストデータのクリーンアップ
    await prisma.user.delete({
      where: {
        id: testUserId,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'newpassword',
          name: 'New User',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('newuser@example.com');
      expect(response.body.name).toBe('New User');
      expect(response.body).not.toHaveProperty('password');

      // 作成したユーザーのクリーンアップ
      await prisma.user.delete({
        where: {
          email: 'newuser@example.com',
        },
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid@example.com',
          // password is missing
          name: 'Invalid User',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should not allow duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com', // 既存のメールアドレス
          password: 'newpassword',
          name: 'Duplicate User',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'testpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.name).toBe('Test User');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated User',
          email: 'updated@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body.name).toBe('Updated User');
      expect(response.body.email).toBe('updated@example.com');
      expect(response.body).not.toHaveProperty('password');

      // 元の値に戻す
      await prisma.user.update({
        where: { id: testUserId },
        data: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });
    });

    it('should not allow duplicate email update', async () => {
      // 別のユーザーを作成
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: await hash('password', 10),
          name: 'Other User',
        },
      });

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'other@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');

      // 作成したユーザーを削除
      await prisma.user.delete({
        where: { id: otherUser.id },
      });
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .put('/api/users/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated User',
        });

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send({
          name: 'Updated User',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/users/:id', () => {
    let userToDeleteId: string;

    beforeAll(async () => {
      // 削除用のテストユーザーを作成
      const user = await prisma.user.create({
        data: {
          email: 'delete@example.com',
          password: await hash('password', 10),
          name: 'Delete User',
        },
      });
      userToDeleteId = user.id;
    });

    it('should delete user', async () => {
      const response = await request(app)
        .delete(`/api/users/${userToDeleteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // ユーザーが実際に削除されたことを確認
      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDeleteId },
      });
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .delete('/api/users/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .delete(`/api/users/${userToDeleteId}`);

      expect(response.status).toBe(401);
    });
  });
});
