"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';
import { Task } from '@/types/task';
import Link from 'next/link';

interface TaskSummaryCardProps {
  title: string;
  icon: 'clock' | 'alert';
  tasks: Task[];
  onToggleTaskStatus?: (taskId: string) => void;
}

export function TaskSummaryCard({ 
  title, 
  icon, 
  tasks, 
  onToggleTaskStatus 
}: TaskSummaryCardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 日付を更新する（毎分）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // 期限切れかどうかをチェック
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < currentDate;
  };

  // 期限までの日数を計算
  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const diffTime = due.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // 期限表示のテキストとスタイルを取得
  const getDueDateDisplay = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const daysUntil = getDaysUntilDue(dueDate);
    
    if (daysUntil === 0) {
      return {
        text: '今日期限',
        className: 'bg-orange-100 text-orange-800'
      };
    } else if (daysUntil && daysUntil < 0) {
      return {
        text: `${Math.abs(daysUntil)}日超過`,
        className: 'bg-red-100 text-red-800'
      };
    } else if (daysUntil && daysUntil <= 2) {
      return {
        text: `あと${daysUntil}日`,
        className: 'bg-yellow-100 text-yellow-800'
      };
    } else {
      return {
        text: new Date(dueDate).toLocaleDateString('ja-JP'),
        className: 'bg-blue-100 text-blue-800'
      };
    }
  };

  return (
    <Card className="h-full shadow-sm hover:shadow transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon === 'clock' ? (
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            )}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="ml-2 animate-fadeIn">
            {tasks.length}件
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300 animate-pulse" />
            <p>タスクはありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => {
              const dueDateDisplay = getDueDateDisplay(task.dueDate);
              
              return (
                <div key={task.id} className="flex items-start gap-2 group p-2 rounded-md hover:bg-gray-50 transition-colors">
                  {onToggleTaskStatus && (
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => onToggleTaskStatus(task.id)}
                      className="mt-1 h-5 w-5"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span 
                        className={`truncate ${task.status === 'completed' ? 'line-through text-gray-500' : ''} ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}`}
                      >
                        {task.title}
                      </span>
                      
                      <div className="flex flex-wrap gap-1 items-center">
                        {task.project && (
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {task.project}
                          </Badge>
                        )}
                        {dueDateDisplay && (
                          <Badge className={`shrink-0 text-xs ${dueDateDisplay.className}`}>
                            {dueDateDisplay.text}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {task.subtasks.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <span className="mr-1">サブタスク:</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` }}
                          />
                        </div>
                        <span className="ml-1">{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {tasks.length > 5 && (
              <Button variant="ghost" size="sm" className="w-full mt-2 hover:bg-gray-100 transition-colors" asChild>
                <Link href="/dashboard" className="flex items-center justify-center">
                  <span>すべて表示</span> <ChevronRight className="h-4 w-4 ml-1 animate-slideInFromRight" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
