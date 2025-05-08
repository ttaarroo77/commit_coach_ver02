import { DeleteProjectUseCase } from '../delete-project.use-case';
import { ProjectRepository } from '../../../repositories/project.repository';

jest.mock('../../../repositories/project.repository');

describe('DeleteProjectUseCase', () => {
  let deleteProjectUseCase: DeleteProjectUseCase;
  let mockProjectRepository: jest.Mocked<ProjectRepository>;

  beforeEach(() => {
    mockProjectRepository = {
      delete: jest.fn(),
      getById: jest.fn(),
    } as any;

    deleteProjectUseCase = new DeleteProjectUseCase(mockProjectRepository);
  });

  describe('execute', () => {
    const projectId = 'project-1';
    const existingProject = {
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

    it('プロジェクトが正常に削除されること', async () => {
      mockProjectRepository.getById.mockResolvedValue(existingProject);
      mockProjectRepository.delete.mockResolvedValue(undefined);

      await deleteProjectUseCase.execute(projectId);

      expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectId);
    });

    it('プロジェクトが存在しない場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(null);

      await expect(deleteProjectUseCase.execute(projectId)).rejects.toThrow();
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      mockProjectRepository.getById.mockResolvedValue(existingProject);
      const error = new Error('リポジトリエラー');
      mockProjectRepository.delete.mockRejectedValue(error);

      await expect(deleteProjectUseCase.execute(projectId)).rejects.toThrow(error);
      expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectId);
    });
  });
});
