"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import { Toaster } from 'sonner';

export default function LoginPage() {
  const { user, loading, error, login } = useAuth();
  const router = useRouter();

  // 認証済みユーザーはダッシュボードにリダイレクト
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // ログイン処理
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md">
        <LoginForm onLogin={handleLogin} isLoading={loading} error={error} />
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}