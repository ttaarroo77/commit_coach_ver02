import { Request, Response } from 'express';
import { TaskGroupController } from '../../controllers/task-group.controller';
import { TaskGroupService } from '../../services/task-group.service';
import {
  createTestUser,
  deleteTestUser,
  createTestProject,
  deleteTestProject,
  createTestTaskGroup,
  deleteTestTaskGroup,
} from '../utils/test-utils';

jest.mock('../../services/task-group.service');

describe('TaskGroupController', () => {
  let taskGroupController: TaskGroupController;
  let taskGroupService: jest.Mocked<TaskGroupService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userId: string;
  let projectId: string;
  let groupId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    const project = await createTestProject(userId);
    projectId = project.id;
    const group = await createTestTaskGroup(userId, projectId);
    groupId = group.id;
  });

  afterAll(async () => {
    await deleteTestTaskGroup(groupId);
    await deleteTestProject(projectId);
    await deleteTestUser(userId);
  });

  beforeEach(() => {
    taskGroupService = new TaskGroupService() as jest.Mocked<TaskGroupService>;
    taskGroupController = new TaskGroupController();
    (taskGroupController as any).taskGroupService = taskGroupService;

    req = {
      user: { id: userId },
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('createTaskGroup', () => {
    it('新しいタスクグループを作成できる', async () => {
      const groupData = {
        title: 'テストタスクグループ',
        description: 'テスト用のタスクグループです',
        project_id: projectId,
      };

      req.body = groupData;
      const createdGroup = { ...groupData, id: groupId, user_id: userId, order: 0 };
      taskGroupService.createTaskGroup.mockResolvedValue(createdGroup);

      await taskGroupController.createTaskGroup(req as Request, res as Response);

      expect(taskGroupService.createTaskGroup).toHaveBeenCalledWith(userId, groupData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdGroup);
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskGroupController.createTaskGroup(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });

  describe('getTaskGroupsByProject', () => {
    it('プロジェクトのタスクグループ一覧を取得できる', async () => {
      req.params = { projectId };
      const groups = [
        {
          id: groupId,
          title: 'テストタスクグループ',
          project_id: projectId,
          user_id: userId,
        },
      ];
      taskGroupService.getTaskGroupsByProject.mockResolvedValue(groups);

      await taskGroupController.getTaskGroupsByProject(req as Request, res as Response);

      expect(taskGroupService.getTaskGroupsByProject).toHaveBeenCalledWith(
        userId,
        projectId
      );
      expect(res.json).toHaveBeenCalledWith(groups);
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskGroupController.getTaskGroupsByProject(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });

  describe('getTaskGroupById', () => {
    it('タスクグループの詳細を取得できる', async () => {
      req.params = { id: groupId };
      const group = {
        id: groupId,
        title: 'テストタスクグループ',
        user_id: userId,
      };
      taskGroupService.getTaskGroupById.mockResolvedValue(group);

      await taskGroupController.getTaskGroupById(req as Request, res as Response);

      expect(taskGroupService.getTaskGroupById).toHaveBeenCalledWith(userId, groupId);
      expect(res.json).toHaveBeenCalledWith(group);
    });

    it('タスクグループが見つからない場合はエラーになる', async () => {
      req.params = { id: 'non-existent-id' };
      taskGroupService.getTaskGroupById.mockResolvedValue(null);

      await expect(
        taskGroupController.getTaskGroupById(req as Request, res as Response)
      ).rejects.toThrow('タスクグループが見つかりません');
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskGroupController.getTaskGroupById(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });

  describe('updateTaskGroup', () => {
    it('タスクグループを更新できる', async () => {
      req.params = { id: groupId };
      req.body = {
        title: '更新されたテストタスクグループ',
        description: '更新されたテスト用のタスクグループです',
      };
      const updatedGroup = {
        id: groupId,
        ...req.body,
        user_id: userId,
      };
      taskGroupService.updateTaskGroup.mockResolvedValue(updatedGroup);

      await taskGroupController.updateTaskGroup(req as Request, res as Response);

      expect(taskGroupService.updateTaskGroup).toHaveBeenCalledWith(
        userId,
        groupId,
        req.body
      );
      expect(res.json).toHaveBeenCalledWith(updatedGroup);
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskGroupController.updateTaskGroup(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });

  describe('deleteTaskGroup', () => {
    it('タスクグループを削除できる', async () => {
      req.params = { id: groupId };

      await taskGroupController.deleteTaskGroup(req as Request, res as Response);

      expect(taskGroupService.deleteTaskGroup).toHaveBeenCalledWith(userId, groupId);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskGroupController.deleteTaskGroup(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });

  describe('updateTaskGroupOrder', () => {
    it('タスクグループの順序を更新できる', async () => {
      req.body = {
        newOrder: 1,
        projectId,
      };

      await taskGroupController.updateTaskGroupOrder(req as Request, res as Response);

      expect(taskGroupService.updateTaskGroupOrder).toHaveBeenCalledWith(
        userId,
        groupId,
        req.body.newOrder,
        projectId
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('無効なリクエストの場合はエラーになる', async () => {
      req.body = {};

      await expect(
        taskGroupController.updateTaskGroupOrder(req as Request, res as Response)
      ).rejects.toThrow('無効なリクエストです');
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskGroupController.updateTaskGroupOrder(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });
}); 