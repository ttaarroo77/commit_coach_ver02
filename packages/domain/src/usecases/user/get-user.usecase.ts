import { User } from '../../entities/user';
import { UserRepository } from '../../repositories/user.repository';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * ユーザーを取得する
   * @param id ユーザーID
   * @returns ユーザー
   */
  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    return user;
  }

  /**
   * メールアドレスでユーザーを取得する
   * @param email メールアドレス
   * @returns ユーザー
   */
  async executeByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    return user;
  }

  /**
   * すべてのユーザーを取得する
   * @returns ユーザーの配列
   */
  async executeAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
