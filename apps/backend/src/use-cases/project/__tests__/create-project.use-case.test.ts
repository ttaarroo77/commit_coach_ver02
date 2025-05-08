import { CreateProjectUseCase } from '../create-project.use-case';
import { ProjectRepository } from '../../../repositories/project.repository';
import { CreateProjectInput } from '@commit-coach/domain';

jest.mock('../../../repositories/project.repository');

describe('CreateProjectUseCase', () => {
  let createProjectUseCase: CreateProjectUseCase;
  let mockProjectRepository: jest.Mocked<ProjectRepository>;

  beforeEach(() => {
    mockProjectRepository = {
      create: jest.fn(),
    } as any;

    createProjectUseCase = new CreateProjectUseCase(mockProjectRepository);
  });

  describe('execute', () => {
    const validInput: CreateProjectInput = {
      name: 'テストプロジェクト',
      description: 'テストプロジェクトの説明',
      type: 'PERSONAL',
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(),
    };

    it('プロジェクトが正常に作成されること', async () => {
      const expectedProject = {
        id: 'project-1',
        ...validInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProjectRepository.create.mockResolvedValue(expectedProject);

      const result = await createProjectUseCase.execute(validInput);

      expect(result).toEqual(expectedProject);
      expect(mockProjectRepository.create).toHaveBeenCalledWith(validInput);
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      const error = new Error('リポジトリエラー');
      mockProjectRepository.create.mockRejectedValue(error);

      await expect(createProjectUseCase.execute(validInput)).rejects.toThrow(error);
      expect(mockProjectRepository.create).toHaveBeenCalledWith(validInput);
    });

    it('必須フィールドが欠けている場合、エラーがスローされること', async () => {
      const invalidInput = {
        ...validInput,
        name: '',
      };

      await expect(createProjectUseCase.execute(invalidInput)).rejects.toThrow();
      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    });

    it('無効なプロジェクトタイプの場合、エラーがスローされること', async () => {
      const invalidInput = {
        ...validInput,
        type: 'INVALID_TYPE',
      };

      await expect(createProjectUseCase.execute(invalidInput)).rejects.toThrow();
      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    });

    it('無効なステータスの場合、エラーがスローされること', async () => {
      const invalidInput = {
        ...validInput,
        status: 'INVALID_STATUS',
      };

      await expect(createProjectUseCase.execute(invalidInput)).rejects.toThrow();
      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    });

    it('終了日が開始日より前の場合、エラーがスローされること', async () => {
      const invalidInput = {
        ...validInput,
        startDate: new Date('2024-12-31'),
        endDate: new Date('2024-01-01'),
      };

      await expect(createProjectUseCase.execute(invalidInput)).rejects.toThrow();
      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    });
  });
});
