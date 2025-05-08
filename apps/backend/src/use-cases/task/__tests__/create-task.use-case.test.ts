import { CreateTaskUseCase } from '../create-task.use-case';
import { TaskRepository } from '../../../repositories/task.repository';
import { ProjectRepository } from '../../../repositories/project.repository';

jest.mock('../../../repositories/task.repository');
jest.mock('../../../repositories/project.repository');

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let mockProjectRepository: jest.Mocked<ProjectRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
    } as any;

    mockProjectRepository = {
      getById: jest.fn(),
    } as any;

    createTaskUseCase = new CreateTaskUseCase(mockTaskRepository, mockProjectRepository);
  });

  describe('execute', () => {
    const projectId = 'project-1';
    const mockProject = {
      id: projectId,
      name: 'テストプロジェクト',
      description: 'テストプロジェクトの説明',
      type: 'PERSONAL',
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createTaskInput = {
      title: 'テストタスク',
      description: 'テストタスクの説明',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: new Date(),
      projectId,
    };

    const mockCreatedTask = {
      id: 'task-1',
      ...createTaskInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('タスクが正常に作成されること', async () => {
      mockProjectRepository.getById.mockResolvedValue(mockProject);
      mockTaskRepository.create.mockResolvedValue(mockCreatedTask);

      const result = await createTaskUseCase.execute(createTaskInput);

      expect(result).toEqual(mockCreatedTask);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(createTaskInput);
    });

    it('プロジェクトが存在しない場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(null);

      await expect(createTaskUseCase.execute(createTaskInput)).rejects.toThrow();
      expect(mockTaskRepository.create).not.toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(mockProject);
      const error = new Error('リポジトリエラー');
      mockTaskRepository.create.mockRejectedValue(error);

      await expect(createTaskUseCase.execute(createTaskInput)).rejects.toThrow(error);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(createTaskInput);
    });
  });
});
