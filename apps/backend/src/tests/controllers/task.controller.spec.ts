import { Request, Response } from 'express';
import { TaskController } from '../../controllers/task.controller';
import { TaskService } from '../../services/task.service';
import { TaskPriority, TaskStatus } from '../../types/task.types';
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

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: jest.Mocked<TaskService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userId: string;
  let projectId: string;
  let groupId: string;
  let taskId: string;

  beforeAll(async () => {
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

  beforeEach(() => {
    taskService = new TaskService() as jest.Mocked<TaskService>;
    taskController = new TaskController();
    (taskController as any).taskService = taskService;

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
      };

      req.body = taskData;
      const createdTask = { ...taskData, id: taskId, user_id: userId };
      taskService.createTask.mockResolvedValue(createdTask);

      await taskController.createTask(req as Request, res as Response);

      expect(taskService.createTask).toHaveBeenCalledWith(userId, taskData);
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
      const tasks = [
        {
          id: taskId,
          title: 'テストタスク',
          project_id: projectId,
          user_id: userId,
        },
      ];
      taskService.getTasksByProject.mockResolvedValue(tasks);

      await taskController.getTasksByProject(req as Request, res as Response);

      expect(taskService.getTasksByProject).toHaveBeenCalledWith(userId, projectId);
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
      const tasks = [
        {
          id: taskId,
          title: 'テストタスク',
          group_id: groupId,
          user_id: userId,
        },
      ];
      taskService.getTasksByGroup.mockResolvedValue(tasks);

      await taskController.getTasksByGroup(req as Request, res as Response);

      expect(taskService.getTasksByGroup).toHaveBeenCalledWith(userId, groupId);
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
      const task = {
        id: taskId,
        title: 'テストタスク',
        user_id: userId,
      };
      taskService.getTaskById.mockResolvedValue(task);

      await taskController.getTaskById(req as Request, res as Response);

      expect(taskService.getTaskById).toHaveBeenCalledWith(userId, taskId);
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it('タスクが見つからない場合はエラーになる', async () => {
      req.params = { id: 'non-existent-id' };
      taskService.getTaskById.mockResolvedValue(null);

      await expect(taskController.getTaskById(req as Request, res as Response)).rejects.toThrow(
        'タスクが見つかりません'
      );
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
      req.body = {
        title: '更新されたテストタスク',
        description: '更新されたテスト用のタスクです',
      };
      const updatedTask = {
        id: taskId,
        ...req.body,
        user_id: userId,
      };
      taskService.updateTask.mockResolvedValue(updatedTask);

      await taskController.updateTask(req as Request, res as Response);

      expect(taskService.updateTask).toHaveBeenCalledWith(userId, taskId, req.body);
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

      await taskController.deleteTask(req as Request, res as Response);

      expect(taskService.deleteTask).toHaveBeenCalledWith(userId, taskId);
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
      req.body = {
        newOrder: 1,
        projectId,
        groupId,
      };

      await taskController.updateTaskOrder(req as Request, res as Response);

      expect(taskService.updateTaskOrder).toHaveBeenCalledWith(
        userId,
        taskId,
        req.body.newOrder,
        projectId,
        groupId
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('無効なリクエストの場合はエラーになる', async () => {
      req.params = { id: taskId };
      req.body = {};

      await expect(taskController.updateTaskOrder(req as Request, res as Response)).rejects.toThrow(
        '無効なリクエストです'
      );
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
      const subtasks = [
        {
          id: 'subtask-id',
          title: 'サブタスク',
          parent_id: taskId,
          user_id: userId,
        },
      ];
      taskService.getSubtasks.mockResolvedValue(subtasks);

      await taskController.getSubtasks(req as Request, res as Response);

      expect(taskService.getSubtasks).toHaveBeenCalledWith(userId, taskId);
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
      req.body = { status: TaskStatus.DONE };
      const updatedTask = {
        id: taskId,
        status: TaskStatus.DONE,
        user_id: userId,
      };
      taskService.updateTaskStatus.mockResolvedValue(updatedTask);

      await taskController.updateTaskStatus(req as Request, res as Response);

      expect(taskService.updateTaskStatus).toHaveBeenCalledWith(userId, taskId, TaskStatus.DONE);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('無効なステータスの場合はエラーになる', async () => {
      req.params = { id: taskId };
      req.body = { status: 'INVALID_STATUS' };

      await expect(
        taskController.updateTaskStatus(req as Request, res as Response)
      ).rejects.toThrow('無効なステータスです');
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
      req.body = { dueDate };
      const updatedTask = {
        id: taskId,
        due_date: dueDate,
        user_id: userId,
      };
      taskService.updateTaskDueDate.mockResolvedValue(updatedTask);

      await taskController.updateTaskDueDate(req as Request, res as Response);

      expect(taskService.updateTaskDueDate).toHaveBeenCalledWith(userId, taskId, dueDate);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('無効な期限の場合はエラーになる', async () => {
      req.params = { id: taskId };
      req.body = { dueDate: 'invalid-date' };

      await expect(
        taskController.updateTaskDueDate(req as Request, res as Response)
      ).rejects.toThrow('無効な期限です');
    });

    it('認証されていない場合はエラーになる', async () => {
      req.user = undefined;

      await expect(
        taskController.updateTaskDueDate(req as Request, res as Response)
      ).rejects.toThrow('認証が必要です');
    });
  });
});
