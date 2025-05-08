import { Request, Response } from 'express';
import { TaskController } from '../task.controller';
import { CreateTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase, GetTaskUseCase } from '@commit-coach/domain/usecases/task';
import { Task, TaskStatus, TaskPriority } from '@commit-coach/domain/entities/task';

describe('TaskController', () => {
  let taskController: TaskController;
  let mockCreateTaskUseCase: jest.Mocked<CreateTaskUseCase>;
  let mockUpdateTaskUseCase: jest.Mocked<UpdateTaskUseCase>;
  let mockDeleteTaskUseCase: jest.Mocked<DeleteTaskUseCase>;
  let mockGetTaskUseCase: jest.Mocked<GetTaskUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockCreateTaskUseCase = {
      execute: jest.fn(),
    } as any;

    mockUpdateTaskUseCase = {
      execute: jest.fn(),
    } as any;

    mockDeleteTaskUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetTaskUseCase = {
      execute: jest.fn(),
      executeAll: jest.fn(),
      executeByProjectId: jest.fn(),
      executeWithProject: jest.fn(),
      executeUpdateStatus: jest.fn(),
      executeUpdatePriority: jest.fn(),
    } as any;

    taskController = new TaskController(
      mockCreateTaskUseCase,
      mockUpdateTaskUseCase,
      mockDeleteTaskUseCase,
      mockGetTaskUseCase,
    );

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('create', () => {
    it('タスクを作成できること', async () => {
      const mockTask: Task = {
        id: '1',
        title: 'テストタスク',
        description: 'テスト説明',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        projectId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        title: 'テストタスク',
        description: 'テスト説明',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        projectId: '1',
      };

      mockCreateTaskUseCase.execute.mockResolvedValue(mockTask);

      await taskController.create(mockRequest as Request, mockResponse as Response);

      expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.body = {};
      mockCreateTaskUseCase.execute.mockRejectedValue(new Error('バリデーションエラー'));

      await taskController.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'バリデーションエラー' });
    });
  });

  describe('update', () => {
    it('タスクを更新できること', async () => {
      const mockTask: Task = {
        id: '1',
        title: '更新されたタスク',
        description: '更新された説明',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        projectId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = {
        title: '更新されたタスク',
        description: '更新された説明',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      };

      mockUpdateTaskUseCase.execute.mockResolvedValue(mockTask);

      await taskController.update(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith('1', mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {};
      mockUpdateTaskUseCase.execute.mockRejectedValue(new Error('更新エラー'));

      await taskController.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '更新エラー' });
    });
  });

  describe('delete', () => {
    it('タスクを削除できること', async () => {
      mockRequest.params = { id: '1' };
      mockDeleteTaskUseCase.execute.mockResolvedValue();

      await taskController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockDeleteTaskUseCase.execute.mockRejectedValue(new Error('削除エラー'));

      await taskController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '削除エラー' });
    });
  });

  describe('get', () => {
    it('タスクを取得できること', async () => {
      const mockTask: Task = {
        id: '1',
        title: 'テストタスク',
        description: 'テスト説明',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        projectId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: '1' };
      mockGetTaskUseCase.execute.mockResolvedValue(mockTask);

      await taskController.get(mockRequest as Request, mockResponse as Response);

      expect(mockGetTaskUseCase.execute).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('タスクが見つからない場合に404を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockGetTaskUseCase.execute.mockRejectedValue(new Error('タスクが見つかりません'));

      await taskController.get(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'タスクが見つかりません' });
    });
  });
});
