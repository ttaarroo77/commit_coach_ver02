'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from './components/login-form';

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="mt-2 text-gray-600">
            アカウントにログインして、プロジェクトを管理しましょう
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
