import { z } from "zod"

// ログインフォームのバリデーションスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください" })
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(1, { message: "パスワードを入力してください" })
    .min(8, { message: "パスワードは8文字以上である必要があります" }),
})

// ユーザー登録フォームのバリデーションスキーマ
export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "名前を入力してください" }),
    email: z
      .string()
      .min(1, { message: "メールアドレスを入力してください" })
      .email({ message: "有効なメールアドレスを入力してください" }),
    password: z
      .string()
      .min(1, { message: "パスワードを入力してください" })
      .min(8, { message: "パスワードは8文字以上である必要があります" })
      .regex(/[a-z]/, { message: "少なくとも1つの小文字を含める必要があります" })
      .regex(/[A-Z]/, { message: "少なくとも1つの大文字を含める必要があります" })
      .regex(/[0-9]/, { message: "少なくとも1つの数字を含める必要があります" }),
    confirmPassword: z.string().min(1, { message: "確認用パスワードを入力してください" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードと確認用パスワードが一致しません",
    path: ["confirmPassword"],
  })

// パスワードリセットフォームのバリデーションスキーマ
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください" })
    .email({ message: "有効なメールアドレスを入力してください" }),
})

// バリデーションスキーマから型定義を生成
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
