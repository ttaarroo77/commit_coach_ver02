"use client";

import { useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.refresh();
      router.push('/projects');
    } catch (error) {
      console.error('Login error:', error);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      toast.error('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  const register = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success('登録が完了しました。確認メールを送信しました。');
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('登録に失敗しました。もう一度お試しください。');
      toast.error('登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.refresh();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setError('ログアウトに失敗しました。');
      toast.error('ログアウトに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      });

      if (error) {
        throw error;
      }

      toast.success('パスワードリセットのメールを送信しました。');
    } catch (error) {
      console.error('Password reset error:', error);
      setError('パスワードリセットに失敗しました。もう一度お試しください。');
      toast.error('パスワードリセットに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return {
    login,
    register,
    logout,
    resetPassword,
    isLoading,
    error,
  };
} 