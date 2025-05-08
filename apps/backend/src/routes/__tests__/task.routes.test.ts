import { Request, Response } from 'express';
import { TaskRouter } from '../task.routes';
import { TaskController } from '../../controllers/task.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { ValidationMiddleware } from '../../middlewares/validation.middleware';

jest.mock('../../controllers/task.controller');
jest.mock('../../middlewares/auth.middleware');
jest.mock('../../middlewares/validation.middleware');

describe('TaskRouter', () => {
  let taskRouter: TaskRouter;
  let mockTaskController: jest.Mocked<TaskController>;
  let mockAuthMiddleware: jest.Mocked<AuthMiddleware>;
  let mockValidationMiddleware: jest.Mocked<ValidationMiddleware>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockTaskController = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      updateStatus: jest.fn(),
      updatePriority: jest.fn(),
    } as any;

    mockAuthMiddleware = {
      authenticate: jest.fn(),
    } as any;

    mockValidationMiddleware = {
      validate: jest.fn(),
    } as any;

    taskRouter = new TaskRouter(
      mockTaskController,
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
    it('タスク作成のルートが正しく設定されていること', () => {
      const router = taskRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/' && layer.route?.methods.post,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('タスク更新のルートが正しく設定されていること', () => {
      const router = taskRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.put,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('タスク削除のルートが正しく設定されていること', () => {
      const router = taskRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.delete,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('タスク取得のルートが正しく設定されていること', () => {
      const router = taskRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.get,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('全タスク取得のルートが正しく設定されていること', () => {
      const router = taskRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/' && layer.route?.methods.get,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('タスクステータス更新のルートが正しく設定されていること', () => {
      const router = taskRouter.getRouter();
      const route = router.stack.find(
        (layer) =>
          layer.route?.path === '/:id/status' && layer.route?.methods.patch,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });

  describe('updatePriority', () => {
    it('タスク優先度更新のルートが正しく設定されていること', () => {
      const router = taskRouter.getRouter();
      const route = router.stack.find(
        (layer) =>
          layer.route?.path === '/:id/priority' && layer.route?.methods.patch,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });
});
