import request from 'supertest';
import { app } from '../src/app';
import { createTestUser, createTestToken, getTestHeaders, cleanupTestUser } from './helpers/auth';

describe('Auth Endpoints', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'test-password';
  let testUser: any;
  let testToken: string;

  beforeAll(async () => {
    testUser = await createTestUser(testEmail, testPassword);
    testToken = createTestToken(testUser.id);
  });

  afterAll(async () => {
    await cleanupTestUser(testEmail);
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testEmail,
          password: 'wrong-password',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
      const newEmail = 'newuser@example.com';
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: newEmail,
          password: testPassword,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');

      await cleanupTestUser(newEmail);
    });

    it('should fail with existing email', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .set(getTestHeaders(testToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .post('/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 