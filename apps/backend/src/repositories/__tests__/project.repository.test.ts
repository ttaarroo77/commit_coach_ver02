import { ProjectRepository } from '../project.repository';
import { PrismaClient } from '@prisma/client';
import { Project } from '@commit-coach/domain';

jest.mock('@prisma/client');

describe('ProjectRepository', () => {
  let projectRepository: ProjectRepository;
  let mockPrismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrismaClient = {
      project: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;

    projectRepository = new ProjectRepository(mockPrismaClient);
  });

  describe('create', () => {
    const createProjectInput = {
      name: 'テストプロジェクト',
      description: 'テストプロジェクトの説明',
      startDate: new Date(),
      endDate: new Date(),
      status: 'ACTIVE',
      userId: 'user-1',
    };

    const mockCreatedProject = {
      id: 'project-1',
      ...createProjectInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('プロジェクトが正常に作成されること', async () => {
      mockPrismaClient.project.create.mockResolvedValue(mockCreatedProject);

      const result = await projectRepository.create(createProjectInput);

      expect(result).toEqual(mockCreatedProject);
      expect(mockPrismaClient.project.create).toHaveBeenCalledWith({
        data: createProjectInput,
      });
    });

    it('データベースエラーの場合、エラーがスローされること', async () => {
      const error = new Error('データベースエラー');
      mockPrismaClient.project.create.mockRejectedValue(error);

      await expect(projectRepository.create(createProjectInput)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    const projectId = 'project-1';
    const updateProjectInput = {
      name: '更新されたプロジェクト',
      description: '更新されたプロジェクトの説明',
      startDate: new Date(),
      endDate: new Date(),
      status: 'COMPLETED',
    };

    const mockUpdatedProject = {
      id: projectId,
      ...updateProjectInput,
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('プロジェクトが正常に更新されること', async () => {
      mockPrismaClient.project.update.mockResolvedValue(mockUpdatedProject);

      const result = await projectRepository.update(projectId, updateProjectInput);

      expect(result).toEqual(mockUpdatedProject);
      expect(mockPrismaClient.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: updateProjectInput,
      });
    });

    it('プロジェクトが存在しない場合、エラーがスローされること', async () => {
      mockPrismaClient.project.update.mockRejectedValue(new Error('プロジェクトが見つかりません'));

      await expect(projectRepository.update(projectId, updateProjectInput)).rejects.toThrow('プロジェクトが見つかりません');
    });
  });

  describe('delete', () => {
    const projectId = 'project-1';

    it('プロジェクトが正常に削除されること', async () => {
      mockPrismaClient.project.delete.mockResolvedValue(undefined);

      await projectRepository.delete(projectId);

      expect(mockPrismaClient.project.delete).toHaveBeenCalledWith({
        where: { id: projectId },
      });
    });

    it('プロジェクトが存在しない場合、エラーがスローされること', async () => {
      mockPrismaClient.project.delete.mockRejectedValue(new Error('プロジェクトが見つかりません'));

      await expect(projectRepository.delete(projectId)).rejects.toThrow('プロジェクトが見つかりません');
    });
  });

  describe('getById', () => {
    const projectId = 'project-1';
    const mockProject = {
      id: projectId,
      name: 'テストプロジェクト',
      description: 'テストプロジェクトの説明',
      startDate: new Date(),
      endDate: new Date(),
      status: 'ACTIVE',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('プロジェクトが正常に取得できること', async () => {
      mockPrismaClient.project.findUnique.mockResolvedValue(mockProject);

      const result = await projectRepository.getById(projectId);

      expect(result).toEqual(mockProject);
      expect(mockPrismaClient.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectId },
      });
    });

    it('プロジェクトが存在しない場合、nullが返されること', async () => {
      mockPrismaClient.project.findUnique.mockResolvedValue(null);

      const result = await projectRepository.getById(projectId);

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    const mockProjects = [
      {
        id: 'project-1',
        name: 'テストプロジェクト1',
        description: 'テストプロジェクト1の説明',
        startDate: new Date(),
        endDate: new Date(),
        status: 'ACTIVE',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'project-2',
        name: 'テストプロジェクト2',
        description: 'テストプロジェクト2の説明',
        startDate: new Date(),
        endDate: new Date(),
        status: 'COMPLETED',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('プロジェクト一覧が正常に取得できること', async () => {
      mockPrismaClient.project.findMany.mockResolvedValue(mockProjects);

      const result = await projectRepository.getAll();

      expect(result).toEqual(mockProjects);
      expect(mockPrismaClient.project.findMany).toHaveBeenCalled();
    });

    it('プロジェクトが存在しない場合、空配列が返されること', async () => {
      mockPrismaClient.project.findMany.mockResolvedValue([]);

      const result = await projectRepository.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getByUserId', () => {
    const userId = 'user-1';
    const mockProjects = [
      {
        id: 'project-1',
        name: 'テストプロジェクト1',
        description: 'テストプロジェクト1の説明',
        startDate: new Date(),
        endDate: new Date(),
        status: 'ACTIVE',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'project-2',
        name: 'テストプロジェクト2',
        description: 'テストプロジェクト2の説明',
        startDate: new Date(),
        endDate: new Date(),
        status: 'COMPLETED',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('ユーザーに紐づくプロジェクト一覧が正常に取得できること', async () => {
      mockPrismaClient.project.findMany.mockResolvedValue(mockProjects);

      const result = await projectRepository.getByUserId(userId);

      expect(result).toEqual(mockProjects);
      expect(mockPrismaClient.project.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('プロジェクトが存在しない場合、空配列が返されること', async () => {
      mockPrismaClient.project.findMany.mockResolvedValue([]);

      const result = await projectRepository.getByUserId(userId);

      expect(result).toEqual([]);
    });
  });
});
