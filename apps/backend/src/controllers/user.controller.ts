import { Request, Response } from 'express';
import { CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase, GetUserUseCase, AuthenticateUserUseCase } from '@commit-coach/domain/usecases/user';
import { CreateUserInput, UpdateUserInput, AuthUserInput } from '@commit-coach/domain/entities/user';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  /**
   * ユーザーを作成する
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const input: CreateUserInput = req.body;
      const user = await this.createUserUseCase.execute(input);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * ユーザーを更新する
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserInput = req.body;
      const user = await this.updateUserUseCase.execute(id, input);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * ユーザーを削除する
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * ユーザーを取得する
   */
  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * メールアドレスでユーザーを取得する
   */
  async getByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const user = await this.getUserUseCase.executeByEmail(email);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * すべてのユーザーを取得する
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getUserUseCase.executeAll();
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * ユーザーを認証する
   */
  async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const input: AuthUserInput = req.body;
      const user = await this.authenticateUserUseCase.execute(input);
      res.json(user);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}
