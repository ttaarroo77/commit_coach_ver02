"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LogoutButton } from '@/components/auth/logout-button';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  // ユーザーが存在するかどうかで認証状態を判断
  const isAuthenticated = user !== null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Commit Coach</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  ダッシュボード
                </Link>
                <Link 
                  href="/projects" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.startsWith('/projects') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  プロジェクト
                </Link>
                <Link 
                  href="/settings" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === '/settings' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  設定
                </Link>
                <div className="flex items-center space-x-2">
                  {user && (
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                  <LogoutButton variant="ghost" size="sm" />
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">ログイン</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">新規登録</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
