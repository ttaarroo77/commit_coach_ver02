import request from 'supertest';
import express from 'express';
import { taskGroupRoutes } from '../../routes/task-group.routes';
import { TaskGroupService } from '../../services/task-group.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import {
  createTestUser,
  deleteTestUser,
  createTestProject,
  deleteTestProject,
  createTestTaskGroup,
  deleteTestTaskGroup,
} from '../utils/test-utils';

jest.mock('../../services/task-group.service');
jest.mock('../../middleware/auth.middleware');

describe('TaskGroup Routes', () => {
  let app: express.Application;
  let taskGroupService: jest.Mocked<TaskGroupService>;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let token: string;

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
    await deleteTestTaskGroup(groupId);
    await deleteTestProject(projectId);
    await deleteTestUser(userId);
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    taskGroupService = new TaskGroupService() as jest.Mocked<TaskGroupService>;
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    app.use('/task-groups', authMiddleware, taskGroupRoutes);
  });

  describe('POST /task-groups', () => {
    it('新しいタスクグループを作成できる', async () => {
      const groupData = {
        title: 'テストタスクグループ',
        description: 'テスト用のタスクグループです',
        project_id: projectId,
      };

      const createdGroup = { ...groupData, id: groupId, user_id: userId, order: 0 };
      taskGroupService.createTaskGroup.mockResolvedValue(createdGroup);

      const response = await request(app)
        .post('/task-groups')
        .set('Authorization', `Bearer ${token}`)
        .send(groupData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdGroup);
      expect(taskGroupService.createTaskGroup).toHaveBeenCalledWith(userId, groupData);
    });

    it('認証されていない場合はエラーになる', async () => {
      (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
        res.status(401).json({ message: '認証が必要です' });
      });

      const response = await request(app).post('/task-groups');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('認証が必要です');
    });
  });

  describe('GET /task-groups/project/:projectId', () => {
    it('プロジェクトのタスクグループ一覧を取得できる', async () => {
      const groups = [
        {
          id: groupId,
          title: 'テストタスクグループ',
          project_id: projectId,
          user_id: userId,
        },
      ];
      taskGroupService.getTaskGroupsByProject.mockResolvedValue(groups);

      const response = await request(app)
        .get(`/task-groups/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(groups);
      expect(taskGroupService.getTaskGroupsByProject).toHaveBeenCalledWith(
        userId,
        projectId
      );
    });
  });

  describe('GET /task-groups/:id', () => {
    it('タスクグループの詳細を取得できる', async () => {
      const group = {
        id: groupId,
        title: 'テストタスクグループ',
        user_id: userId,
      };
      taskGroupService.getTaskGroupById.mockResolvedValue(group);

      const response = await request(app)
        .get(`/task-groups/${groupId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(group);
      expect(taskGroupService.getTaskGroupById).toHaveBeenCalledWith(userId, groupId);
    });

    it('タスクグループが見つからない場合はエラーになる', async () => {
      taskGroupService.getTaskGroupById.mockResolvedValue(null);

      const response = await request(app)
        .get('/task-groups/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('タスクグループが見つかりません');
    });
  });

  describe('PUT /task-groups/:id', () => {
    it('タスクグループを更新できる', async () => {
      const updates = {
        title: '更新されたテストタスクグループ',
        description: '更新されたテスト用のタスクグループです',
      };
      const updatedGroup = {
        id: groupId,
        ...updates,
        user_id: userId,
      };
      taskGroupService.updateTaskGroup.mockResolvedValue(updatedGroup);

      const response = await request(app)
        .put(`/task-groups/${groupId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedGroup);
      expect(taskGroupService.updateTaskGroup).toHaveBeenCalledWith(
        userId,
        groupId,
        updates
      );
    });
  });

  describe('DELETE /task-groups/:id', () => {
    it('タスクグループを削除できる', async () => {
      const response = await request(app)
        .delete(`/task-groups/${groupId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
      expect(taskGroupService.deleteTaskGroup).toHaveBeenCalledWith(userId, groupId);
    });
  });

  describe('POST /task-groups/order', () => {
    it('タスクグループの順序を更新できる', async () => {
      const orderData = {
        newOrder: 1,
        projectId,
      };

      const response = await request(app)
        .post('/task-groups/order')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(response.status).toBe(204);
      expect(taskGroupService.updateTaskGroupOrder).toHaveBeenCalledWith(
        userId,
        groupId,
        orderData.newOrder,
        projectId
      );
    });
  });
}); 