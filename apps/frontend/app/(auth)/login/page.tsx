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
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';

// ログインフォームのバリデーションスキーマ
const loginSchema = z.object({
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

type LoginFormValues = z.infer<typeof loginSchema>;

// クライアントサイドのみのコンポーネント
function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      console.log('ログイン試行:', { email: data.email });
      
      // まず、現在のセッションをクリア
      await supabase.auth.signOut();
      
      // ログイン処理
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      console.log('Supabase認証応答:', { authData, error });

      if (error) {
        // エラーメッセージを日本語化
        if (error.message === 'Invalid login credentials') {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }
        throw error;
      }

      // セッション情報を取得して確認
      const { data: { session } } = await supabase.auth.getSession();
      console.log('ログイン後のセッション:', session);
      
      if (session) {
        console.log('ログイン成功、リダイレクト開始...');
        // ログイン成功時、ダッシュボードにリダイレクト
        // window.location.href を使用して強制的にリダイレクト
        window.location.href = '/dashboard';
        return;
      } else {
        console.error('セッションが存在しません');
        
        // 開発環境では、メール確認なしでログインできるようにする
        if (process.env.NODE_ENV === 'development') {
          console.log('開発環境: メール確認をスキップしてダッシュボードへリダイレクト');
          window.location.href = '/dashboard';
          return;
        }
        
        setErrorMessage('メールアドレスの確認が必要です。メールボックスを確認してください。');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'ログインに失敗しました';
      setErrorMessage(errorMsg);
      console.error('ログインエラー:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">ログイン</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          アカウント情報を入力してログインしてください
        </p>
      </div>
      
      {errorMessage && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {errorMessage}
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
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">パスワード</Label>
            <Link 
              href="/password/reset" 
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              パスワードを忘れた場合
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            aria-invalid={errors.password ? 'true' : 'false'}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => {
              const isChecked = checked === true;
              setRememberMe(isChecked);
              // React Hook Form の値も更新
              setValue('remember', isChecked);
            }}
          />
          <Label 
            htmlFor="remember" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ログイン状態を保持する
          </Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          アカウントをお持ちでない場合は{' '}
        </span>
        <Link 
          href="/register" 
          className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          登録
        </Link>
      </div>
    </div>
  );
}

// ページコンポーネント
export default function LoginPage() {
  // クライアントサイドでのみレンダリングするためのフラグ
  const [isMounted, setIsMounted] = useState(false);
  
  // マウント後にのみレンダリングする
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <>
      {/* サーバーサイドでは基本的なレイアウトのみをレンダリング */}
      {!isMounted && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">ログイン</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              アカウント情報を入力してログインしてください
            </p>
          </div>
          <div className="h-64 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
        </div>
      )}
      
      {/* クライアントサイドでのみフォームをレンダリング */}
      {isMounted && <LoginForm />}
    </>
  );
}
