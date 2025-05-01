import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav
      className={cn(
        'flex items-center space-x-4 lg:space-x-6',
        className
      )}
    >
      <a
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        ホーム
      </a>
      <a
        href="/projects"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        プロジェクト
      </a>
      <a
        href="/tasks"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        タスク
      </a>
    </nav>
  );
} 