import { TaskService } from '../../services/task.service';
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
import { TaskPriority, TaskStatus } from '../../types/task.types';
import { ApiError } from '../../middleware/error.middleware';

describe('TaskService', () => {
  let taskService: TaskService;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let taskId: string;

  beforeAll(async () => {
    taskService = new TaskService();
    const user = await createTestUser();
    userId = user.id;
    const project = await createTestProject(userId);
    projectId = project.id;
    const group = await createTestTaskGroup(userId, projectId);
    groupId = group.id;
    const task = await createTestTask(userId, projectId, groupId);
    taskId = task.id;
  });

  afterAll(async () => {
    await deleteTestTask(taskId);
    await deleteTestTaskGroup(groupId);
    await deleteTestProject(projectId);
    await deleteTestUser(userId);
  });

  describe('createTask', () => {
    it('新しいタスクを作成できる', async () => {
      const taskData = {
        title: 'テストタスク2',
        description: 'テスト用のタスク2です',
        project_id: projectId,
        group_id: groupId,
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        due_date: new Date().toISOString(),
      };

      const task = await taskService.createTask(userId, taskData);
      expect(task).toMatchObject(taskData);
      await deleteTestTask(task.id);
    });

    it('存在しないプロジェクトIDでタスクを作成しようとするとエラーになる', async () => {
      const taskData = {
        title: 'テストタスク',
        description: 'テスト用のタスクです',
        project_id: 'non-existent-project-id',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
      };

      await expect(taskService.createTask(userId, taskData)).rejects.toThrow(ApiError);
    });

    it('存在しないグループIDでタスクを作成しようとするとエラーになる', async () => {
      const taskData = {
        title: 'テストタスク',
        description: 'テスト用のタスクです',
        project_id: projectId,
        group_id: 'non-existent-group-id',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
      };

      await expect(taskService.createTask(userId, taskData)).rejects.toThrow(ApiError);
    });
  });

  describe('getTasksByProject', () => {
    it('プロジェクトのタスク一覧を取得できる', async () => {
      const tasks = await taskService.getTasksByProject(userId, projectId);
      expect(tasks).toBeInstanceOf(Array);
      expect(tasks[0]).toHaveProperty('id');
      expect(tasks[0]).toHaveProperty('title');
    });

    it('存在しないプロジェクトIDでタスク一覧を取得しようとするとエラーになる', async () => {
      await expect(
        taskService.getTasksByProject(userId, 'non-existent-project-id')
      ).rejects.toThrow(ApiError);
    });
  });

  describe('getTasksByGroup', () => {
    it('グループのタスク一覧を取得できる', async () => {
      const tasks = await taskService.getTasksByGroup(userId, groupId);
      expect(tasks).toBeInstanceOf(Array);
      expect(tasks[0]).toHaveProperty('id');
      expect(tasks[0]).toHaveProperty('title');
    });

    it('存在しないグループIDでタスク一覧を取得しようとするとエラーになる', async () => {
      await expect(taskService.getTasksByGroup(userId, 'non-existent-group-id')).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('getTaskById', () => {
    it('タスクの詳細を取得できる', async () => {
      const task = await taskService.getTaskById(userId, taskId);
      expect(task).not.toBeNull();
      expect(task?.id).toBe(taskId);
    });

    it('存在しないタスクIDで詳細を取得しようとするとnullを返す', async () => {
      const task = await taskService.getTaskById(userId, 'non-existent-task-id');
      expect(task).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('タスクを更新できる', async () => {
      const updates = {
        title: '更新されたテストタスク',
        description: '更新されたテスト用のタスクです',
        priority: TaskPriority.HIGH,
      };

      const task = await taskService.updateTask(userId, taskId, updates);
      expect(task).toMatchObject(updates);
    });

    it('存在しないタスクIDで更新しようとするとエラーになる', async () => {
      const updates = {
        title: '更新されたテストタスク',
      };

      await expect(taskService.updateTask(userId, 'non-existent-task-id', updates)).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('deleteTask', () => {
    it('タスクを削除できる', async () => {
      const newTask = await createTestTask(userId, projectId, groupId);
      await taskService.deleteTask(userId, newTask.id);
      const task = await taskService.getTaskById(userId, newTask.id);
      expect(task).toBeNull();
    });

    it('存在しないタスクIDで削除しようとするとエラーになる', async () => {
      await expect(taskService.deleteTask(userId, 'non-existent-task-id')).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('updateTaskOrder', () => {
    it('タスクの順序を更新できる', async () => {
      await expect(
        taskService.updateTaskOrder(userId, taskId, 1, projectId, groupId)
      ).resolves.not.toThrow();
    });

    it('存在しないタスクIDで順序を更新しようとするとエラーになる', async () => {
      await expect(
        taskService.updateTaskOrder(userId, 'non-existent-task-id', 1, projectId, groupId)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('getSubtasks', () => {
    it('サブタスクを取得できる', async () => {
      const parentTask = await createTestTask(userId, projectId, groupId);
      const subtask = await createTestTask(userId, projectId, groupId, parentTask.id);

      const subtasks = await taskService.getSubtasks(userId, parentTask.id);
      expect(subtasks).toBeInstanceOf(Array);
      expect(subtasks[0].id).toBe(subtask.id);

      await deleteTestTask(subtask.id);
      await deleteTestTask(parentTask.id);
    });

    it('存在しない親タスクIDでサブタスクを取得しようとするとエラーになる', async () => {
      await expect(taskService.getSubtasks(userId, 'non-existent-parent-id')).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('タスクのステータスを更新できる', async () => {
      const task = await taskService.updateTaskStatus(userId, taskId, TaskStatus.DONE);
      expect(task.status).toBe(TaskStatus.DONE);
    });

    it('存在しないタスクIDでステータスを更新しようとするとエラーになる', async () => {
      await expect(
        taskService.updateTaskStatus(userId, 'non-existent-task-id', TaskStatus.DONE)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('updateTaskDueDate', () => {
    it('タスクの期限を更新できる', async () => {
      const newDueDate = new Date().toISOString();
      const task = await taskService.updateTaskDueDate(userId, taskId, newDueDate);
      expect(task.due_date).toBe(newDueDate);
    });

    it('存在しないタスクIDで期限を更新しようとするとエラーになる', async () => {
      await expect(
        taskService.updateTaskDueDate(userId, 'non-existent-task-id', new Date().toISOString())
      ).rejects.toThrow(ApiError);
    });
  });
});
