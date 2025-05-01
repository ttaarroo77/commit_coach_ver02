'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { TaskItem, Task } from './task-item';

interface TaskListProps {
  title: string;
  tasks: Task[];
  emptyMessage?: string;
  showViewAll?: boolean;
  maxItems?: number;
}

export function TaskList({ title, tasks, emptyMessage = 'タスクはありません', showViewAll = true, maxItems = 5 }: TaskListProps) {
  const [visibleTasks, setVisibleTasks] = useState(tasks.slice(0, maxItems));

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    // 実際の実装ではここでタスクのステータスを更新します
    setVisibleTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            追加
          </Button>
          {showViewAll && (
            <Button variant="ghost" size="sm" className="text-sm h-8">
              すべて表示 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {visibleTasks.length > 0 ? (
        <div className="space-y-1">
          {visibleTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          <Button variant="outline" size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-1" />
            タスクを追加
          </Button>
        </div>
      )}
    </div>
  );
}
