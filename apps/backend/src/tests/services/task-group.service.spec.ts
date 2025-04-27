import { TaskGroupService } from '../../services/task-group.service';
import {
  createTestUser,
  deleteTestUser,
  createTestProject,
  deleteTestProject,
  createTestTaskGroup,
  deleteTestTaskGroup,
} from '../utils/test-utils';

describe('TaskGroupService', () => {
  let taskGroupService: TaskGroupService;
  let testUser: { user: any; email: string; password: string };
  let testProject: any;
  let testTaskGroup: any;

  beforeAll(async () => {
    taskGroupService = new TaskGroupService();
    testUser = await createTestUser();
    testProject = await createTestProject(testUser.user.id);
  });

  afterAll(async () => {
    if (testTaskGroup) await deleteTestTaskGroup(testTaskGroup.id);
    if (testProject) await deleteTestProject(testProject.id);
    if (testUser) await deleteTestUser(testUser.user.id);
  });

  describe('createTaskGroup', () => {
    it('新しいタスクグループを作成できること', async () => {
      const groupData = {
        title: 'テストタスクグループ',
        description: 'テスト用のタスクグループです',
        project_id: testProject.id,
      };

      const group = await taskGroupService.createTaskGroup(testUser.user.id, groupData);
      testTaskGroup = group;

      expect(group).toHaveProperty('id');
      expect(group.title).toBe(groupData.title);
      expect(group.description).toBe(groupData.description);
      expect(group.project_id).toBe(testProject.id);
      expect(group.user_id).toBe(testUser.user.id);
    });
  });

  describe('getTaskGroupsByProject', () => {
    it('プロジェクト内のタスクグループ一覧を取得できること', async () => {
      const groups = await taskGroupService.getTaskGroupsByProject(
        testUser.user.id,
        testProject.id
      );

      expect(Array.isArray(groups)).toBe(true);
      expect(groups.length).toBeGreaterThan(0);
      expect(groups[0].project_id).toBe(testProject.id);
    });
  });

  describe('getTaskGroupById', () => {
    it('特定のタスクグループを取得できること', async () => {
      const group = await taskGroupService.getTaskGroupById(testUser.user.id, testTaskGroup.id);

      expect(group).not.toBeNull();
      expect(group?.id).toBe(testTaskGroup.id);
      expect(group?.title).toBe(testTaskGroup.title);
    });

    it('存在しないタスクグループの場合はnullを返すこと', async () => {
      const group = await taskGroupService.getTaskGroupById(testUser.user.id, 'non-existent-id');
      expect(group).toBeNull();
    });
  });

  describe('updateTaskGroup', () => {
    it('タスクグループを更新できること', async () => {
      const updates = {
        title: '更新されたタスクグループ',
        description: '更新された説明',
      };

      const updatedGroup = await taskGroupService.updateTaskGroup(
        testUser.user.id,
        testTaskGroup.id,
        updates
      );

      expect(updatedGroup.title).toBe(updates.title);
      expect(updatedGroup.description).toBe(updates.description);
    });

    it('存在しないタスクグループの更新はエラーを投げること', async () => {
      const updates = {
        title: '更新されたタスクグループ',
      };

      await expect(
        taskGroupService.updateTaskGroup(testUser.user.id, 'non-existent-id', updates)
      ).rejects.toThrow();
    });
  });

  describe('deleteTaskGroup', () => {
    it('タスクグループを削除できること', async () => {
      await expect(
        taskGroupService.deleteTaskGroup(testUser.user.id, testTaskGroup.id)
      ).resolves.not.toThrow();

      // 削除後は取得できないことを確認
      const group = await taskGroupService.getTaskGroupById(testUser.user.id, testTaskGroup.id);
      expect(group).toBeNull();
    });

    it('存在しないタスクグループの削除はエラーを投げること', async () => {
      await expect(
        taskGroupService.deleteTaskGroup(testUser.user.id, 'non-existent-id')
      ).rejects.toThrow();
    });
  });

  describe('updateTaskGroupOrder', () => {
    it('タスクグループの順序を更新できること', async () => {
      // 新しいタスクグループを作成
      const newGroup = await createTestTaskGroup(testUser.user.id, testProject.id);

      await expect(
        taskGroupService.updateTaskGroupOrder(testUser.user.id, newGroup.id, 1, testProject.id)
      ).resolves.not.toThrow();

      // クリーンアップ
      await deleteTestTaskGroup(newGroup.id);
    });
  });
});
