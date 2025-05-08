import { GetProjectUseCase } from '../get-project.use-case';
import { ProjectRepository } from '../../../repositories/project.repository';

jest.mock('../../../repositories/project.repository');

describe('GetProjectUseCase', () => {
  let getProjectUseCase: GetProjectUseCase;
  let mockProjectRepository: jest.Mocked<ProjectRepository>;

  beforeEach(() => {
    mockProjectRepository = {
      getById: jest.fn(),
    } as any;

    getProjectUseCase = new GetProjectUseCase(mockProjectRepository);
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

    it('プロジェクトが正常に取得できること', async () => {
      mockProjectRepository.getById.mockResolvedValue(mockProject);

      const result = await getProjectUseCase.execute(projectId);

      expect(result).toEqual(mockProject);
      expect(mockProjectRepository.getById).toHaveBeenCalledWith(projectId);
    });

    it('プロジェクトが存在しない場合、nullが返されること', async () => {
      mockProjectRepository.getById.mockResolvedValue(null);

      const result = await getProjectUseCase.execute(projectId);

      expect(result).toBeNull();
      expect(mockProjectRepository.getById).toHaveBeenCalledWith(projectId);
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      const error = new Error('リポジトリエラー');
      mockProjectRepository.getById.mockRejectedValue(error);

      await expect(getProjectUseCase.execute(projectId)).rejects.toThrow(error);
      expect(mockProjectRepository.getById).toHaveBeenCalledWith(projectId);
    });
  });
});
