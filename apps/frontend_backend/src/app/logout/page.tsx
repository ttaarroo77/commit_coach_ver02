"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
        toast.success('ログアウトしました');
        router.push('/login');
      } catch (error) {
        console.error('ログアウトエラー:', error);
        toast.error('ログアウトに失敗しました');
        // エラーが発生してもログインページにリダイレクト
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ログアウト中...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">ログアウト処理を実行しています。しばらくお待ちください。</p>
        </CardContent>
      </Card>
    </div>
  );
}
