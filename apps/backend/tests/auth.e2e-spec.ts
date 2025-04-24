import { Express } from 'express';
import request from 'supertest';
import { createServer } from '../src/app';

describe('AuthController (e2e)', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createServer();
  });

  describe('/auth/signup (POST)', () => {
    it('should create a new user', () => {
      return request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', 'test@example.com');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 400 for invalid email', () => {
      return request(app)
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
    it('should return JWT token on successful login', () => {
      return request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    let accessToken: string;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      accessToken = loginResponse.body.accessToken;
    });

    it('should successfully logout', () => {
      return request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', () => {
      return request(app)
        .post('/auth/logout')
        .expect(401);
    });
  });

  describe('Protected Routes', () => {
    let accessToken: string;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      accessToken = loginResponse.body.accessToken;
    });

    it('should access protected route with valid token', () => {
      return request(app)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', () => {
      return request(app)
        .get('/api/v1/projects')
        .expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app)
        .get('/api/v1/projects')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
}); 