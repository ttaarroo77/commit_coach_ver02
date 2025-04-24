import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  }),
});

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string()
      .min(8, 'パスワードは8文字以上である必要があります')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'パスワードは少なくとも1つの大文字、小文字、数字、特殊文字を含む必要があります'
      ),
    name: z.string().min(1, '名前は必須です'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const resetPasswordRequestSchema = z.object({
  body: z.object({
    email: z.string().email('有効なメールアドレスを入力してください'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string()
      .min(8, 'パスワードは8文字以上である必要があります')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'パスワードは少なくとも1つの大文字、小文字、数字、特殊文字を含む必要があります'
      ),
  }),
}); 