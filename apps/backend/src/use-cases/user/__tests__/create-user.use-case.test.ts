import { CreateUserUseCase } from '../create-user.use-case';
import { UserRepository } from '../../../repositories/user.repository';

jest.mock('../../../repositories/user.repository');

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      getByEmail: jest.fn(),
    } as any;

    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    const createUserInput = {
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123',
    };

    const mockCreatedUser = {
      id: 'user-1',
      ...createUserInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('ユーザーが正常に作成されること', async () => {
      mockUserRepository.getByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await createUserUseCase.execute(createUserInput);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserInput);
    });

    it('メールアドレスが既に使用されている場合、エラーがスローされること', async () => {
      mockUserRepository.getByEmail.mockResolvedValue(mockCreatedUser);

      await expect(createUserUseCase.execute(createUserInput)).rejects.toThrow();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      mockUserRepository.getByEmail.mockResolvedValue(null);
      const error = new Error('リポジトリエラー');
      mockUserRepository.create.mockRejectedValue(error);

      await expect(createUserUseCase.execute(createUserInput)).rejects.toThrow(error);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserInput);
    });
  });
});
