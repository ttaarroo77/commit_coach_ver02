import { AuthenticateUserUseCase } from '../authenticate-user.use-case';
import { UserRepository } from '../../../repositories/user.repository';

jest.mock('../../../repositories/user.repository');

describe('AuthenticateUserUseCase', () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      getByEmail: jest.fn(),
    } as any;

    authenticateUserUseCase = new AuthenticateUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    const authUserInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-1',
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('ユーザーが正常に認証されること', async () => {
      mockUserRepository.getByEmail.mockResolvedValue(mockUser);

      const result = await authenticateUserUseCase.execute(authUserInput);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(authUserInput.email);
    });

    it('ユーザーが存在しない場合、エラーがスローされること', async () => {
      mockUserRepository.getByEmail.mockResolvedValue(null);

      await expect(authenticateUserUseCase.execute(authUserInput)).rejects.toThrow();
    });

    it('パスワードが一致しない場合、エラーがスローされること', async () => {
      mockUserRepository.getByEmail.mockResolvedValue(mockUser);

      await expect(authenticateUserUseCase.execute({
        ...authUserInput,
        password: 'wrongpassword',
      })).rejects.toThrow();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      const error = new Error('リポジトリエラー');
      mockUserRepository.getByEmail.mockRejectedValue(error);

      await expect(authenticateUserUseCase.execute(authUserInput)).rejects.toThrow(error);
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(authUserInput.email);
    });
  });
});
