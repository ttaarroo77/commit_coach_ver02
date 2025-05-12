"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordResetForm } from '@/components/auth/password-reset-form';
import { useAuth } from '@/contexts/auth-context';
import { Toaster } from 'sonner';

export default function ForgotPasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 認証済みユーザーはダッシュボードにリダイレクト
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md">
        <PasswordResetForm />
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
