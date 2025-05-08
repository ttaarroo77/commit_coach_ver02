import { Request, Response } from 'express';
import { UserController } from '../user.controller';
import { CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase, GetUserUseCase, AuthenticateUserUseCase } from '@commit-coach/domain/usecases/user';
import { User, UserRole } from '@commit-coach/domain/entities/user';

describe('UserController', () => {
  let userController: UserController;
  let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;
  let mockUpdateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let mockDeleteUserUseCase: jest.Mocked<DeleteUserUseCase>;
  let mockGetUserUseCase: jest.Mocked<GetUserUseCase>;
  let mockAuthenticateUserUseCase: jest.Mocked<AuthenticateUserUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockCreateUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockUpdateUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockDeleteUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetUserUseCase = {
      execute: jest.fn(),
      executeByEmail: jest.fn(),
      executeAll: jest.fn(),
    } as any;

    mockAuthenticateUserUseCase = {
      execute: jest.fn(),
    } as any;

    userController = new UserController(
      mockCreateUserUseCase,
      mockUpdateUserUseCase,
      mockDeleteUserUseCase,
      mockGetUserUseCase,
      mockAuthenticateUserUseCase,
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
    it('ユーザーを作成できること', async () => {
      const mockUser: User = {
        id: '1',
        name: 'テストユーザー',
        email: 'test@example.com',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
      };

      mockCreateUserUseCase.execute.mockResolvedValue(mockUser);

      await userController.create(mockRequest as Request, mockResponse as Response);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.body = {};
      mockCreateUserUseCase.execute.mockRejectedValue(new Error('バリデーションエラー'));

      await userController.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'バリデーションエラー' });
    });
  });

  describe('update', () => {
    it('ユーザーを更新できること', async () => {
      const mockUser: User = {
        id: '1',
        name: '更新されたユーザー',
        email: 'updated@example.com',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = {
        name: '更新されたユーザー',
        email: 'updated@example.com',
        role: UserRole.ADMIN,
      };

      mockUpdateUserUseCase.execute.mockResolvedValue(mockUser);

      await userController.update(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith('1', mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {};
      mockUpdateUserUseCase.execute.mockRejectedValue(new Error('更新エラー'));

      await userController.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '更新エラー' });
    });
  });

  describe('delete', () => {
    it('ユーザーを削除できること', async () => {
      mockRequest.params = { id: '1' };
      mockDeleteUserUseCase.execute.mockResolvedValue();

      await userController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('エラー時に400を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockDeleteUserUseCase.execute.mockRejectedValue(new Error('削除エラー'));

      await userController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '削除エラー' });
    });
  });

  describe('get', () => {
    it('ユーザーを取得できること', async () => {
      const mockUser: User = {
        id: '1',
        name: 'テストユーザー',
        email: 'test@example.com',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: '1' };
      mockGetUserUseCase.execute.mockResolvedValue(mockUser);

      await userController.get(mockRequest as Request, mockResponse as Response);

      expect(mockGetUserUseCase.execute).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('ユーザーが見つからない場合に404を返すこと', async () => {
      mockRequest.params = { id: '1' };
      mockGetUserUseCase.execute.mockRejectedValue(new Error('ユーザーが見つかりません'));

      await userController.get(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'ユーザーが見つかりません' });
    });
  });

  describe('getByEmail', () => {
    it('メールアドレスでユーザーを取得できること', async () => {
      const mockUser: User = {
        id: '1',
        name: 'テストユーザー',
        email: 'test@example.com',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { email: 'test@example.com' };
      mockGetUserUseCase.executeByEmail.mockResolvedValue(mockUser);

      await userController.getByEmail(mockRequest as Request, mockResponse as Response);

      expect(mockGetUserUseCase.executeByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('ユーザーが見つからない場合に404を返すこと', async () => {
      mockRequest.params = { email: 'notfound@example.com' };
      mockGetUserUseCase.executeByEmail.mockRejectedValue(new Error('ユーザーが見つかりません'));

      await userController.getByEmail(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'ユーザーが見つかりません' });
    });
  });

  describe('authenticate', () => {
    it('ユーザーを認証できること', async () => {
      const mockUser: User = {
        id: '1',
        name: 'テストユーザー',
        email: 'test@example.com',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthenticateUserUseCase.execute.mockResolvedValue(mockUser);

      await userController.authenticate(mockRequest as Request, mockResponse as Response);

      expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('認証に失敗した場合に401を返すこと', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthenticateUserUseCase.execute.mockRejectedValue(new Error('認証に失敗しました'));

      await userController.authenticate(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '認証に失敗しました' });
    });
  });
});
