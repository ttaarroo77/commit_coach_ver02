import { Request, Response } from 'express';
import { ProjectController } from '../project.controller';
import { CreateProjectUseCase, UpdateProjectUseCase, DeleteProjectUseCase, GetProjectUseCase } from '@commit-coach/domain/usecases/project';
import { Project, ProjectType, ProjectStatus } from '@commit-coach/domain/entities/project';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let mockCreateProjectUseCase: jest.Mocked<CreateProjectUseCase>;
  let mockUpdateProjectUseCase: jest.Mocked<UpdateProjectUseCase>;
  let mockDeleteProjectUseCase: jest.Mocked<DeleteProjectUseCase>;
  let mockGetProjectUseCase: jest.Mocked<GetProjectUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockCreateProjectUseCase = {
      execute: jest.fn(),
    } as any;

    mockUpdateProjectUseCase = {
      execute: jest.fn(),
    } as any;

    mockDeleteProjectUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetProjectUseCase = {
      execute: jest.fn(),
      executeAll: jest.fn(),
      executeWithStats: jest.fn(),
      executeUpdateStatus: jest.fn(),
      executeUpdateType: jest.fn(),
    } as any;

    projectController = new ProjectController(
      mockCreateProjectUseCase,
      mockUpdateProjectUseCase,
      mockDeleteProjectUseCase,
      mockGetProjectUseCase,
    );

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('create', () => {
    it('プロジェクトを作成できること', async () => {
      const mockProject: Project = {
        id: '1',
        name: 'テストプロジェクト',
        description: 'テスト説明',
        type: ProjectType.PERSONAL,
        status: ProjectStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        name: 'テストプロジェクト',
        description: 'テスト説明',
        type: ProjectType.PERSONAL,
        status: ProjectStatus.ACTIVE,
      };

      mockCreateProjectUseCase.execute.mockResolvedValue(mockProject);

      await projectController.create(mockRequest as Request, mockResponse as Response);

      expect(mockCreateProjectUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProject);
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.body = {};
      mockCreateProjectUseCase.execute.mockRejectedValue(new Error('バリデーションエラー'));

      await projectController.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'バリデーションエラー' });
    });
  });

  describe('update', () => {
    it('プロジェクトを更新できること', async () => {
      const mockProject: Project = {
        id: '1',
        name: '更新されたプロジェクト',
        description: '更新された説明',
        type: ProjectType.TEAM,
        status: ProjectStatus.ARCHIVED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = {
        name: '更新されたプロジェクト',
        description: '更新された説明',
        type: ProjectType.TEAM,
        status: ProjectStatus.ARCHIVED,
      };

      mockUpdateProjectUseCase.execute.mockResolvedValue(mockProject);

      await projectController.update(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectUseCase.execute).toHaveBeenCalledWith('1', mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProject);
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {};
      mockUpdateProjectUseCase.execute.mockRejectedValue(new Error('更新エラー'));

      await projectController.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '更新エラー' });
    });
  });

  describe('delete', () => {
    it('プロジェクトを削除できること', async () => {
      mockRequest.params = { id: '1' };
      mockDeleteProjectUseCase.execute.mockResolvedValue();

      await projectController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockDeleteProjectUseCase.execute).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockDeleteProjectUseCase.execute.mockRejectedValue(new Error('削除エラー'));

      await projectController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '削除エラー' });
    });
  });

  describe('get', () => {
    it('プロジェクトを取得できること', async () => {
      const mockProject: Project = {
        id: '1',
        name: 'テストプロジェクト',
        description: 'テスト説明',
        type: ProjectType.PERSONAL,
        status: ProjectStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: '1' };
      mockGetProjectUseCase.execute.mockResolvedValue(mockProject);

      await projectController.get(mockRequest as Request, mockResponse as Response);

      expect(mockGetProjectUseCase.execute).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockProject);
    });

    it('プロジェクトが見つからない場合に404を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockGetProjectUseCase.execute.mockRejectedValue(new Error('プロジェクトが見つかりません'));

      await projectController.get(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'プロジェクトが見つかりません' });
    });
  });
});
