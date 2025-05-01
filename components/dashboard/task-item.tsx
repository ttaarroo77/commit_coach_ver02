'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Tag, MoreHorizontal, AlertCircle } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  tags?: string[];
}

interface TaskItemProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => void;
}

export function TaskItem({ task, onStatusChange }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === 'done');

  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? 'done' : 'todo';
    setIsCompleted(checked);
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  // 期限切れかどうかを判定
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  // 優先度に応じた色を設定
  const priorityColor = {
    high: 'bg-red-500 dark:bg-red-600',
    medium: 'bg-amber-500 dark:bg-amber-600',
    low: 'bg-green-500 dark:bg-green-600',
  };

  // ステータスに応じた色を設定
  const statusColor = {
    todo: 'border-gray-200 dark:border-gray-700',
    in_progress: 'border-l-4 border-l-blue-500 dark:border-l-blue-600',
    done: 'bg-gray-50 dark:bg-gray-800 opacity-75',
  };

  return (
    <div className={`mb-3 rounded-lg border p-4 shadow-sm ${statusColor[task.status]}`}>
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          <Checkbox 
            checked={isCompleted} 
            onCheckedChange={handleStatusChange} 
            className="h-5 w-5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${priorityColor[task.priority]}`}></div>
            <h3 className={`font-medium truncate ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
              {task.title}
            </h3>
            {isOverdue && (
              <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900 px-2 py-0.5 text-xs text-red-800 dark:text-red-200">
                <AlertCircle className="mr-1 h-3 w-3" />
                期限切れ
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {task.due_date && (
              <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString('ja-JP')}
              </span>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                {task.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs text-blue-800 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
