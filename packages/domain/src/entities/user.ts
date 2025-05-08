import { z } from 'zod';

/**
 * ユーザーロールの列挙型
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  TEAM_LEAD = 'team_lead',
}

/**
 * ユーザーのスキーマ定義
 */
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.nativeEnum(UserRole),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * ユーザー作成のスキーマ定義
 */
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * ユーザー更新のスキーマ定義
 */
export const updateUserSchema = createUserSchema.partial();

/**
 * 認証ユーザーのスキーマ定義
 */
export const authUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * ユーザーのタイプ定義
 */
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AuthUserInput = z.infer<typeof authUserSchema>;
