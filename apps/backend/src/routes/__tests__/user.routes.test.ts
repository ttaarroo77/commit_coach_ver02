import { Request, Response } from 'express';
import { UserRouter } from '../user.routes';
import { UserController } from '../../controllers/user.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { ValidationMiddleware } from '../../middlewares/validation.middleware';

jest.mock('../../controllers/user.controller');
jest.mock('../../middlewares/auth.middleware');
jest.mock('../../middlewares/validation.middleware');

describe('UserRouter', () => {
  let userRouter: UserRouter;
  let mockUserController: jest.Mocked<UserController>;
  let mockAuthMiddleware: jest.Mocked<AuthMiddleware>;
  let mockValidationMiddleware: jest.Mocked<ValidationMiddleware>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUserController = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      getByEmail: jest.fn(),
      getAll: jest.fn(),
      authenticate: jest.fn(),
    } as any;

    mockAuthMiddleware = {
      authenticate: jest.fn(),
    } as any;

    mockValidationMiddleware = {
      validate: jest.fn(),
    } as any;

    userRouter = new UserRouter(
      mockUserController,
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
    it('ユーザー作成のルートが正しく設定されていること', () => {
      const router = userRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/' && layer.route?.methods.post,
      );

      expect(route).toBeDefined();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('ユーザー更新のルートが正しく設定されていること', () => {
      const router = userRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.put,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('ユーザー削除のルートが正しく設定されていること', () => {
      const router = userRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.delete,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('ユーザー取得のルートが正しく設定されていること', () => {
      const router = userRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/:id' && layer.route?.methods.get,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('getByEmail', () => {
    it('メールアドレスによるユーザー取得のルートが正しく設定されていること', () => {
      const router = userRouter.getRouter();
      const route = router.stack.find(
        (layer) =>
          layer.route?.path === '/email/:email' && layer.route?.methods.get,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('全ユーザー取得のルートが正しく設定されていること', () => {
      const router = userRouter.getRouter();
      const route = router.stack.find(
        (layer) => layer.route?.path === '/' && layer.route?.methods.get,
      );

      expect(route).toBeDefined();
      expect(mockAuthMiddleware.authenticate).toHaveBeenCalled();
    });
  });

  describe('authenticate', () => {
    it('ユーザー認証のルートが正しく設定されていること', () => {
      const router = userRouter.getRouter();
      const route = router.stack.find(
        (layer) =>
          layer.route?.path === '/authenticate' && layer.route?.methods.post,
      );

      expect(route).toBeDefined();
      expect(mockValidationMiddleware.validate).toHaveBeenCalled();
    });
  });
});
