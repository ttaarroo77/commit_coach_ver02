import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import taskGroupRoutes from '../../routes/task-group.routes';
import { taskGroupService, TaskGroupService } from '../../services/task-group.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { TaskGroup } from '../../types/task-group.types';
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
  let mockedTaskGroupService: jest.Mocked<TaskGroupService>;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let token: string;

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
    await deleteTestTaskGroup(groupId);
    await deleteTestProject(projectId);
    await deleteTestUser(userId);
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockedTaskGroupService = taskGroupService as jest.Mocked<TaskGroupService>;

    mockedAuthMiddleware.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: userId, userId: userId };
        next();
      }
    );

    app.use('/task-groups', mockedAuthMiddleware, taskGroupRoutes);
  });

  describe('POST /task-groups', () => {
    it('新しいタスクグループを作成できる', async () => {
      const groupData = {
        title: 'テストタスクグループ',
        description: 'テスト用のタスクグループです',
        project_id: projectId,
      };

      const createdGroup: TaskGroup & { id: string; user_id: string; created_at: string; updated_at: string } = {
        title: groupData.title,
        description: groupData.description,
        project_id: groupData.project_id,
        order: 0,
        id: groupId,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockedTaskGroupService.createTaskGroup.mockResolvedValue(createdGroup);

      const response = await request(app)
        .post('/task-groups')
        .set('Authorization', `Bearer ${token}`)
        .send(groupData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdGroup);
      expect(mockedTaskGroupService.createTaskGroup).toHaveBeenCalledWith(userId, groupData);
    });

    it('認証されていない場合はエラーになる', async () => {
      mockedAuthMiddleware.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ message: '認証が必要です' });
      });

      const response = await request(app).post('/task-groups');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('認証が必要です');
    });
  });

  describe('GET /task-groups/project/:projectId', () => {
    it('プロジェクトのタスクグループ一覧を取得できる', async () => {
      const groups: (TaskGroup & { id: string; user_id: string; created_at: string; updated_at: string })[] = [
        {
          title: 'テストタスクグループ',
          description: '説明',
          project_id: projectId,
          order: 0,
          id: groupId,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      mockedTaskGroupService.getTaskGroupsByProject.mockResolvedValue(groups);

      const response = await request(app)
        .get(`/task-groups/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(groups);
      expect(mockedTaskGroupService.getTaskGroupsByProject).toHaveBeenCalledWith(userId, projectId);
    });
  });

  describe('GET /task-groups/:id', () => {
    it('タスクグループの詳細を取得できる', async () => {
      const group: TaskGroup & { id: string; user_id: string; created_at: string; updated_at: string } = {
        title: 'テストタスクグループ',
        description: '説明',
        project_id: projectId,
        order: 0,
        id: groupId,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockedTaskGroupService.getTaskGroupById.mockResolvedValue(group);

      const response = await request(app)
        .get(`/task-groups/${groupId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(group);
      expect(mockedTaskGroupService.getTaskGroupById).toHaveBeenCalledWith(userId, groupId);
    });

    it('タスクグループが見つからない場合はエラーになる', async () => {
      mockedTaskGroupService.getTaskGroupById.mockResolvedValue(null);

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
      const updatedGroup: TaskGroup & { id: string; user_id: string; created_at: string; updated_at: string } = {
        title: updates.title,
        description: updates.description,
        project_id: projectId,
        order: 0,
        id: groupId,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockedTaskGroupService.updateTaskGroup.mockResolvedValue(updatedGroup);

      const response = await request(app)
        .put(`/task-groups/${groupId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedGroup);
      expect(mockedTaskGroupService.updateTaskGroup).toHaveBeenCalledWith(userId, groupId, updates);
    });
  });

  describe('DELETE /task-groups/:id', () => {
    it('タスクグループを削除できる', async () => {
      const response = await request(app)
        .delete(`/task-groups/${groupId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
      expect(mockedTaskGroupService.deleteTaskGroup).toHaveBeenCalledWith(userId, groupId);
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
      expect(mockedTaskGroupService.updateTaskGroupOrder).toHaveBeenCalledWith(
        userId,
        groupId,
        orderData.newOrder,
        projectId
      );
    });
  });
});
