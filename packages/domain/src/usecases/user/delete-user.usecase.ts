import { UserRepository } from '../../repositories/user.repository';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * ユーザーを削除する
   * @param id ユーザーID
   */
  async execute(id: string): Promise<void> {
    // ユーザーの存在確認
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('ユーザーが見つかりません');
    }

    // ユーザーの削除
    await this.userRepository.delete(id);
  }
}
