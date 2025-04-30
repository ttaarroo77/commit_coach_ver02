import { Request, Response } from 'express';
import { TaskGroupController } from '../../controllers/task-group.controller';
import { taskGroupService } from '../../services/task-group.service';
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

// データベースから返される TaskGroup の型 (仮)
interface DbTaskGroup extends TaskGroup {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

describe('TaskGroupController', () => {
  let taskGroupController: TaskGroupController;
  let mockedTaskGroupService: jest.Mocked<typeof taskGroupService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let testGroup: DbTaskGroup | undefined;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    const project = await createTestProject(userId);
    projectId = project.id;
  });

  afterAll(async () => {
    if (groupId) await deleteTestTaskGroup(groupId);
    if (projectId) await deleteTestProject(projectId);
    if (userId) await deleteTestUser(userId);
  });

  beforeEach(async () => {
    mockedTaskGroupService = taskGroupService as jest.Mocked<typeof taskGroupService>;
    taskGroupController = new TaskGroupController();
    (taskGroupController as any).taskGroupService = mockedTaskGroupService;

    testGroup = await createTestTaskGroup(userId, projectId) as DbTaskGroup;
    groupId = testGroup.id;

    req = {
      user: { id: userId, userId: userId },
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(async () => {
    if (groupId) {
      await deleteTestTaskGroup(groupId);
      groupId = undefined as any;
      testGroup = undefined;
    }
  });

  describe('createTaskGroup', () => {
    it('新しいタスクグループを作成できる', async () => {
      const groupData = {
        name: 'テストグループ',
        project_id: projectId,
        order: 0,
      };
      req.body = groupData;

      const createdGroup: DbTaskGroup = {
        id: 'new-group-id',
        name: groupData.name,
        project_id: groupData.project_id,
        order: groupData.order,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockedTaskGroupService.createTaskGroup.mockResolvedValue(createdGroup);

      await taskGroupController.createTaskGroup(req as Request, res as Response);

      expect(mockedTaskGroupService.createTaskGroup).toHaveBeenCalledWith(userId, groupData);
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
      const groups: DbTaskGroup[] = [testGroup!];
      mockedTaskGroupService.getTaskGroupsByProject.mockResolvedValue(groups);

      await taskGroupController.getTaskGroupsByProject(req as Request, res as Response);

      expect(mockedTaskGroupService.getTaskGroupsByProject).toHaveBeenCalledWith(userId, projectId);
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
      mockedTaskGroupService.getTaskGroupById.mockResolvedValue(testGroup!);

      await taskGroupController.getTaskGroupById(req as Request, res as Response);

      expect(mockedTaskGroupService.getTaskGroupById).toHaveBeenCalledWith(userId, groupId);
      expect(res.json).toHaveBeenCalledWith(testGroup);
    });

    it('タスクグループが見つからない場合はエラーになる', async () => {
      req.params = { id: 'non-existent-id' };
      mockedTaskGroupService.getTaskGroupById.mockResolvedValue(null);

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
      const updates = {
        name: '更新されたテストグループ',
      };
      req.body = updates;

      const updatedGroup: DbTaskGroup = {
        ...testGroup!,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      mockedTaskGroupService.updateTaskGroup.mockResolvedValue(updatedGroup);

      await taskGroupController.updateTaskGroup(req as Request, res as Response);

      expect(mockedTaskGroupService.updateTaskGroup).toHaveBeenCalledWith(userId, groupId, updates);
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
      mockedTaskGroupService.deleteTaskGroup.mockResolvedValue(undefined);

      await taskGroupController.deleteTaskGroup(req as Request, res as Response);

      expect(mockedTaskGroupService.deleteTaskGroup).toHaveBeenCalledWith(userId, groupId);
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
      req.params = { id: groupId };
      const orderData = {
        newOrder: 1,
        projectId,
      };
      req.body = orderData;
      mockedTaskGroupService.updateTaskGroupOrder.mockResolvedValue(undefined);

      await taskGroupController.updateTaskGroupOrder(req as Request, res as Response);

      expect(mockedTaskGroupService.updateTaskGroupOrder).toHaveBeenCalledWith(
        userId,
        groupId,
        orderData.newOrder,
        projectId
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('無効なリクエストの場合はエラーになる', async () => {
      req.params = { id: groupId };
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
