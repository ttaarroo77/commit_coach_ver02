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
    const validInput: UpdateTaskInput = {
      title: '更新されたタスク',
      description: '更新されたタスクの説明',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(),
    };

    const existingTask = {
      id: taskId,
      title: '元のタスク',
      description: '元のタスクの説明',
      projectId: 'project-1',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('タスクが正常に更新されること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockResolvedValue({
        ...existingTask,
        ...validInput,
        updatedAt: new Date(),
      });

      const result = await updateTaskUseCase.execute(taskId, validInput);

      expect(result).toEqual({
        ...existingTask,
        ...validInput,
        updatedAt: expect.any(Date),
      });
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, validInput);
    });

    it('タスクが存在しない場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(null);

      await expect(updateTaskUseCase.execute(taskId, validInput)).rejects.toThrow();
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      const error = new Error('リポジトリエラー');
      mockTaskRepository.update.mockRejectedValue(error);

      await expect(updateTaskUseCase.execute(taskId, validInput)).rejects.toThrow(error);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, validInput);
    });

    it('無効なステータスの場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      const invalidInput = {
        ...validInput,
        status: 'INVALID_STATUS',
      };

      await expect(updateTaskUseCase.execute(taskId, invalidInput)).rejects.toThrow();
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('無効な優先度の場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      const invalidInput = {
        ...validInput,
        priority: 'INVALID_PRIORITY',
      };

      await expect(updateTaskUseCase.execute(taskId, invalidInput)).rejects.toThrow();
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });
  });
});
