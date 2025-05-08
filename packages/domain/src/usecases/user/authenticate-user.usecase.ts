import { User, AuthUserInput } from '../../entities/user';
import { UserRepository } from '../../repositories/user.repository';

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * ユーザーを認証する
   * @param input 認証情報
   * @returns 認証されたユーザー
   */
  async execute(input: AuthUserInput): Promise<User> {
    // バリデーション
    if (!input.email) {
      throw new Error('メールアドレスは必須です');
    }

    if (!input.password) {
      throw new Error('パスワードは必須です');
    }

    // ユーザーの認証
    const user = await this.userRepository.authenticate(input);

    return user;
  }
}
