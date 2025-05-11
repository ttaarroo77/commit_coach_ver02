import request from 'supertest';
import { app } from '../../app';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

describe('Project E2E Tests', () => {
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
    await prisma.project.deleteMany({
      where: {
        userId: testUserId,
      },
    });
    await prisma.user.delete({
      where: {
        id: testUserId,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'Test Description',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Project');
      expect(response.body.description).toBe('Test Description');
      expect(response.body.userId).toBe(testUserId);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          description: 'Test Description',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/projects', () => {
    it('should get all projects for the user', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/projects/:id', () => {
    let projectId: string;

    beforeAll(async () => {
      const project = await prisma.project.create({
        data: {
          name: 'Test Project for Get',
          description: 'Test Description for Get',
          userId: testUserId,
        },
      });
      projectId = project.id;
    });

    it('should get a project by id', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', projectId);
      expect(response.body.name).toBe('Test Project for Get');
      expect(response.body.description).toBe('Test Description for Get');
    });

    it('should return 404 if project not found', async () => {
      const response = await request(app)
        .get('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/projects/:id', () => {
    let projectId: string;

    beforeAll(async () => {
      const project = await prisma.project.create({
        data: {
          name: 'Test Project for Update',
          description: 'Test Description for Update',
          userId: testUserId,
        },
      });
      projectId = project.id;
    });

    it('should update a project', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Project',
          description: 'Updated Description',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', projectId);
      expect(response.body.name).toBe('Updated Project');
      expect(response.body.description).toBe('Updated Description');
    });

    it('should return 404 if project not found', async () => {
      const response = await request(app)
        .put('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Project',
          description: 'Updated Description',
        });

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .send({
          name: 'Updated Project',
          description: 'Updated Description',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    let projectId: string;

    beforeAll(async () => {
      const project = await prisma.project.create({
        data: {
          name: 'Test Project for Delete',
          description: 'Test Description for Delete',
          userId: testUserId,
        },
      });
      projectId = project.id;
    });

    it('should delete a project', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // プロジェクトが実際に削除されたことを確認
      const deletedProject = await prisma.project.findUnique({
        where: { id: projectId },
      });
      expect(deletedProject).toBeNull();
    });

    it('should return 404 if project not found', async () => {
      const response = await request(app)
        .delete('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`);

      expect(response.status).toBe(401);
    });
  });
});
