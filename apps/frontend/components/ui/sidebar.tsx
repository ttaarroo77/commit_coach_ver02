import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Clock,
  BarChart2,
  Settings,
  LogOut
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
  { href: '/projects', icon: FolderKanban, label: 'プロジェクト' },
  { href: '/calendar', icon: Calendar, label: 'カレンダー' },
  { href: '/timetracking', icon: Clock, label: 'タイムトラッキング' },
  { href: '/reports', icon: BarChart2, label: 'レポート' },
];

const bottomMenuItems = [
  { href: '/settings', icon: Settings, label: '設定' },
  { href: '/logout', icon: LogOut, label: 'ログアウト' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[240px] flex-col bg-[#0A0C10] border-r border-gray-800">
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-semibold text-white">Commit Coach</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-[#1F2937] hover:text-white',
                pathname === item.href ? 'bg-[#1F2937] text-white' : 'transparent'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-gray-800">
        <nav className="grid gap-1 p-2">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-[#1F2937] hover:text-white',
                pathname === item.href ? 'bg-[#1F2937] text-white' : 'transparent'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 