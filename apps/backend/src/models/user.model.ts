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
 * ユーザーの基本スキーマ
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('有効なメールアドレスを入力してください'),
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内にしてください').optional(),
  avatar_url: z.string().url('有効なURLを入力してください').optional(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  last_sign_in_at: z.string().datetime().optional(),
  team_id: z.string().uuid().optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).default('system'),
      notifications: z.boolean().default(true),
      language: z.string().default('ja'),
      timezone: z.string().default('Asia/Tokyo'),
    })
    .optional(),
  github_username: z.string().optional(),
  bio: z.string().max(500, '自己紹介は500文字以内にしてください').optional(),
  is_onboarded: z.boolean().default(false),
});

/**
 * プロフィール更新用スキーマ
 */
export const updateProfileSchema = userSchema
  .omit({
    id: true,
    email: true,
    created_at: true,
    updated_at: true,
    last_sign_in_at: true,
    role: true,
  })
  .partial();

/**
 * ユーザー認証用スキーマ
 */
export const authUserSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
});

/**
 * パスワードリセット用スキーマ
 */
export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, 'パスワードは8文字以上必要です'),
    confirmPassword: z.string().min(8, 'パスワードは8文字以上必要です'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

/**
 * ユーザーのタイプ定義
 */
export type User = z.infer<typeof userSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AuthUserInput = z.infer<typeof authUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default {
  userSchema,
  updateProfileSchema,
  authUserSchema,
  resetPasswordSchema,
};
