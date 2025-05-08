import { GetUserUseCase } from '../get-user.use-case';
import { UserRepository } from '../../../repositories/user.repository';

jest.mock('../../../repositories/user.repository');

describe('GetUserUseCase', () => {
  let getUserUseCase: GetUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      getById: jest.fn(),
    } as any;

    getUserUseCase = new GetUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    const userId = 'user-1';
    const mockUser = {
      id: userId,
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('ユーザーが正常に取得できること', async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);

      const result = await getUserUseCase.execute(userId);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
    });

    it('ユーザーが存在しない場合、nullが返されること', async () => {
      mockUserRepository.getById.mockResolvedValue(null);

      const result = await getUserUseCase.execute(userId);

      expect(result).toBeNull();
      expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      const error = new Error('リポジトリエラー');
      mockUserRepository.getById.mockRejectedValue(error);

      await expect(getUserUseCase.execute(userId)).rejects.toThrow(error);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(userId);
    });
  });
});
