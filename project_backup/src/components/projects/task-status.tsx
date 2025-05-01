import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskStatusProps {
  status: 'backlog' | 'in_progress' | 'done';
  className?: string;
}

const statusConfig = {
  backlog: {
    label: 'バックログ',
    className: 'bg-gray-100 text-gray-800',
  },
  in_progress: {
    label: '進行中',
    className: 'bg-blue-100 text-blue-800',
  },
  done: {
    label: '完了',
    className: 'bg-green-100 text-green-800',
  },
};

export function TaskStatus({ status, className }: TaskStatusProps) {
  const config = statusConfig[status];

  return (
    <Badge
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
} 