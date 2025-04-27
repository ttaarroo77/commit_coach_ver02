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
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';

// 登録フォームのバリデーションスキーマ
const registerSchema = z
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

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        throw error;
      }

      // 登録成功時、確認ページにリダイレクト
      router.push('/register/confirmation');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'アカウント登録に失敗しました';
      setErrorMessage(errorMsg);
      console.error('登録エラー:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">アカウント登録</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          必要情報を入力して新規アカウントを作成してください
        </p>
      </div>
      
      {errorMessage && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            type="text"
            placeholder="山田 太郎"
            aria-invalid={errors.name ? 'true' : 'false'}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
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
        
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            {...register('terms')} 
          />
          <Label 
            htmlFor="terms" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <span>
              <Link 
                href="/terms" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                利用規約
              </Link>
              と
              <Link 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                プライバシーポリシー
              </Link>
              に同意します
            </span>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500">{errors.terms.message}</p>
        )}
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '登録中...' : 'アカウント作成'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          すでにアカウントをお持ちの場合は{' '}
        </span>
        <Link 
          href="/login" 
          className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ログイン
        </Link>
      </div>
    </div>
  );
}
