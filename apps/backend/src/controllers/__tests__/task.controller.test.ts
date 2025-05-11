import { Request, Response } from 'express';
import { TaskController } from '../task.controller';
import { CreateTaskUseCase } from '../../use-cases/task/create-task.use-case';
import { UpdateTaskUseCase } from '../../use-cases/task/update-task.use-case';
import { DeleteTaskUseCase } from '../../use-cases/task/delete-task.use-case';
import { GetTaskUseCase } from '../../use-cases/task/get-task.use-case';

jest.mock('../../use-cases/task/create-task.use-case');
jest.mock('../../use-cases/task/update-task.use-case');
jest.mock('../../use-cases/task/delete-task.use-case');
jest.mock('../../use-cases/task/get-task.use-case');

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
    } as any;

    taskController = new TaskController(
      mockCreateTaskUseCase,
      mockUpdateTaskUseCase,
      mockDeleteTaskUseCase,
      mockGetTaskUseCase
    );

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('create', () => {
    const createTaskInput = {
      title: 'テストタスク',
      description: 'テストタスクの説明',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: new Date(),
      projectId: 'project-1',
    };

    const mockCreatedTask = {
      id: 'task-1',
      ...createTaskInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('タスクが正常に作成されること', async () => {
      mockRequest.body = createTaskInput;
      mockCreateTaskUseCase.execute.mockResolvedValue(mockCreatedTask);

      await taskController.create(mockRequest as Request, mockResponse as Response);

      expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith(createTaskInput);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedTask);
    });

    it('バリデーションエラーの場合、400エラーが返されること', async () => {
      mockRequest.body = { ...createTaskInput, title: '' };
      mockCreateTaskUseCase.execute.mockRejectedValue(new Error('バリデーションエラー'));

      await taskController.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'バリデーションエラー',
      });
    });
  });

  describe('update', () => {
    const taskId = 'task-1';
    const updateTaskInput = {
      title: '更新されたタスク',
      description: '更新されたタスクの説明',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date(),
    };

    const mockUpdatedTask = {
      id: taskId,
      ...updateTaskInput,
      projectId: 'project-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('タスクが正常に更新されること', async () => {
      mockRequest.params = { id: taskId };
      mockRequest.body = updateTaskInput;
      mockUpdateTaskUseCase.execute.mockResolvedValue(mockUpdatedTask);

      await taskController.update(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith(taskId, updateTaskInput);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

    it('タスクが存在しない場合、404エラーが返されること', async () => {
      mockRequest.params = { id: taskId };
      mockRequest.body = updateTaskInput;
      mockUpdateTaskUseCase.execute.mockRejectedValue(new Error('タスクが見つかりません'));

      await taskController.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'タスクが見つかりません',
      });
    });
  });

  describe('delete', () => {
    const taskId = 'task-1';

    it('タスクが正常に削除されること', async () => {
      mockRequest.params = { id: taskId };
      mockDeleteTaskUseCase.execute.mockResolvedValue(undefined);

      await taskController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledWith(taskId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('タスクが存在しない場合、404エラーが返されること', async () => {
      mockRequest.params = { id: taskId };
      mockDeleteTaskUseCase.execute.mockRejectedValue(new Error('タスクが見つかりません'));

      await taskController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'タスクが見つかりません',
      });
    });
  });

  describe('get', () => {
    const taskId = 'task-1';
    const mockTask = {
      id: taskId,
      title: 'テストタスク',
      description: 'テストタスクの説明',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: new Date(),
      projectId: 'project-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('タスクが正常に取得できること', async () => {
      mockRequest.params = { id: taskId };
      mockGetTaskUseCase.execute.mockResolvedValue(mockTask);

      await taskController.get(mockRequest as Request, mockResponse as Response);

      expect(mockGetTaskUseCase.execute).toHaveBeenCalledWith(taskId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('タスクが存在しない場合、404エラーが返されること', async () => {
      mockRequest.params = { id: taskId };
      mockGetTaskUseCase.execute.mockResolvedValue(null);

      await taskController.get(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'タスクが見つかりません',
      });
    });
  });
});
