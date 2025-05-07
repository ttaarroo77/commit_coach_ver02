"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, ChevronDown, ChevronRight, Home, User, Settings, LogOut, Plus, CheckSquare, FolderKanban, Users, BarChart3 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function Sidebar() {
  // モバイルではデフォルトでサイドバーを閉じる
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState(""); // 現在のパスを保存するステート
  const { user, signOut } = useAuth();
  const router = useRouter();

  // プロジェクトリストの状態
  // ここ、どうやった動的にできるか、分かってない
  const [projects, setProjects] = useState([
    {
      id: "web-app",
      name: "ウェブアプリ開発",
      color: "#31A9B8",
      href: "/projects/web-app",
    },
    {
      id: "mobile-app",
      name: "モバイルアプリ開発",
      color: "#258039",
      href: "/projects/mobile-app",
    },
    {
      id: "design",
      name: "デザインプロジェクト",
      color: "#F5BE41",
      href: "/projects/design",
    },we
  ])

  // 現在のURLからアクティブなプロジェクトを特定
  const [activeProject, setActiveProject] = useState("")

  // クライアントサイドでの初期化処理をまとめて実行
  useEffect(() => {
    // 現在のパスを取得
    setActivePath(window.location.pathname);

    // アクティブなプロジェクトを特定
    const path = window.location.pathname;
    const projectId = path.split("/projects/")[1];
    if (projectId) {
      setActiveProject(projectId);
    }

    // 画面サイズに応じてサイドバーの表示状態を調整
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
    <>
      {/* サイドバー */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 transform bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:w-56`}
      >
        <div className="flex h-full flex-col">
          {/* サイドバーヘッダー */}
          <div className="flex h-14 items-center justify-between px-4 py-2 border-b border-gray-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#31A9B8] text-white flex items-center justify-center text-xs font-medium">
                C
              </div>
              <span className="text-sm font-semibold text-gray-800">コミットコーチ</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* サイドバーコンテンツ */}
          <div className="flex-1 overflow-auto py-3">
            {/* プロジェクトセクション */}
            <div className="px-3 mb-2">
              <h2 className="text-xs font-semibold uppercase text-gray-500">プロジェクト</h2>
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* マイプロジェクトセクション */}
            <div className="space-y-1 px-3">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>マイプロジェクト</span>
              </Button>
              <div className="ml-4 space-y-1">
                {projects.map((project) => (
                  <Link key={project.id} href={project.href} className="block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start gap-2 ${activeProject === project.id ? `text-[${project.color}]` : "text-gray-700"
                        }`}
                    >
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }}></div>
                      <span>{project.name}</span>
                    </Button>
                  </Link>
                ))}
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>新しいプロジェクト</span>
                </Button>
              </div>
            </div>

            {/* ナビゲーションリンク */}
            <div className="mt-auto px-3">
              <div className="space-y-1">
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    <span>ダッシュボード</span>
                  </Button>
                </Link>
                <Link href="/mypage" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    <span>マイページ</span>
                  </Button>
                </Link>
                <Link href="/settings" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>設定</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* サイドバーフッター */}
          <div className="border-t border-gray-100 px-3 py-2">
            <Link href="/" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                <span>ログアウト</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden animate-fadeIn"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  )
}
