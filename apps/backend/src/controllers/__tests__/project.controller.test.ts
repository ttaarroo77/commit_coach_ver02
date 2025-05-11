import { Request, Response } from 'express';
import { ProjectController } from '../project.controller';
import { CreateProjectUseCase } from '../../use-cases/project/create-project.use-case';
import { UpdateProjectUseCase } from '../../use-cases/project/update-project.use-case';
import { DeleteProjectUseCase } from '../../use-cases/project/delete-project.use-case';
import { GetProjectUseCase } from '../../use-cases/project/get-project.use-case';
import { GetAllProjectsUseCase } from '../../use-cases/project/get-all-projects.use-case';

jest.mock('../../use-cases/project/create-project.use-case');
jest.mock('../../use-cases/project/update-project.use-case');
jest.mock('../../use-cases/project/delete-project.use-case');
jest.mock('../../use-cases/project/get-project.use-case');
jest.mock('../../use-cases/project/get-all-projects.use-case');

describe('ProjectController', () => {
  let projectController: ProjectController;
  let mockCreateProjectUseCase: jest.Mocked<CreateProjectUseCase>;
  let mockUpdateProjectUseCase: jest.Mocked<UpdateProjectUseCase>;
  let mockDeleteProjectUseCase: jest.Mocked<DeleteProjectUseCase>;
  let mockGetProjectUseCase: jest.Mocked<GetProjectUseCase>;
  let mockGetAllProjectsUseCase: jest.Mocked<GetAllProjectsUseCase>;
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
    } as any;

    mockGetAllProjectsUseCase = {
      execute: jest.fn(),
    } as any;

    projectController = new ProjectController(
      mockCreateProjectUseCase,
      mockUpdateProjectUseCase,
      mockDeleteProjectUseCase,
      mockGetProjectUseCase,
      mockGetAllProjectsUseCase
    );

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('create', () => {
    const createProjectInput = {
      name: 'テストプロジェクト',
      description: 'テストプロジェクトの説明',
      type: 'PERSONAL',
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(),
    };

    const mockCreatedProject = {
      id: 'project-1',
      ...createProjectInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('プロジェクトが正常に作成されること', async () => {
      mockRequest.body = createProjectInput;
      mockCreateProjectUseCase.execute.mockResolvedValue(mockCreatedProject);

      await projectController.create(mockRequest as Request, mockResponse as Response);

      expect(mockCreateProjectUseCase.execute).toHaveBeenCalledWith(createProjectInput);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedProject);
    });

    it('バリデーションエラーの場合、400エラーが返されること', async () => {
      mockRequest.body = { ...createProjectInput, name: '' };
      mockCreateProjectUseCase.execute.mockRejectedValue(new Error('バリデーションエラー'));

      await projectController.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'バリデーションエラー',
      });
    });
  });

  describe('update', () => {
    const projectId = 'project-1';
    const updateProjectInput = {
      name: '更新されたプロジェクト',
      description: '更新されたプロジェクトの説明',
      type: 'TEAM',
      status: 'COMPLETED',
      startDate: new Date(),
      endDate: new Date(),
    };

    const mockUpdatedProject = {
      id: projectId,
      ...updateProjectInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('プロジェクトが正常に更新されること', async () => {
      mockRequest.params = { id: projectId };
      mockRequest.body = updateProjectInput;
      mockUpdateProjectUseCase.execute.mockResolvedValue(mockUpdatedProject);

      await projectController.update(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectUseCase.execute).toHaveBeenCalledWith(projectId, updateProjectInput);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedProject);
    });

    it('プロジェクトが存在しない場合、404エラーが返されること', async () => {
      mockRequest.params = { id: projectId };
      mockRequest.body = updateProjectInput;
      mockUpdateProjectUseCase.execute.mockRejectedValue(new Error('プロジェクトが見つかりません'));

      await projectController.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'プロジェクトが見つかりません',
      });
    });
  });

  describe('delete', () => {
    const projectId = 'project-1';

    it('プロジェクトが正常に削除されること', async () => {
      mockRequest.params = { id: projectId };
      mockDeleteProjectUseCase.execute.mockResolvedValue(undefined);

      await projectController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockDeleteProjectUseCase.execute).toHaveBeenCalledWith(projectId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('プロジェクトが存在しない場合、404エラーが返されること', async () => {
      mockRequest.params = { id: projectId };
      mockDeleteProjectUseCase.execute.mockRejectedValue(new Error('プロジェクトが見つかりません'));

      await projectController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'プロジェクトが見つかりません',
      });
    });
  });

  describe('get', () => {
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
      mockRequest.params = { id: projectId };
      mockGetProjectUseCase.execute.mockResolvedValue(mockProject);

      await projectController.get(mockRequest as Request, mockResponse as Response);

      expect(mockGetProjectUseCase.execute).toHaveBeenCalledWith(projectId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProject);
    });

    it('プロジェクトが存在しない場合、404エラーが返されること', async () => {
      mockRequest.params = { id: projectId };
      mockGetProjectUseCase.execute.mockResolvedValue(null);

      await projectController.get(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'プロジェクトが見つかりません',
      });
    });
  });

  describe('getAll', () => {
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
      mockGetAllProjectsUseCase.execute.mockResolvedValue(mockProjects);

      await projectController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockGetAllProjectsUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockProjects);
    });

    it('プロジェクトが存在しない場合、空配列が返されること', async () => {
      mockGetAllProjectsUseCase.execute.mockResolvedValue([]);

      await projectController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockGetAllProjectsUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });
});
