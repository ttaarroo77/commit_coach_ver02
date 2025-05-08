import { User, UpdateUserInput } from '../../entities/user';
import { UserRepository } from '../../repositories/user.repository';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * ユーザーを更新する
   * @param id ユーザーID
   * @param input ユーザー更新の入力
   * @returns 更新されたユーザー
   */
  async execute(id: string, input: UpdateUserInput): Promise<User> {
    // ユーザーの存在確認
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('ユーザーが見つかりません');
    }

    // メールアドレスの重複チェック（メールアドレスが変更される場合）
    if (input.email && input.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(input.email);
      if (userWithEmail) {
        throw new Error('このメールアドレスは既に使用されています');
      }
    }

    // ユーザーの更新
    const updatedUser = await this.userRepository.update(id, input);

    return updatedUser;
  }
}
