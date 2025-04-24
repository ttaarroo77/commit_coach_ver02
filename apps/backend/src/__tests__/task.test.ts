import request from 'supertest';
import app from '../app';
import { Task } from '../models/Task';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

describe('Task API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // テスト用ユーザーの作成
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    await user.save();
    userId = user._id.toString();

    // JWTトークンの生成
    token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          dueDate: new Date(),
          priority: 'high'
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Task');
      expect(response.body.userId).toBe(userId);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test Description'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks for the user', async () => {
      // テストデータの作成
      await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        dueDate: new Date(),
        priority: 'high',
        userId
      });

      await Task.create({
        title: 'Task 2',
        description: 'Description 2',
        dueDate: new Date(),
        priority: 'medium',
        userId
      });

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const task = await Task.create({
        title: 'Original Task',
        description: 'Original Description',
        dueDate: new Date(),
        priority: 'high',
        userId
      });

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task',
          status: 'completed'
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task');
      expect(response.body.status).toBe('completed');
    });

    it('should return 404 if task not found', async () => {
      const response = await request(app)
        .put('/api/tasks/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        description: 'Description',
        dueDate: new Date(),
        priority: 'high',
        userId
      });

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });
  });
}); 