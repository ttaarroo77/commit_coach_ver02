'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

// パスワードリセットフォームのバリデーションスキーマ
const resetPasswordSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function PasswordResetPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setIsSuccess(false);

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/password/update`,
      });

      if (error) {
        throw error;
      }

      // リセットメール送信成功
      setIsSuccess(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'パスワードリセットメールの送信に失敗しました';
      setErrorMessage(errorMsg);
      console.error('パスワードリセットエラー:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">パスワードリセット</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          アカウントに登録したメールアドレスを入力してください。
          パスワードリセット用のリンクをお送りします。
        </p>
      </div>
      
      {errorMessage && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}
      
      {isSuccess && (
        <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
          パスワードリセット用のメールを送信しました。メールの指示に従ってパスワードをリセットしてください。
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || isSuccess}
        >
          {isLoading ? '送信中...' : 'リセットリンクを送信'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <Link 
          href="/login" 
          className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ログインページに戻る
        </Link>
      </div>
    </div>
  );
}
