import request from 'supertest';
import { app } from '../../src/app';
import { createTestToken, getTestHeaders } from '../helpers/auth';

describe('Auth Middleware', () => {
  const testUserId = 'test-user-id';
  const validToken = createTestToken(testUserId);
  const invalidToken = 'invalid-token';

  describe('Protected Routes', () => {
    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/projects')
        .set(getTestHeaders(validToken));

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should deny access without token', async () => {
      const response = await request(app)
        .get('/api/v1/projects');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/projects')
        .set(getTestHeaders(invalidToken));

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Role-based Access', () => {
    it('should allow admin access to admin routes', async () => {
      const adminToken = createTestToken(testUserId, ['admin']);
      const response = await request(app)
        .get('/api/v1/admin/users')
        .set(getTestHeaders(adminToken));

      expect(response.status).not.toBe(403);
    });

    it('should deny non-admin access to admin routes', async () => {
      const response = await request(app)
        .get('/api/v1/admin/users')
        .set(getTestHeaders(validToken));

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 