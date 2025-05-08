import { User, CreateUserInput } from '../../entities/user';
import { UserRepository } from '../../repositories/user.repository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * ユーザーを作成する
   * @param input ユーザー作成の入力
   * @returns 作成されたユーザー
   */
  async execute(input: CreateUserInput): Promise<User> {
    // バリデーション
    if (!input.name) {
      throw new Error('ユーザー名は必須です');
    }

    if (!input.email) {
      throw new Error('メールアドレスは必須です');
    }

    if (!input.password) {
      throw new Error('パスワードは必須です');
    }

    // メールアドレスの重複チェック
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に使用されています');
    }

    // ユーザーの作成
    const user = await this.userRepository.create(input);

    return user;
  }
}
