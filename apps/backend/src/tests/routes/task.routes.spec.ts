import request from 'supertest';
import express from 'express';
import { taskRoutes } from '../../routes/task.routes';
import { TaskService } from '../../services/task.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { TaskPriority, TaskStatus } from '../../types/task.types';
import {
  createTestUser,
  deleteTestUser,
  createTestProject,
  deleteTestProject,
  createTestTaskGroup,
  deleteTestTaskGroup,
  createTestTask,
  deleteTestTask,
} from '../utils/test-utils';

jest.mock('../../services/task.service');
jest.mock('../../middleware/auth.middleware');

describe('Task Routes', () => {
  let app: express.Application;
  let taskService: jest.Mocked<TaskService>;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let taskId: string;
  let token: string;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    const project = await createTestProject(userId);
    projectId = project.id;
    const group = await createTestTaskGroup(userId, projectId);
    groupId = group.id;
    const task = await createTestTask(userId, projectId, groupId);
    taskId = task.id;
    token = 'test-token';
  });

  afterAll(async () => {
    await deleteTestTask(taskId);
    await deleteTestTaskGroup(groupId);
    await deleteTestProject(projectId);
    await deleteTestUser(userId);
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    taskService = new TaskService() as jest.Mocked<TaskService>;
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    app.use('/tasks', authMiddleware, taskRoutes);
  });

  describe('POST /tasks', () => {
    it('新しいタスクを作成できる', async () => {
      const taskData = {
        title: 'テストタスク',
        description: 'テスト用のタスクです',
        project_id: projectId,
        group_id: groupId,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        due_date: new Date().toISOString(),
      };

      const createdTask = { ...taskData, id: taskId, user_id: userId };
      taskService.createTask.mockResolvedValue(createdTask);

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdTask);
      expect(taskService.createTask).toHaveBeenCalledWith(userId, taskData);
    });

    it('認証されていない場合はエラーになる', async () => {
      (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
        res.status(401).json({ message: '認証が必要です' });
      });

      const response = await request(app).post('/tasks');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('認証が必要です');
    });
  });

  describe('GET /tasks/project/:projectId', () => {
    it('プロジェクトのタスク一覧を取得できる', async () => {
      const tasks = [
        {
          id: taskId,
          title: 'テストタスク',
          project_id: projectId,
          user_id: userId,
        },
      ];
      taskService.getTasksByProject.mockResolvedValue(tasks);

      const response = await request(app)
        .get(`/tasks/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(tasks);
      expect(taskService.getTasksByProject).toHaveBeenCalledWith(userId, projectId);
    });
  });

  describe('GET /tasks/group/:groupId', () => {
    it('グループのタスク一覧を取得できる', async () => {
      const tasks = [
        {
          id: taskId,
          title: 'テストタスク',
          group_id: groupId,
          user_id: userId,
        },
      ];
      taskService.getTasksByGroup.mockResolvedValue(tasks);

      const response = await request(app)
        .get(`/tasks/group/${groupId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(tasks);
      expect(taskService.getTasksByGroup).toHaveBeenCalledWith(userId, groupId);
    });
  });

  describe('GET /tasks/:id', () => {
    it('タスクの詳細を取得できる', async () => {
      const task = {
        id: taskId,
        title: 'テストタスク',
        user_id: userId,
      };
      taskService.getTaskById.mockResolvedValue(task);

      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(task);
      expect(taskService.getTaskById).toHaveBeenCalledWith(userId, taskId);
    });

    it('タスクが見つからない場合はエラーになる', async () => {
      taskService.getTaskById.mockResolvedValue(null);

      const response = await request(app)
        .get('/tasks/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('タスクが見つかりません');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('タスクを更新できる', async () => {
      const updates = {
        title: '更新されたテストタスク',
        description: '更新されたテスト用のタスクです',
      };
      const updatedTask = {
        id: taskId,
        ...updates,
        user_id: userId,
      };
      taskService.updateTask.mockResolvedValue(updatedTask);

      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(taskService.updateTask).toHaveBeenCalledWith(userId, taskId, updates);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('タスクを削除できる', async () => {
      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
      expect(taskService.deleteTask).toHaveBeenCalledWith(userId, taskId);
    });
  });

  describe('POST /tasks/:id/order', () => {
    it('タスクの順序を更新できる', async () => {
      const orderData = {
        newOrder: 1,
        projectId,
        groupId,
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/order`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(response.status).toBe(204);
      expect(taskService.updateTaskOrder).toHaveBeenCalledWith(
        userId,
        taskId,
        orderData.newOrder,
        projectId,
        groupId
      );
    });
  });

  describe('GET /tasks/:parentId/subtasks', () => {
    it('サブタスクを取得できる', async () => {
      const subtasks = [
        {
          id: 'subtask-id',
          title: 'サブタスク',
          parent_id: taskId,
          user_id: userId,
        },
      ];
      taskService.getSubtasks.mockResolvedValue(subtasks);

      const response = await request(app)
        .get(`/tasks/${taskId}/subtasks`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(subtasks);
      expect(taskService.getSubtasks).toHaveBeenCalledWith(userId, taskId);
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    it('タスクのステータスを更新できる', async () => {
      const statusData = { status: TaskStatus.DONE };
      const updatedTask = {
        id: taskId,
        status: TaskStatus.DONE,
        user_id: userId,
      };
      taskService.updateTaskStatus.mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch(`/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send(statusData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(taskService.updateTaskStatus).toHaveBeenCalledWith(userId, taskId, TaskStatus.DONE);
    });
  });

  describe('PATCH /tasks/:id/due-date', () => {
    it('タスクの期限を更新できる', async () => {
      const dueDate = new Date().toISOString();
      const dueDateData = { dueDate };
      const updatedTask = {
        id: taskId,
        due_date: dueDate,
        user_id: userId,
      };
      taskService.updateTaskDueDate.mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch(`/tasks/${taskId}/due-date`)
        .set('Authorization', `Bearer ${token}`)
        .send(dueDateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(taskService.updateTaskDueDate).toHaveBeenCalledWith(userId, taskId, dueDate);
    });
  });
});
