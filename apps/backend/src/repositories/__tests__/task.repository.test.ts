import { TaskRepository } from '../task.repository';
import { PrismaClient } from '@prisma/client';
import { Task } from '@commit-coach/domain';

jest.mock('@prisma/client');

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let mockPrismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrismaClient = {
      task: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;

    taskRepository = new TaskRepository(mockPrismaClient);
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
      mockPrismaClient.task.create.mockResolvedValue(mockCreatedTask);

      const result = await taskRepository.create(createTaskInput);

      expect(result).toEqual(mockCreatedTask);
      expect(mockPrismaClient.task.create).toHaveBeenCalledWith({
        data: createTaskInput,
      });
    });

    it('データベースエラーの場合、エラーがスローされること', async () => {
      const error = new Error('データベースエラー');
      mockPrismaClient.task.create.mockRejectedValue(error);

      await expect(taskRepository.create(createTaskInput)).rejects.toThrow(error);
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
      mockPrismaClient.task.update.mockResolvedValue(mockUpdatedTask);

      const result = await taskRepository.update(taskId, updateTaskInput);

      expect(result).toEqual(mockUpdatedTask);
      expect(mockPrismaClient.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskInput,
      });
    });

    it('タスクが存在しない場合、エラーがスローされること', async () => {
      mockPrismaClient.task.update.mockRejectedValue(new Error('タスクが見つかりません'));

      await expect(taskRepository.update(taskId, updateTaskInput)).rejects.toThrow('タスクが見つかりません');
    });
  });

  describe('delete', () => {
    const taskId = 'task-1';

    it('タスクが正常に削除されること', async () => {
      mockPrismaClient.task.delete.mockResolvedValue(undefined);

      await taskRepository.delete(taskId);

      expect(mockPrismaClient.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });

    it('タスクが存在しない場合、エラーがスローされること', async () => {
      mockPrismaClient.task.delete.mockRejectedValue(new Error('タスクが見つかりません'));

      await expect(taskRepository.delete(taskId)).rejects.toThrow('タスクが見つかりません');
    });
  });

  describe('getById', () => {
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
      mockPrismaClient.task.findUnique.mockResolvedValue(mockTask);

      const result = await taskRepository.getById(taskId);

      expect(result).toEqual(mockTask);
      expect(mockPrismaClient.task.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });

    it('タスクが存在しない場合、nullが返されること', async () => {
      mockPrismaClient.task.findUnique.mockResolvedValue(null);

      const result = await taskRepository.getById(taskId);

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    const mockTasks = [
      {
        id: 'task-1',
        title: 'テストタスク1',
        description: 'テストタスク1の説明',
        priority: 'HIGH',
        status: 'TODO',
        dueDate: new Date(),
        projectId: 'project-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'テストタスク2',
        description: 'テストタスク2の説明',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        dueDate: new Date(),
        projectId: 'project-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('タスク一覧が正常に取得できること', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue(mockTasks);

      const result = await taskRepository.getAll();

      expect(result).toEqual(mockTasks);
      expect(mockPrismaClient.task.findMany).toHaveBeenCalled();
    });

    it('タスクが存在しない場合、空配列が返されること', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([]);

      const result = await taskRepository.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getByProjectId', () => {
    const projectId = 'project-1';
    const mockTasks = [
      {
        id: 'task-1',
        title: 'テストタスク1',
        description: 'テストタスク1の説明',
        priority: 'HIGH',
        status: 'TODO',
        dueDate: new Date(),
        projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'テストタスク2',
        description: 'テストタスク2の説明',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        dueDate: new Date(),
        projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('プロジェクトに紐づくタスク一覧が正常に取得できること', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue(mockTasks);

      const result = await taskRepository.getByProjectId(projectId);

      expect(result).toEqual(mockTasks);
      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith({
        where: { projectId },
      });
    });

    it('タスクが存在しない場合、空配列が返されること', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([]);

      const result = await taskRepository.getByProjectId(projectId);

      expect(result).toEqual([]);
    });
  });
});
