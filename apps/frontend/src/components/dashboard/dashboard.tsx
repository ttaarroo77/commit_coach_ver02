"use client";

import { useState, useEffect } from 'react';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronRight, ChevronLeft, User, Settings, LogOut, Home, CheckSquare, FolderKanban, Users, BarChart3, HelpCircle, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function Dashboard() {
  // モバイルではデフォルトでサイドバーを閉じる
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // 画面サイズに応じてサイドバーの表示状態を調整
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // 初期化時に一度実行
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };
  
  // ユーザー名の取得（メールアドレスの@より前の部分）
  const getUserName = () => {
    if (!user?.email) return 'User';
    return user.email.split('@')[0];
  };
  
  // イニシャルの取得（メールアドレスの最初の文字）
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:w-72 lg:w-64`}
      >
        <div className="flex h-full flex-col">
          {/* サイドバーヘッダー */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-[#31A9B8] text-white flex items-center justify-center mr-2">
                CC
              </div>
              <span className="text-lg font-semibold">Commit Coach</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* サイドバーコンテンツ */}
          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              {[
                { name: 'ダッシュボード', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
                { name: 'タスク', href: '/tasks', icon: <CheckSquare className="h-5 w-5" /> },
                { name: 'プロジェクト', href: '/projects', icon: <FolderKanban className="h-5 w-5" /> },
                { name: 'チーム', href: '/team', icon: <Users className="h-5 w-5" /> },
                { name: 'レポート', href: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <div className="mr-3 text-gray-500">{item.icon}</div>
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* サイドバーフッター */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 ring-2 ring-offset-2 ring-gray-100">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-1 overflow-hidden">
                      <p className="text-sm font-medium">{getUserName()}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-[180px] lg:max-w-[120px]">{user?.email}</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>プロフィール</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>設定</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ログアウト</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-semibold">ダッシュボード</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* モバイル用のアイコンボタン */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button size="icon" className="md:hidden bg-[#31A9B8] hover:bg-[#2A95A2]">
              <PlusCircle className="h-5 w-5" />
            </Button>
            
            {/* デスクトップ用のテキスト付きボタン */}
            <Button variant="outline" size="sm" className="hidden md:flex items-center">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>ヘルプ</span>
            </Button>
            <Button size="sm" className="hidden md:flex items-center bg-[#31A9B8] hover:bg-[#2A95A2]">
              <PlusCircle className="h-4 w-4 mr-1" />
              <span>新規タスク</span>
            </Button>
          </div>
        </header>
        
        {/* スクロール可能なコンテンツエリア */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <DashboardContent />
        </main>
      </div>
      
      {/* モバイル用オーバーレイ - アニメーション付き */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden animate-fadeIn" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
