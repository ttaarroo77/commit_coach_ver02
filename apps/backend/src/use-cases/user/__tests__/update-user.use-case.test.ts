import { UpdateUserUseCase } from '../update-user.use-case';
import { UserRepository } from '../../../repositories/user.repository';

jest.mock('../../../repositories/user.repository');

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      update: jest.fn(),
      getById: jest.fn(),
      getByEmail: jest.fn(),
    } as any;

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    const userId = 'user-1';
    const existingUser = {
      id: userId,
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateUserInput = {
      name: '更新されたユーザー',
      email: 'updated@example.com',
      password: 'newpassword123',
    };

    const updatedUser = {
      ...existingUser,
      ...updateUserInput,
      updatedAt: new Date(),
    };

    it('ユーザーが正常に更新されること', async () => {
      mockUserRepository.getById.mockResolvedValue(existingUser);
      mockUserRepository.getByEmail.mockResolvedValue(null);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await updateUserUseCase.execute(userId, updateUserInput);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateUserInput);
    });

    it('ユーザーが存在しない場合、エラーがスローされること', async () => {
      mockUserRepository.getById.mockResolvedValue(null);

      await expect(updateUserUseCase.execute(userId, updateUserInput)).rejects.toThrow();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('メールアドレスが既に使用されている場合、エラーがスローされること', async () => {
      mockUserRepository.getById.mockResolvedValue(existingUser);
      mockUserRepository.getByEmail.mockResolvedValue({
        ...existingUser,
        id: 'other-user-id',
      });

      await expect(updateUserUseCase.execute(userId, updateUserInput)).rejects.toThrow();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('リポジトリでエラーが発生した場合、エラーがスローされること', async () => {
      mockUserRepository.getById.mockResolvedValue(existingUser);
      mockUserRepository.getByEmail.mockResolvedValue(null);
      const error = new Error('リポジトリエラー');
      mockUserRepository.update.mockRejectedValue(error);

      await expect(updateUserUseCase.execute(userId, updateUserInput)).rejects.toThrow(error);
