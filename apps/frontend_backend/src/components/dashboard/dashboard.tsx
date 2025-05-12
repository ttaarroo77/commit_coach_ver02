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
import { ProjectForm } from './ProjectForm';
import Modal from '@/components/ui/modal';

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

  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-44 transform bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:w-44`}
      >
        <div className="flex h-full flex-col">
          {/* サイドバーヘッダー */}
          <div className="flex h-8 items-center justify-between px-2 py-1 border-b border-gray-100">
            <Link href="/dashboard" className="flex items-center">
              <div className="h-4 w-4 rounded-[2px] bg-[#31A9B8] text-white flex items-center justify-center mr-1 text-[8px] font-medium">
                CC
              </div>
              <span className="text-[10px] font-medium text-gray-700">Commit Coach</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden -mr-1 h-4 w-4 p-0">
              <X className="h-2.5 w-2.5" />
            </Button>
          </div>

          {/* サイドバーコンテンツ */}
          <div className="flex-1 overflow-auto py-1">
            <nav className="space-y-0 px-1.5">
              {[
                { name: 'ダッシュボード', href: '/dashboard', icon: <Home className="h-2.5 w-2.5" /> },
                { name: 'タスク', href: '/tasks', icon: <CheckSquare className="h-2.5 w-2.5" /> },
                { name: 'プロジェクト', href: '/projects', icon: <FolderKanban className="h-2.5 w-2.5" /> },
                { name: 'チーム', href: '/team', icon: <Users className="h-2.5 w-2.5" /> },
                { name: 'レポート', href: '/reports', icon: <BarChart3 className="h-2.5 w-2.5" /> },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-1.5 py-0.5 text-[8px] font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-[2px] transition-colors ${item.href === '/dashboard' ? 'bg-gray-50 text-gray-800 font-medium' : ''}`}
                >
                  <div className="mr-1.5 text-gray-500">{item.icon}</div>
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* サイドバーフッター */}
          <div className="border-t border-gray-100 px-1.5 py-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-1 py-0.5 h-auto hover:bg-gray-50 rounded-[2px]">
                  <div className="flex items-center">
                    <Avatar className="h-3.5 w-3.5 mr-1 ring-1 ring-offset-0 ring-gray-100">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-[6px]">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-[8px] font-medium text-gray-700">{getUserName()}</p>
                      <p className="text-[6px] text-gray-400 truncate max-w-[80px] md:max-w-[100px]">{user?.email}</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 p-0.5">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center text-[8px] py-0.5">
                    <User className="mr-1 h-2.5 w-2.5" />
                    <span>プロフィール</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center text-[8px] py-0.5">
                    <Settings className="mr-1 h-2.5 w-2.5" />
                    <span>設定</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-0.5" />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-[8px] py-0.5 text-red-500">
                  <LogOut className="mr-1 h-2.5 w-2.5" />
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
        <header className="bg-white border-b border-gray-100 h-6 flex items-center justify-between px-1.5 sticky top-0 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-0.5 md:hidden h-4 w-4 p-0">
              {sidebarOpen ? <X className="h-2.5 w-2.5" /> : <Menu className="h-2.5 w-2.5" />}
            </Button>
            <h1 className="text-[8px] font-medium text-gray-700">ダッシュボード</h1>
          </div>

          <div className="flex items-center space-x-0.5">
            {/* モバイル用のアイコンボタン */}
            <Button variant="ghost" size="icon" className="md:hidden h-4 w-4 p-0">
              <HelpCircle className="h-2.5 w-2.5" />
            </Button>
            <Button size="icon" className="md:hidden h-4 w-4 p-0 bg-[#31A9B8] hover:bg-[#2A95A2]">
              <PlusCircle className="h-2.5 w-2.5" />
            </Button>

            {/* デスクトップ用のテキスト付きボタン */}
            <Button variant="outline" size="sm" className="hidden md:flex items-center h-4 text-[8px] px-1 py-0">
              <HelpCircle className="h-2 w-2 mr-0.5" />
              <span>ヘルプ</span>
            </Button>
            <Button size="sm" className="hidden md:flex items-center h-4 text-[8px] px-1 py-0 bg-[#31A9B8] hover:bg-[#2A95A2]">
              <PlusCircle className="h-2 w-2 mr-0.5" />
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

      {/* モーダルでフォーム表示 */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ProjectForm
            onAdd={async () => {
              // ここにフォーム送信後の処理を追加
              setShowModal(false);
            }}
            loading={false}
            newName=""
            setNewName={() => { }}
            newDesc=""
            setNewDesc={() => { }}
          />
        </Modal>
      )}
    </div>
  );
}
