import { GetAllProjectsUseCase } from '../get-all-projects.use-case';
import { ProjectRepository } from '../../../repositories/project.repository';

jest.mock('../../../repositories/project.repository');

describe('GetAllProjectsUseCase', () => {
  let getAllProjectsUseCase: GetAllProjectsUseCase;
  let mockProjectRepository: jest.Mocked<ProjectRepository>;

  beforeEach(() => {
    mockProjectRepository = {
      getAll: jest.fn(),
    } as any;

    getAllProjectsUseCase = new GetAllProjectsUseCase(mockProjectRepository);
  });

  describe('execute', () => {
    const mockProjects = [
      {
        id: 'project-1',
        name: 'テストプロジェクト1',
        description: 'テストプロジェクト1の説明',
        type: 'PERSONAL',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'project-2',
        name: 'テストプロジェクト2',
        description: 'テストプロジェクト2の説明',
        type: 'TEAM',
        status: 'COMPLETED',
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('プロジェクト一覧が正常に取得できること', async () => {
      mockProjectRepository.getAll.mockResolvedValue(mockProjects);

      const result = await getAllProjectsUseCase.execute();

      expect(result).toEqual(mockProjects);
      expect(mockProjectRepository.getAll).toHaveBeenCalled();
    });

    it('プロジェクトが存在しない場合、空配列が返されること', async () => {
      mockProjectRepository.getAll.mockResolvedValue([]);

      const result = await getAllProjectsUseCase.execute();

      expect(result).toEqual([]);
      expect(mockProjectRepository.getAll).toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      const error = new Error('リポジトリエラー');
      mockProjectRepository.getAll.mockRejectedValue(error);

      await expect(getAllProjectsUseCase.execute()).rejects.toThrow(error);
      expect(mockProjectRepository.getAll).toHaveBeenCalled();
    });
  });
});
