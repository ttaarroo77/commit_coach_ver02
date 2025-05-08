import { CreateTaskUseCase } from '../create-task.use-case';
import { TaskRepository } from '../../../repositories/task.repository';
import { CreateTaskInput } from '@commit-coach/domain';

jest.mock('../../../repositories/task.repository');

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
    } as any;

    createTaskUseCase = new CreateTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    const validInput: CreateTaskInput = {
      title: 'テストタスク',
      description: 'テストタスクの説明',
      projectId: 'project-1',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(),
    };

    it('タスクが正常に作成されること', async () => {
      const expectedTask = {
        id: 'task-1',
        ...validInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const result = await createTaskUseCase.execute(validInput);

      expect(result).toEqual(expectedTask);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(validInput);
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      const error = new Error('リポジトリエラー');
      mockTaskRepository.create.mockRejectedValue(error);

      await expect(createTaskUseCase.execute(validInput)).rejects.toThrow(error);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(validInput);
    });

    it('必須フィールドが欠けている場合、エラーがスローされること', async () => {
      const invalidInput = {
        ...validInput,
        title: '',
      };

      await expect(createTaskUseCase.execute(invalidInput)).rejects.toThrow();
      expect(mockTaskRepository.create).not.toHaveBeenCalled();
    });

    it('無効なステータスの場合、エラーがスローされること', async () => {
      const invalidInput = {
        ...validInput,
        status: 'INVALID_STATUS',
      };

      await expect(createTaskUseCase.execute(invalidInput)).rejects.toThrow();
      expect(mockTaskRepository.create).not.toHaveBeenCalled();
    });

    it('無効な優先度の場合、エラーがスローされること', async () => {
      const invalidInput = {
        ...validInput,
        priority: 'INVALID_PRIORITY',
      };

      await expect(createTaskUseCase.execute(invalidInput)).rejects.toThrow();
      expect(mockTaskRepository.create).not.toHaveBeenCalled();
    });
  });
});
