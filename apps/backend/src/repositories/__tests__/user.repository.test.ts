import { UserRepository } from '../user.repository';
import { PrismaClient } from '@prisma/client';
import { User } from '@commit-coach/domain';

jest.mock('@prisma/client');

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockPrismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrismaClient = {
      user: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;

    userRepository = new UserRepository(mockPrismaClient);
  });

  describe('create', () => {
    const createUserInput = {
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
    };

    const mockCreatedUser = {
      id: 'user-1',
      ...createUserInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('ユーザーが正常に作成されること', async () => {
      mockPrismaClient.user.create.mockResolvedValue(mockCreatedUser);

      const result = await userRepository.create(createUserInput);

      expect(result).toEqual(mockCreatedUser);
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: createUserInput,
      });
    });

    it('データベースエラーの場合、エラーがスローされること', async () => {
      const error = new Error('データベースエラー');
      mockPrismaClient.user.create.mockRejectedValue(error);

      await expect(userRepository.create(createUserInput)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    const userId = 'user-1';
    const updateUserInput = {
      name: '更新されたユーザー',
      email: 'updated@example.com',
      password: 'updatedHashedPassword',
      role: 'ADMIN',
    };

    const mockUpdatedUser = {
      id: userId,
      ...updateUserInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('ユーザーが正常に更新されること', async () => {
      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await userRepository.update(userId, updateUserInput);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserInput,
      });
    });

    it('ユーザーが存在しない場合、エラーがスローされること', async () => {
      mockPrismaClient.user.update.mockRejectedValue(new Error('ユーザーが見つかりません'));

      await expect(userRepository.update(userId, updateUserInput)).rejects.toThrow('ユーザーが見つかりません');
    });
  });

  describe('delete', () => {
    const userId = 'user-1';

    it('ユーザーが正常に削除されること', async () => {
      mockPrismaClient.user.delete.mockResolvedValue(undefined);

      await userRepository.delete(userId);

      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('ユーザーが存在しない場合、エラーがスローされること', async () => {
      mockPrismaClient.user.delete.mockRejectedValue(new Error('ユーザーが見つかりません'));

      await expect(userRepository.delete(userId)).rejects.toThrow('ユーザーが見つかりません');
    });
  });

  describe('getById', () => {
    const userId = 'user-1';
    const mockUser = {
      id: userId,
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('ユーザーが正常に取得できること', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      const result = await userRepository.getById(userId);

      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('ユーザーが存在しない場合、nullが返されること', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.getById(userId);

      expect(result).toBeNull();
    });
  });

  describe('getByEmail', () => {
    const email = 'test@example.com';
    const mockUser = {
      id: 'user-1',
      name: 'テストユーザー',
      email,
      password: 'hashedPassword',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('メールアドレスでユーザーが正常に取得できること', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      const result = await userRepository.getByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('ユーザーが存在しない場合、nullが返されること', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.getByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    const mockUsers = [
      {
        id: 'user-1',
        name: 'テストユーザー1',
        email: 'test1@example.com',
        password: 'hashedPassword1',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        name: 'テストユーザー2',
        email: 'test2@example.com',
        password: 'hashedPassword2',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('ユーザー一覧が正常に取得できること', async () => {
      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      const result = await userRepository.getAll();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
    });

    it('ユーザーが存在しない場合、空配列が返されること', async () => {
      mockPrismaClient.user.findMany.mockResolvedValue([]);

      const result = await userRepository.getAll();

      expect(result).toEqual([]);
    });
  });
});
