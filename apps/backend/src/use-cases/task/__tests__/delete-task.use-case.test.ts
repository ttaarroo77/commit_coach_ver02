import { DeleteTaskUseCase } from '../delete-task.use-case';
import { TaskRepository } from '../../../repositories/task.repository';

jest.mock('../../../repositories/task.repository');

describe('DeleteTaskUseCase', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      delete: jest.fn(),
      getById: jest.fn(),
    } as any;

    deleteTaskUseCase = new DeleteTaskUseCase(mockTaskRepository);
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

    it('タスクが正常に削除されること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      mockTaskRepository.delete.mockResolvedValue(undefined);

      await deleteTaskUseCase.execute(taskId);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('タスクが存在しない場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(null);

      await expect(deleteTaskUseCase.execute(taskId)).rejects.toThrow();
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      mockTaskRepository.getById.mockResolvedValue(existingTask);
      const error = new Error('リポジトリエラー');
      mockTaskRepository.delete.mockRejectedValue(error);

      await expect(deleteTaskUseCase.execute(taskId)).rejects.toThrow(error);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    });
  });
});
