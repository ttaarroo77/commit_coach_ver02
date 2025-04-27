import { z } from 'zod';

// ログインフォームのバリデーションスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上必要です')
    .max(72, 'パスワードは72文字以下にしてください'),
  remember: z.boolean().optional(),
});

// 登録フォームのバリデーションスキーマ
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, '名前は必須です')
      .max(100, '名前は100文字以下にしてください'),
    email: z
      .string()
      .email('有効なメールアドレスを入力してください')
      .min(1, 'メールアドレスは必須です'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上必要です')
      .max(72, 'パスワードは72文字以下にしてください')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'パスワードには少なくとも1つの大文字、小文字、数字を含める必要があります'
      ),
    confirmPassword: z
      .string()
      .min(1, 'パスワードの確認は必須です'),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: '利用規約とプライバシーポリシーに同意する必要があります',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// パスワードリセットフォームのバリデーションスキーマ
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
});

// 型定義のエクスポート
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
