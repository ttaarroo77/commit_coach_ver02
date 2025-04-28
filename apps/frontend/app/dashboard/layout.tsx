'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ListTodo, 
  FolderKanban, 
  MessageSquareText, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarItem = ({ href, icon, label, isActive }: SidebarItemProps) => {
  return (
    <Link href={href} className="w-full">
      <Button
        variant={isActive ? 'default' : 'ghost'}
        className={`w-full justify-start gap-2 ${isActive ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* サイドバー */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Commit Coach</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">タスク管理ツール</p>
          </div>
          
          <nav className="space-y-2 flex-1">
            <SidebarItem 
              href="/dashboard" 
              icon={<LayoutDashboard size={18} />} 
              label="ダッシュボード" 
              isActive={pathname === '/dashboard'} 
            />
            <SidebarItem 
              href="/dashboard/tasks" 
              icon={<ListTodo size={18} />} 
              label="タスク" 
              isActive={pathname === '/dashboard/tasks'} 
            />
            <SidebarItem 
              href="/dashboard/projects" 
              icon={<FolderKanban size={18} />} 
              label="プロジェクト" 
              isActive={pathname === '/dashboard/projects'} 
            />
            <SidebarItem 
              href="/dashboard/ai-coach" 
              icon={<MessageSquareText size={18} />} 
              label="AIコーチ" 
              isActive={pathname === '/dashboard/ai-coach'} 
            />
          </nav>
          
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <SidebarItem 
              href="/dashboard/settings" 
              icon={<Settings size={18} />} 
              label="設定" 
              isActive={pathname === '/dashboard/settings'} 
            />
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>ログアウト</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
