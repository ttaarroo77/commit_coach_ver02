import { Request, Response } from 'express';
import { TaskController } from '../../controllers/task.controller';
import { taskService } from '../../services/task.service';
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

// データベースから返される Task の型 (仮)
interface DbTask extends Task {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

describe('TaskController', () => {
  let taskController: TaskController;
  let mockedTaskService: jest.Mocked<typeof taskService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let taskId: string;
  let testTask: DbTask | undefined;

  beforeAll(async () => {
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
    mockedTaskService = taskService as jest.Mocked<typeof taskService>;
    taskController = new TaskController();
    (taskController as any).taskService = mockedTaskService;

    testTask = await createTestTask(userId, projectId, groupId) as DbTask;
    taskId = testTask.id;

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
    if (taskId) {
      await deleteTestTask(taskId);
      taskId = undefined as any;
      testTask = undefined;
    }
  });

  describe('createTask', () => {
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
      req.body = taskData;

      const createdTask: DbTask = {
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

      await taskController.createTask(req as Request, res as Response);

      expect(mockedTaskService.createTask).toHaveBeenCalledWith(userId, taskData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(taskController.createTask(req as Request, res as Response)).rejects.toThrow(
        '認証が必要です'
      );
    });
  });

  describe('getTasksByProject', () => {
    it('プロジェクトのタスク一覧を取得できる', async () => {
      req.params = { projectId };
      const tasks: DbTask[] = [testTask!];
      mockedTaskService.getTasksByProject.mockResolvedValue(tasks);

      await taskController.getTasksByProject(req as Request, res as Response);

      expect(mockedTaskService.getTasksByProject).toHaveBeenCalledWith(userId, projectId);
      expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskController.getTasksByProject(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });

  describe('getTasksByGroup', () => {
    it('グループのタスク一覧を取得できる', async () => {
      req.params = { groupId };
      const tasks: DbTask[] = [testTask!];
      mockedTaskService.getTasksByGroup.mockResolvedValue(tasks);

      await taskController.getTasksByGroup(req as Request, res as Response);

      expect(mockedTaskService.getTasksByGroup).toHaveBeenCalledWith(userId, groupId);
      expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(taskController.getTasksByGroup(req as Request, res as Response)).rejects.toThrow(
        '認証が必要です'
      );
    });
  });

  describe('getTaskById', () => {
    it('タスクの詳細を取得できる', async () => {
      req.params = { id: taskId };
      mockedTaskService.getTaskById.mockResolvedValue(testTask!);

      await taskController.getTaskById(req as Request, res as Response);

      expect(mockedTaskService.getTaskById).toHaveBeenCalledWith(userId, taskId);
      expect(res.json).toHaveBeenCalledWith(testTask);
    });

    it('タスクが見つからない場合はエラーになる', async () => {
      req.params = { id: 'non-existent-id' };
      mockedTaskService.getTaskById.mockResolvedValue(null);

      await expect(
        taskController.getTaskById(req as Request, res as Response)
      ).rejects.toThrow('タスクが見つかりません');
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(taskController.getTaskById(req as Request, res as Response)).rejects.toThrow(
        '認証が必要です'
      );
    });
  });

  describe('updateTask', () => {
    it('タスクを更新できる', async () => {
      req.params = { id: taskId };
      const updates = {
        title: '更新されたテストタスク',
        status: TaskStatus.IN_PROGRESS,
      };
      req.body = updates;

      const updatedTask: DbTask = {
        ...testTask!,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      mockedTaskService.updateTask.mockResolvedValue(updatedTask);

      await taskController.updateTask(req as Request, res as Response);

      expect(mockedTaskService.updateTask).toHaveBeenCalledWith(userId, taskId, updates);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(taskController.updateTask(req as Request, res as Response)).rejects.toThrow(
        '認証が必要です'
      );
    });
  });

  describe('deleteTask', () => {
    it('タスクを削除できる', async () => {
      req.params = { id: taskId };
      mockedTaskService.deleteTask.mockResolvedValue(undefined);

      await taskController.deleteTask(req as Request, res as Response);

      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith(userId, taskId);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(taskController.deleteTask(req as Request, res as Response)).rejects.toThrow(
        '認証が必要です'
      );
    });
  });

  describe('updateTaskOrder', () => {
    it('タスクの順序を更新できる', async () => {
      req.params = { id: taskId };
      const orderData = {
        newOrder: 1,
        projectId,
        groupId,
      };
      req.body = orderData;
      mockedTaskService.updateTaskOrder.mockResolvedValue(undefined);

      await taskController.updateTaskOrder(req as Request, res as Response);

      expect(mockedTaskService.updateTaskOrder).toHaveBeenCalledWith(
        userId,
        taskId,
        orderData.newOrder,
        projectId,
        groupId
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('無効なリクエストの場合はエラーになる', async () => {
      req.params = { id: taskId };
      req.body = {};

      await expect(
        taskController.updateTaskOrder(req as Request, res as Response)
      ).rejects.toThrow('無効なリクエストです');
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(taskController.updateTaskOrder(req as Request, res as Response)).rejects.toThrow(
        '認証が必要です'
      );
    });
  });

  describe('getSubtasks', () => {
    it('サブタスクを取得できる', async () => {
      req.params = { parentId: taskId };
      const subtasks: DbTask[] = [];
      mockedTaskService.getSubtasks.mockResolvedValue(subtasks);

      await taskController.getSubtasks(req as Request, res as Response);

      expect(mockedTaskService.getSubtasks).toHaveBeenCalledWith(userId, taskId);
      expect(res.json).toHaveBeenCalledWith(subtasks);
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(taskController.getSubtasks(req as Request, res as Response)).rejects.toThrow(
        '認証が必要です'
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('タスクのステータスを更新できる', async () => {
      req.params = { id: taskId };
      const statusData = { status: TaskStatus.DONE };
      req.body = statusData;

      const updatedTask: DbTask = {
        ...testTask!,
        status: TaskStatus.DONE,
        updated_at: new Date().toISOString(),
      };
      mockedTaskService.updateTaskStatus.mockResolvedValue(updatedTask);

      await taskController.updateTaskStatus(req as Request, res as Response);

      expect(mockedTaskService.updateTaskStatus).toHaveBeenCalledWith(userId, taskId, TaskStatus.DONE);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('無効なステータスの場合はエラーになる', async () => {
      req.params = { id: taskId };
      req.body = { status: 'INVALID_STATUS' };

      await expect(
        taskController.updateTaskStatus(req as Request, res as Response)
      ).rejects.toThrow();
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskController.updateTaskStatus(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });

  describe('updateTaskDueDate', () => {
    it('タスクの期限を更新できる', async () => {
      req.params = { id: taskId };
      const dueDate = new Date().toISOString();
      const dueDateData = { dueDate };
      req.body = dueDateData;

      const updatedTask: DbTask = {
        ...testTask!,
        due_date: dueDateData.dueDate,
        updated_at: new Date().toISOString(),
      };
      mockedTaskService.updateTaskDueDate.mockResolvedValue(updatedTask);

      await taskController.updateTaskDueDate(req as Request, res as Response);

      expect(mockedTaskService.updateTaskDueDate).toHaveBeenCalledWith(userId, taskId, dueDateData.dueDate);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('無効な日付形式の場合はエラーになる', async () => {
      req.params = { id: taskId };
      req.body = { dueDate: 'invalid-date' };

      await expect(
        taskController.updateTaskDueDate(req as Request, res as Response)
      ).rejects.toThrow();
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskController.updateTaskDueDate(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });
});
