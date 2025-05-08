import { UpdateProjectUseCase } from '../update-project.use-case';
import { ProjectRepository } from '../../../repositories/project.repository';
import { UpdateProjectInput } from '@commit-coach/domain';

jest.mock('../../../repositories/project.repository');

describe('UpdateProjectUseCase', () => {
  let updateProjectUseCase: UpdateProjectUseCase;
  let mockProjectRepository: jest.Mocked<ProjectRepository>;

  beforeEach(() => {
    mockProjectRepository = {
      update: jest.fn(),
      getById: jest.fn(),
    } as any;

    updateProjectUseCase = new UpdateProjectUseCase(mockProjectRepository);
  });

  describe('execute', () => {
    const projectId = 'project-1';
    const validInput: UpdateProjectInput = {
      name: '更新されたプロジェクト',
      description: '更新されたプロジェクトの説明',
      type: 'TEAM',
      status: 'COMPLETED',
      startDate: new Date(),
      endDate: new Date(),
    };

    const existingProject = {
      id: projectId,
      name: '元のプロジェクト',
      description: '元のプロジェクトの説明',
      type: 'PERSONAL',
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('プロジェクトが正常に更新されること', async () => {
      mockProjectRepository.getById.mockResolvedValue(existingProject);
      mockProjectRepository.update.mockResolvedValue({
        ...existingProject,
        ...validInput,
        updatedAt: new Date(),
      });

      const result = await updateProjectUseCase.execute(projectId, validInput);

      expect(result).toEqual({
        ...existingProject,
        ...validInput,
        updatedAt: expect.any(Date),
      });
      expect(mockProjectRepository.update).toHaveBeenCalledWith(projectId, validInput);
    });

    it('プロジェクトが存在しない場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(null);

      await expect(updateProjectUseCase.execute(projectId, validInput)).rejects.toThrow();
      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(existingProject);
      const error = new Error('リポジトリエラー');
      mockProjectRepository.update.mockRejectedValue(error);

      await expect(updateProjectUseCase.execute(projectId, validInput)).rejects.toThrow(error);
      expect(mockProjectRepository.update).toHaveBeenCalledWith(projectId, validInput);
    });

    it('無効なプロジェクトタイプの場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(existingProject);
      const invalidInput = {
        ...validInput,
        type: 'INVALID_TYPE',
      };

      await expect(updateProjectUseCase.execute(projectId, invalidInput)).rejects.toThrow();
      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    });

    it('無効なステータスの場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(existingProject);
      const invalidInput = {
        ...validInput,
        status: 'INVALID_STATUS',
      };

      await expect(updateProjectUseCase.execute(projectId, invalidInput)).rejects.toThrow();
      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    });

    it('終了日が開始日より前の場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(existingProject);
      const invalidInput = {
        ...validInput,
        startDate: new Date('2024-12-31'),
        endDate: new Date('2024-01-01'),
      };

      await expect(updateProjectUseCase.execute(projectId, invalidInput)).rejects.toThrow();
      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    });
  });
});
