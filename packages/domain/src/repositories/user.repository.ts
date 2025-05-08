import { User, CreateUserInput, UpdateUserInput, AuthUserInput } from '../entities/user';

export interface UserRepository {
  /**
   * ユーザーを作成する
   */
  create(input: CreateUserInput): Promise<User>;

  /**
   * ユーザーを更新する
   */
  update(id: string, input: UpdateUserInput): Promise<User>;

  /**
   * ユーザーを削除する
   */
  delete(id: string): Promise<void>;

  /**
   * ユーザーを取得する
   */
  findById(id: string): Promise<User | null>;

  /**
   * メールアドレスでユーザーを取得する
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * すべてのユーザーを取得する
   */
  findAll(): Promise<User[]>;

  /**
   * ユーザーを認証する
   */
  authenticate(input: AuthUserInput): Promise<User>;

  /**
   * ユーザーのロールを更新する
   */
  updateRole(id: string, role: User['role']): Promise<User>;
}
