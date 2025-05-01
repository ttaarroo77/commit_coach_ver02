'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Settings, 
  ChevronRight,
  ChevronLeft,
  CheckSquare,
  Clock,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/animations';

const sidebarItems = [
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
    title: 'タスク',
    href: '/tasks',
    icon: CheckSquare,
    disabled: true
  },
  {
    title: 'カレンダー',
    href: '/calendar',
    icon: Calendar,
    disabled: true
  },
  {
    title: 'タイムトラッキング',
    href: '/time-tracking',
    icon: Clock,
    disabled: true
  },
  {
    title: 'レポート',
    href: '/reports',
    icon: BarChart,
    disabled: true
  },
  {
    title: '設定',
    href: '/settings',
    icon: Settings,
    disabled: true
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <FadeIn className="relative">
      <aside 
        className={cn(
          "h-screen fixed top-0 left-0 z-30 flex flex-col border-r bg-background pt-16 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col flex-grow p-4 space-y-4 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild={!item.disabled}
                disabled={item.disabled}
                className={cn(
                  "justify-start",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  collapsed && "justify-center px-0"
                )}
              >
                {!item.disabled ? (
                  <Link href={item.href} className={cn("flex items-center", collapsed ? "justify-center" : "justify-start w-full")}>
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </Link>
                ) : (
                  <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-start w-full")}>
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </div>
                )}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-20 translate-x-1/2 rounded-full border shadow-md bg-background"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </aside>
      
      {/* スペーサー - サイドバーの幅と同じ */}
      <div className={cn("shrink-0 transition-all duration-300", collapsed ? "w-16" : "w-64")} />
    </FadeIn>
  );
}
