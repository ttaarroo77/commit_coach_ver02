'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

// パスワード更新フォームのバリデーションスキーマ
const updatePasswordSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export default function PasswordUpdatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasValidHash, setHasValidHash] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // URLハッシュパラメータの検証
  useEffect(() => {
    const checkHash = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage('無効なリンクまたは期限切れです。再度パスワードリセットを行ってください。');
          setHasValidHash(false);
        } else {
          setHasValidHash(true);
        }
      } catch (error) {
        console.error('セッション検証エラー:', error);
        setErrorMessage('セッションの検証中にエラーが発生しました。');
        setHasValidHash(false);
      }
    };

    checkHash();
  }, []);

  const onSubmit = async (data: UpdatePasswordFormValues) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setIsSuccess(false);

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // パスワード更新成功
      setIsSuccess(true);
      
      // 3秒後にログインページにリダイレクト
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'パスワードの更新に失敗しました';
      setErrorMessage(errorMsg);
      console.error('パスワード更新エラー:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">パスワード更新</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          新しいパスワードを設定してください。
        </p>
      </div>
      
      {errorMessage && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}
      
      {isSuccess && (
        <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
          パスワードが正常に更新されました。数秒後にログインページにリダイレクトします。
        </div>
      )}
      
      {hasValidHash ? (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="password">新しいパスワード</Label>
            <Input
              id="password"
              type="password"
              aria-invalid={errors.password ? 'true' : 'false'}
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                8文字以上、大文字・小文字・数字を含める必要があります
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード（確認）</Label>
            <Input
              id="confirmPassword"
              type="password"
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || isSuccess}
          >
            {isLoading ? '更新中...' : 'パスワードを更新'}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col space-y-3">
          <Button asChild variant="outline">
            <Link href="/password/reset">パスワードリセットをやり直す</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/login">ログインページに戻る</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
