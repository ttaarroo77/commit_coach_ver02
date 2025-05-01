import { TaskGroupService } from '../../services/task-group.service';
import { ApiError } from '../../middleware/errorHandler';
import {
  createTestUser,
  deleteTestUser,
  createTestProject,
  deleteTestProject,
  createTestTaskGroup,
  deleteTestTaskGroup,
} from '../utils/test-utils';
import { TaskGroup } from '../../types/task-group.types';

// データベースから返される TaskGroup の型 (仮)
// 必要に応じて Prisma の型などを使用する
interface DbTaskGroup extends TaskGroup {
  id: string;
  user_id: string;
  created_at: string; // or Date
  updated_at: string; // or Date
}

describe('TaskGroupService', () => {
  let taskGroupService: TaskGroupService;
  let testUser: any;
  let testProject: any;
  let testTaskGroup: DbTaskGroup | undefined; // データベースから返される型を使用し、undefinedを許容

  beforeAll(async () => {
    taskGroupService = new TaskGroupService();
    testUser = await createTestUser();
    testProject = await createTestProject(testUser.id);
  });

  afterAll(async () => {
    if (testTaskGroup) await deleteTestTaskGroup(testTaskGroup.id);
    if (testProject) await deleteTestProject(testProject.id);
    if (testUser) await deleteTestUser(testUser.id);
  });

  afterEach(async () => {
    if (testTaskGroup) {
      await deleteTestTaskGroup(testTaskGroup.id);
      testTaskGroup = undefined;
    }
  });

  describe('createTaskGroup', () => {
    it('新しいタスクグループを作成できること', async () => {
      const groupData = {
        title: 'テストタスクグループ',
        description: 'テスト用のタスクグループです',
        project_id: testProject.id,
        order: 0, // order を追加
      };

      const group = await taskGroupService.createTaskGroup(testUser.id, groupData) as DbTaskGroup;
      testTaskGroup = group;

      expect(group).toHaveProperty('id');
      expect(group.title).toBe(groupData.title);
      expect(group.description).toBe(groupData.description);
      expect(group.project_id).toBe(testProject.id);
      expect(group.user_id).toBe(testUser.id);
      expect(group.order).toBe(groupData.order);
    });
  });

  describe('getTaskGroupsByProject', () => {
    beforeEach(async () => {
      testTaskGroup = await createTestTaskGroup(testUser.id, testProject.id) as DbTaskGroup;
    });

    it('プロジェクト内のタスクグループ一覧を取得できること', async () => {
      const groups = await taskGroupService.getTaskGroupsByProject(
        testUser.id,
        testProject.id
      ) as DbTaskGroup[];

      expect(Array.isArray(groups)).toBe(true);
      expect(groups.length).toBeGreaterThan(0);
      expect(groups[0].project_id).toBe(testProject.id);
      expect(groups[0].id).toBe(testTaskGroup?.id);
      expect(groups[0].user_id).toBeDefined();
    });
  });

  describe('getTaskGroupById', () => {
    beforeEach(async () => {
      testTaskGroup = await createTestTaskGroup(testUser.id, testProject.id) as DbTaskGroup;
    });

    it('特定のタスクグループを取得できること', async () => {
      const group = await taskGroupService.getTaskGroupById(testUser.id, testTaskGroup!.id);

      expect(group).not.toBeNull();
      expect(group?.id).toBe(testTaskGroup?.id);
      expect(group?.title).toBe(testTaskGroup?.title);
      expect(group?.user_id).toBe(testUser.id);
    });

    it('存在しないタスクグループの場合はnullを返すこと', async () => {
      const group = await taskGroupService.getTaskGroupById(testUser.id, 'non-existent-id');
      expect(group).toBeNull();
    });
  });

  describe('updateTaskGroup', () => {
    beforeEach(async () => {
      testTaskGroup = await createTestTaskGroup(testUser.id, testProject.id) as DbTaskGroup;
    });

    it('タスクグループを更新できること', async () => {
      const updates = {
        title: '更新されたタスクグループ',
        description: '更新された説明',
      };

      const updatedGroup = await taskGroupService.updateTaskGroup(
        testUser.id,
        testTaskGroup!.id,
        updates
      ) as DbTaskGroup;

      expect(updatedGroup.title).toBe(updates.title);
      expect(updatedGroup.description).toBe(updates.description);
      expect(updatedGroup.id).toBe(testTaskGroup?.id);
      expect(updatedGroup.user_id).toBe(testUser.id);
    });

    it('存在しないタスクグループの更新はエラーを投げること', async () => {
      const updates = {
        title: '更新されたタスクグループ',
      };

      await expect(
        taskGroupService.updateTaskGroup(testUser.id, 'non-existent-id', updates)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('deleteTaskGroup', () => {
    beforeEach(async () => {
      testTaskGroup = await createTestTaskGroup(testUser.id, testProject.id) as DbTaskGroup;
    });

    it('タスクグループを削除できること', async () => {
      const groupIdToDelete = testTaskGroup!.id;
      await expect(
        taskGroupService.deleteTaskGroup(testUser.id, groupIdToDelete)
      ).resolves.not.toThrow();

      const group = await taskGroupService.getTaskGroupById(testUser.id, groupIdToDelete);
      expect(group).toBeNull();
      testTaskGroup = undefined;
    });

    it('存在しないタスクグループの削除はエラーを投げること', async () => {
      await expect(
        taskGroupService.deleteTaskGroup(testUser.id, 'non-existent-id')
      ).rejects.toThrow(ApiError);
    });
  });

  describe('updateTaskGroupOrder', () => {
    it('タスクグループの順序を更新できること', async () => {
      const newGroup = await createTestTaskGroup(testUser.id, testProject.id) as DbTaskGroup;
      testTaskGroup = newGroup;
      const newGroupId = newGroup.id;

      await expect(
        taskGroupService.updateTaskGroupOrder(testUser.id, newGroupId, 1, testProject.id)
      ).resolves.not.toThrow();

      const updatedGroup = await taskGroupService.getTaskGroupById(testUser.id, newGroupId);
      expect(updatedGroup?.order).toBe(1);
    });

    it('存在しないタスクグループの順序更新はエラーを投げること', async () => {
      await expect(
        taskGroupService.updateTaskGroupOrder(testUser.id, 'non-existent-id', 1, testProject.id)
      ).rejects.toThrow(ApiError);
    });
  });
});
