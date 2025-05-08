import { UpdateTaskUseCase } from '../update-task.use-case';
import { TaskRepository } from '../../../repositories/task.repository';
import { UpdateTaskInput } from '@commit-coach/domain';

jest.mock('../../../repositories/task.repository');

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      update: jest.fn(),
      getById: jest.fn(),
    } as any;

    updateTaskUseCase = new UpdateTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    const taskId = 'task-1';
    const existingTask = {
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

    const updateTaskInput = {
      title: '更新されたタスク',
      description: '更新されたタスクの説明',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date(),
    };

    const updatedTask = {
      ...existingTask,
      ...updateTaskInput,
      updatedAt: new Date(),
    };

    it('タスクが正常に更新されること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await updateTaskUseCase.execute(taskId, updateTaskInput);

      expect(result).toEqual(updatedTask);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, updateTaskInput);
    });

    it('タスクが存在しない場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(null);

      await expect(updateTaskUseCase.execute(taskId, updateTaskInput)).rejects.toThrow();
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      const error = new Error('リポジトリエラー');
      mockTaskRepository.update.mockRejectedValue(error);

      await expect(updateTaskUseCase.execute(taskId, updateTaskInput)).rejects.toThrow(error);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, updateTaskInput);
    });

    it('無効なステータスの場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      const invalidInput = {
        ...updateTaskInput,
        status: 'INVALID_STATUS',
      };

      await expect(updateTaskUseCase.execute(taskId, invalidInput)).rejects.toThrow();
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('無効な優先度の場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      const invalidInput = {
        ...updateTaskInput,
        priority: 'INVALID_PRIORITY',
      };

      await expect(updateTaskUseCase.execute(taskId, invalidInput)).rejects.toThrow();
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });
  });
});
