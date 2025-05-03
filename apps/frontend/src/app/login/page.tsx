"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '/Users/nakazawatarou/Documents/tarou/project/commit_coach/apps/frontend/src/components/auth/login-form';
import { useAuth } from '/Users/nakazawatarou/Documents/tarou/project/commit_coach/apps/frontend/src/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, error, login } = useAuth();

  // ログイン処理
  const handleLogin = (email: string, password: string) => {
    login(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}