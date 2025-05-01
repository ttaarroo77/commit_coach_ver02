import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import taskRoutes from '../../routes/task.routes';
import { taskService, TaskService } from '../../services/task.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { Task, TaskPriority, TaskStatus } from '../../types/task.types';
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
  let mockedTaskService: jest.Mocked<TaskService>;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let taskId: string;
  let token: string;
  let testTask: Task;

  const mockedAuthMiddleware = authMiddleware as jest.Mock;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    const project = await createTestProject(userId);
    projectId = project.id;
    const group = await createTestTaskGroup(userId, projectId);
    groupId = group.id;
    token = 'test-token';
  });

  afterAll(async () => {
    if (taskId) await deleteTestTask(taskId);
    if (groupId) await deleteTestTaskGroup(groupId);
    if (projectId) await deleteTestProject(projectId);
    if (userId) await deleteTestUser(userId);
  });

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    mockedTaskService = taskService as jest.Mocked<TaskService>;

    testTask = await createTestTask(userId, projectId, groupId);
    taskId = testTask.id;

    mockedAuthMiddleware.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: userId, userId: userId };
        next();
      }
    );
    app.use('/tasks', mockedAuthMiddleware, taskRoutes);
  });

  afterEach(async () => {
    if (taskId) {
      await deleteTestTask(taskId);
      taskId = undefined as any;
      testTask = undefined as any;
    }
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
        order: 0,
      };

      const createdTask: Task = {
        id: 'new-task-id',
        title: taskData.title,
        description: taskData.description,
        project_id: taskData.project_id,
        group_id: taskData.group_id,
        priority: taskData.priority,
        status: taskData.status,
        due_date: taskData.due_date,
        order: taskData.order,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        parent_id: undefined,
      };
      mockedTaskService.createTask.mockResolvedValue(createdTask);

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.title).toEqual(createdTask.title);
      expect(response.body.user_id).toEqual(createdTask.user_id);
      expect(mockedTaskService.createTask).toHaveBeenCalledWith(userId, taskData);
    });

    it('認証されていない場合はエラーになる', async () => {
      mockedAuthMiddleware.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ message: '認証が必要です' });
      });

      const response = await request(app).post('/tasks');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('認証が必要です');
    });
  });

  describe('GET /tasks/project/:projectId', () => {
    it('プロジェクトのタスク一覧を取得できる', async () => {
      const tasks = [testTask];
      mockedTaskService.getTasksByProject.mockResolvedValue(tasks);

      const response = await request(app)
        .get(`/tasks/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(tasks);
      expect(mockedTaskService.getTasksByProject).toHaveBeenCalledWith(userId, projectId);
    });
  });

  describe('GET /tasks/group/:groupId', () => {
    it('グループのタスク一覧を取得できる', async () => {
      const tasks = [testTask];
      mockedTaskService.getTasksByGroup.mockResolvedValue(tasks);

      const response = await request(app)
        .get(`/tasks/group/${groupId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(tasks);
      expect(mockedTaskService.getTasksByGroup).toHaveBeenCalledWith(userId, groupId);
    });
  });

  describe('GET /tasks/:id', () => {
    it('タスクの詳細を取得できる', async () => {
      mockedTaskService.getTaskById.mockResolvedValue(testTask);

      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(testTask);
      expect(mockedTaskService.getTaskById).toHaveBeenCalledWith(userId, taskId);
    });

    it('タスクが見つからない場合はエラーになる', async () => {
      mockedTaskService.getTaskById.mockResolvedValue(null);

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
      const updatedTask: Task = {
        ...testTask,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      mockedTaskService.updateTask.mockResolvedValue(updatedTask);

      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(mockedTaskService.updateTask).toHaveBeenCalledWith(userId, taskId, updates);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('タスクを削除できる', async () => {
      mockedTaskService.deleteTask.mockResolvedValue(undefined);
      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith(userId, taskId);
    });
  });

  describe('POST /tasks/:id/order', () => {
    it('タスクの順序を更新できる', async () => {
      const orderData = {
        newOrder: 1,
        projectId,
        groupId,
      };
      mockedTaskService.updateTaskOrder.mockResolvedValue(undefined);

      const response = await request(app)
        .post(`/tasks/${taskId}/order`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(response.status).toBe(204);
      expect(mockedTaskService.updateTaskOrder).toHaveBeenCalledWith(
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
      const subtasks: Task[] = [];
      mockedTaskService.getSubtasks.mockResolvedValue(subtasks);

      const response = await request(app)
        .get(`/tasks/${taskId}/subtasks`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(subtasks);
      expect(mockedTaskService.getSubtasks).toHaveBeenCalledWith(userId, taskId);
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    it('タスクのステータスを更新できる', async () => {
      const statusData = { status: TaskStatus.DONE };
      const updatedTask: Task = {
        ...testTask,
        status: TaskStatus.DONE,
        updated_at: new Date().toISOString(),
      };
      mockedTaskService.updateTaskStatus.mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch(`/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send(statusData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(mockedTaskService.updateTaskStatus).toHaveBeenCalledWith(userId, taskId, TaskStatus.DONE);
    });
  });

  describe('PATCH /tasks/:id/due-date', () => {
    it('タスクの期限を更新できる', async () => {
      const dueDate = new Date().toISOString();
      const dueDateData = { dueDate };
      const updatedTask: Task = {
        ...testTask,
        due_date: dueDate,
        updated_at: new Date().toISOString(),
      };
      mockedTaskService.updateTaskDueDate.mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch(`/tasks/${taskId}/due-date`)
        .set('Authorization', `Bearer ${token}`)
        .send(dueDateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(mockedTaskService.updateTaskDueDate).toHaveBeenCalledWith(userId, taskId, dueDate);
    });
  });
});
