'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FadeIn } from '@/components/ui/animations';

const navItems = [
  {
    title: 'ダッシュボード',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'プロジェクト',
    href: '/projects',
    icon: FolderKanban
  },
  {
    title: 'カレンダー',
    href: '/calendar',
    icon: Calendar,
    disabled: true
  },
  {
    title: '設定',
    href: '/settings',
    icon: Settings,
    disabled: true
  }
];

export function MainNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClientComponentClient();
  
  // 画面サイズが変更されたときにモバイルメニューを閉じる
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <>
      {/* モバイルメニュートグル */}
      <div className="flex md:hidden items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* デスクトップナビゲーション */}
      <nav className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild={!item.disabled}
              disabled={item.disabled}
              className={cn(
                'flex items-center gap-2 px-3',
                pathname === item.href
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {!item.disabled ? (
                <Link href={item.href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ) : (
                <>
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </>
              )}
            </Button>
          );
        })}
        
        <Button
          variant="ghost"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 px-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>ログアウト</span>
        </Button>
      </nav>
      
      {/* モバイルナビゲーション */}
      {isMobileMenuOpen && (
        <FadeIn className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 z-50 md:hidden">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild={!item.disabled}
                  disabled={item.disabled}
                  className={cn(
                    'justify-start',
                    pathname === item.href
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
                      : 'text-gray-700 dark:text-gray-300'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {!item.disabled ? (
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <>
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </>
                  )}
                </Button>
              );
            })}
            
            <Button
              variant="ghost"
              className="justify-start text-gray-700 dark:text-gray-300"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>ログアウト</span>
            </Button>
          </nav>
        </FadeIn>
      )}
    </>
  );
}
