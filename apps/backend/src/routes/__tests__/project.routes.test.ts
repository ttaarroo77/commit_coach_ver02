import { Request, Response } from 'express';
import { ProjectRouter } from '../project.routes';
import { ProjectController } from '../../controllers/project.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { ValidationMiddleware } from '../../middlewares/validation.middleware';

jest.mock('../../controllers/project.controller');
jest.mock('../../middlewares/auth.middleware');
jest.mock('../../middlewares/validation.middleware');

describe('ProjectRouter', () => {
  let projectRouter: ProjectRouter;
  let mockProjectController: jest.Mocked<ProjectController>;
  let mockAuthMiddleware: jest.Mocked<AuthMiddleware>;
  let mockValidationMiddleware: jest.Mocked<ValidationMiddleware>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockProjectController = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      getWithStats: jest.fn(),
      updateStatus: jest.fn(),
      updateType: jest.fn(),
    } as any;

    mockAuthMiddleware = {
      authenticate: jest.fn(),
    } as any;

    mockValidationMiddleware = {
      validate: jest.fn(),
    } as any;

    projectRouter = new ProjectRouter(
      mockProjectController,
      mockAuthMiddleware,
      mockValidationMiddleware,
    );

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('create', () => {
    it('プロジェクト作成のルートが正しく設定されていること', () => {
      const router = projectRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/' && layer.route?.methods.post,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('プロジェクト更新のルートが正しく設定されていること', () => {
      const router = projectRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.put,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('プロジェクト削除のルートが正しく設定されていること', () => {
      const router = projectRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.delete,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('プロジェクト取得のルートが正しく設定されていること', () => {
      const router = projectRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.get,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('全プロジェクト取得のルートが正しく設定されていること', () => {
      const router = projectRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/' && layer.route?.methods.get,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('getWithStats', () => {
    it('統計情報付きプロジェクト取得のルートが正しく設定されていること', () => {
      const router = projectRouter.getRouter();
      const route = router.stack.find(
        (layer) =>
          layer.route?.path === '/:id/stats' && layer.route?.methods.get,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('プロジェクトステータス更新のルートが正しく設定されていること', () => {
      const router = projectRouter.getRouter();
      const route = router.stack.find(
        (layer) =>
          layer.route?.path === '/:id/status' && layer.route?.methods.patch,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });

  describe('updateType', () => {
    it('プロジェクトタイプ更新のルートが正しく設定されていること', () => {
      const router = projectRouter.getRouter();
      const route = router.stack.find(
        (layer) =>
          layer.route?.path === '/:id/type' && layer.route?.methods.patch,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });
});
