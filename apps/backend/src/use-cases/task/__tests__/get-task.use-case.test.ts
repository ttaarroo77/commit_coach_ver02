import { GetTaskUseCase } from '../get-task.use-case';
import { TaskRepository } from '../../../repositories/task.repository';

jest.mock('../../../repositories/task.repository');

describe('GetTaskUseCase', () => {
  let getTaskUseCase: GetTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      getById: jest.fn(),
      getAll: jest.fn(),
    } as any;

    getTaskUseCase = new GetTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    const taskId = 'task-1';
    const existingTask = {
      id: taskId,
      title: 'テストタスク',
      description: 'テストタスクの説明',
      projectId: 'project-1',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('タスクが正常に取得されること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);

      const result = await getTaskUseCase.execute(taskId);

      expect(result).toEqual(existingTask);
      expect(mockTaskRepository.getById).toHaveBeenCalledWith(taskId);
    });

    it('タスクが存在しない場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(null);

      await expect(getTaskUseCase.execute(taskId)).rejects.toThrow();
      expect(mockTaskRepository.getById).toHaveBeenCalledWith(taskId);
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      const error = new Error('リポジトリエラー');
      mockTaskRepository.getById.mockRejectedValue(error);

      await expect(getTaskUseCase.execute(taskId)).rejects.toThrow(error);
      expect(mockTaskRepository.getById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('executeAll', () => {
    const existingTasks = [
      {
        id: 'task-1',
        title: 'テストタスク1',
        description: 'テストタスク1の説明',
        projectId: 'project-1',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'テストタスク2',
        description: 'テストタスク2の説明',
        projectId: 'project-1',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('全タスクが正常に取得されること', async () => {
      mockTaskRepository.getAll.mockResolvedValue(existingTasks);

      const result = await getTaskUseCase.executeAll();

      expect(result).toEqual(existingTasks);
      expect(mockTaskRepository.getAll).toHaveBeenCalled();
    });

    it('タスクが存在しない場合、空配列が返されること', async () => {
      mockTaskRepository.getAll.mockResolvedValue([]);

      const result = await getTaskUseCase.executeAll();

      expect(result).toEqual([]);
      expect(mockTaskRepository.getAll).toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      const error = new Error('リポジトリエラー');
      mockTaskRepository.getAll.mockRejectedValue(error);

      await expect(getTaskUseCase.executeAll()).rejects.toThrow(error);
      expect(mockTaskRepository.getAll).toHaveBeenCalled();
    });
  });
});
