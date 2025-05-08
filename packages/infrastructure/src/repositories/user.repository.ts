import { PrismaClient } from '@prisma/client';
import { User, CreateUserInput, UpdateUserInput, AuthUserInput } from '@commit-coach/domain/entities/user';
import { UserRepository } from '@commit-coach/domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
      },
    });

    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const data: any = {
      name: input.name,
      email: input.email,
      role: input.role,
    };

    if (input.password) {
      data.password = await bcrypt.hash(input.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async authenticate(input: AuthUserInput): Promise<User> {
    const user = await this.findByEmail(input.email);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error('パスワードが正しくありません');
    }

    return user;
  }

  async updateRole(id: string, role: User['role']): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    return user;
  }
}
