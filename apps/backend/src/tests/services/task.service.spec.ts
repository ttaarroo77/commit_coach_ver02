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
import { Task, TaskPriority, TaskStatus } from '../../types/task.types';
import { ApiError } from '../../middleware/errorHandler';

// データベースから返される Task の型 (仮)
// 必要に応じて Prisma の型などを使用する
interface DbTask extends Task {
  id: string;
  user_id: string;
  created_at: string; // or Date
  updated_at: string; // or Date
}

describe('TaskService', () => {
  let taskService: TaskService;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let taskId: string;
  let testTask: DbTask | undefined;

  beforeAll(async () => {
    taskService = new TaskService();
    const user = await createTestUser();
    userId = user.id;
    const project = await createTestProject(userId);
    projectId = project.id;
    const group = await createTestTaskGroup(userId, projectId);
    groupId = group.id;
  });

  afterAll(async () => {
    if (taskId) await deleteTestTask(taskId);
    if (groupId) await deleteTestTaskGroup(groupId);
    if (projectId) await deleteTestProject(projectId);
    if (userId) await deleteTestUser(userId);
  });

  beforeEach(async () => {
    testTask = await createTestTask(userId, projectId, groupId) as DbTask;
    taskId = testTask.id;
  });

  afterEach(async () => {
    if (taskId) {
      await deleteTestTask(taskId);
      taskId = undefined as any;
      testTask = undefined;
    }
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
        order: 1,
      };

      const task = await taskService.createTask(userId, taskData) as DbTask;
      expect(task).toHaveProperty('id');
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.priority).toBe(taskData.priority);
      expect(task.status).toBe(taskData.status);
      expect(task.user_id).toBe(userId);

      await deleteTestTask(task.id);
    });

    it('存在しないプロジェクトIDでタスクを作成しようとするとエラーになる', async () => {
      const taskData = {
        title: 'テストタスク',
        description: 'テスト用のタスクです',
        project_id: 'non-existent-project-id',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        order: 0,
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
        order: 0,
      };

      await expect(taskService.createTask(userId, taskData)).rejects.toThrow(ApiError);
    });
  });

  describe('getTasksByProject', () => {
    it('プロジェクトのタスク一覧を取得できる', async () => {
      const tasks = await taskService.getTasksByProject(userId, projectId) as DbTask[];
      expect(tasks).toBeInstanceOf(Array);
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0].id).toBe(taskId);
      expect(tasks[0].title).toBe(testTask?.title);
    });

    it('存在しないプロジェクトIDでタスク一覧を取得しようとするとエラーになる', async () => {
      await expect(
        taskService.getTasksByProject(userId, 'non-existent-project-id')
      ).rejects.toThrow(ApiError);
    });
  });

  describe('getTasksByGroup', () => {
    it('グループのタスク一覧を取得できる', async () => {
      const tasks = await taskService.getTasksByGroup(userId, groupId) as DbTask[];
      expect(tasks).toBeInstanceOf(Array);
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0].id).toBe(taskId);
      expect(tasks[0].title).toBe(testTask?.title);
    });

    it('存在しないグループIDでタスク一覧を取得しようとするとエラーになる', async () => {
      await expect(taskService.getTasksByGroup(userId, 'non-existent-group-id')).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('getTaskById', () => {
    it('タスクの詳細を取得できる', async () => {
      const task = await taskService.getTaskById(userId, taskId) as DbTask;
      expect(task).not.toBeNull();
      expect(task?.id).toBe(taskId);
      expect(task?.title).toBe(testTask?.title);
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

      const task = await taskService.updateTask(userId, taskId, updates) as DbTask;
      expect(task).toMatchObject(updates);
      expect(task.id).toBe(taskId);
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
      const newTask = await createTestTask(userId, projectId, groupId) as DbTask;
      const newTaskId = newTask.id;
      await taskService.deleteTask(userId, newTaskId);
      const task = await taskService.getTaskById(userId, newTaskId);
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

      const updatedTask = await taskService.getTaskById(userId, taskId) as DbTask;
      expect(updatedTask?.order).toBe(1);
    });

    it('存在しないタスクIDで順序を更新しようとするとエラーになる', async () => {
      await expect(
        taskService.updateTaskOrder(userId, 'non-existent-task-id', 1, projectId, groupId)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('getSubtasks', () => {
    it('サブタスクを取得できる', async () => {
      const parentTask = await createTestTask(userId, projectId, groupId) as DbTask;
      const subtask = await createTestTask(userId, projectId, groupId, parentTask.id) as DbTask;

      const subtasks = await taskService.getSubtasks(userId, parentTask.id) as DbTask[];
      expect(subtasks).toBeInstanceOf(Array);
      expect(subtasks.length).toBe(1);
      expect(subtasks[0].id).toBe(subtask.id);
      expect(subtasks[0].parent_id).toBe(parentTask.id);

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
      const task = await taskService.updateTaskStatus(userId, taskId, TaskStatus.DONE) as DbTask;
      expect(task.status).toBe(TaskStatus.DONE);
      expect(task.id).toBe(taskId);
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
      const task = await taskService.updateTaskDueDate(userId, taskId, newDueDate) as DbTask;
      expect(new Date(task.due_date as string).toISOString()).toBe(newDueDate);
      expect(task.id).toBe(taskId);
    });

    it('存在しないタスクIDで期限を更新しようとするとエラーになる', async () => {
      await expect(
        taskService.updateTaskDueDate(userId, 'non-existent-task-id', new Date().toISOString())
      ).rejects.toThrow(ApiError);
    });
  });
});
