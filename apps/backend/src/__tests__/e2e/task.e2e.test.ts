import request from 'supertest';
import { app } from '../../app';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

describe('Task E2E Tests', () => {
  let authToken: string;
  let testUserId: string;
  let testProjectId: string;

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

    // テストプロジェクトの作成
    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'Test Project Description',
        userId: testUserId,
      },
    });
    testProjectId = project.id;

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
    await prisma.task.deleteMany({
      where: {
        projectId: testProjectId,
      },
    });
    await prisma.project.delete({
      where: {
        id: testProjectId,
      },
    });
    await prisma.user.delete({
      where: {
        id: testUserId,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Task Description',
          projectId: testProjectId,
          status: 'TODO',
          priority: 'MEDIUM',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('Test Task Description');
      expect(response.body.projectId).toBe(testProjectId);
      expect(response.body.status).toBe('TODO');
      expect(response.body.priority).toBe('MEDIUM');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // title is missing
          description: 'Test Task Description',
          projectId: testProjectId,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate project existence', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Task Description',
          projectId: 'non-existent-project-id',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Task Description',
          projectId: testProjectId,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    beforeAll(async () => {
      // テストタスクの作成
      await prisma.task.create({
        data: {
          title: 'Test Task for List',
          description: 'Test Task Description for List',
          projectId: testProjectId,
          status: 'TODO',
          priority: 'MEDIUM',
        },
      });
    });

    it('should get all tasks for a project', async () => {
      const response = await request(app)
        .get(`/api/tasks?projectId=${testProjectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('status');
      expect(response.body[0]).toHaveProperty('priority');
    });

    it('should return 400 if projectId is missing', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get(`/api/tasks?projectId=${testProjectId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId: string;

    beforeAll(async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task for Get',
          description: 'Test Task Description for Get',
          projectId: testProjectId,
          status: 'TODO',
          priority: 'MEDIUM',
        },
      });
      taskId = task.id;
    });

    it('should get a task by id', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', taskId);
      expect(response.body.title).toBe('Test Task for Get');
      expect(response.body.description).toBe('Test Task Description for Get');
      expect(response.body.status).toBe('TODO');
      expect(response.body.priority).toBe('MEDIUM');
    });

    it('should return 404 if task not found', async () => {
      const response = await request(app)
        .get('/api/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: string;

    beforeAll(async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task for Update',
          description: 'Test Task Description for Update',
          projectId: testProjectId,
          status: 'TODO',
          priority: 'MEDIUM',
        },
      });
      taskId = task.id;
    });

    it('should update a task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          description: 'Updated Task Description',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', taskId);
      expect(response.body.title).toBe('Updated Task');
      expect(response.body.description).toBe('Updated Task Description');
      expect(response.body.status).toBe('IN_PROGRESS');
      expect(response.body.priority).toBe('HIGH');
    });

    it('should validate task status', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'INVALID_STATUS',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 if task not found', async () => {
      const response = await request(app)
        .put('/api/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
        });

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({
          title: 'Updated Task',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: string;

    beforeAll(async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task for Delete',
          description: 'Test Task Description for Delete',
          projectId: testProjectId,
          status: 'TODO',
          priority: 'MEDIUM',
        },
      });
      taskId = task.id;
    });

    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // タスクが実際に削除されたことを確認
      const deletedTask = await prisma.task.findUnique({
        where: { id: taskId },
      });
      expect(deletedTask).toBeNull();
    });

    it('should return 404 if task not found', async () => {
      const response = await request(app)
        .delete('/api/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`);

      expect(response.status).toBe(401);
    });
  });
});
