'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Clock, MoreVertical, Plus, ClipboardList, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assigneeId?: string;
  assigneeName?: string;
  projectId: string;
  tags?: string[];
};

interface TaskListProps {
  tasks: Task[];
  projectId: string;
  onTaskCreate?: () => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskView?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export function TaskList({
  tasks,
  projectId,
  onTaskCreate,
  onTaskEdit,
  onTaskDelete,
  onTaskView,
  onStatusChange,
}: TaskListProps) {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return '未着手';
      case 'in-progress':
        return '進行中';
      case 'review':
        return 'レビュー中';
      case 'done':
        return '完了';
      default:
        return status;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityText = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return '低';
      case 'medium':
        return '中';
      case 'high':
        return '高';
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '期限なし';
    const date = new Date(dateString);
    return format(date, 'yyyy年MM月dd日', { locale: ja });
  };

  const handleStatusChange = (taskId: string, checked: boolean) => {
    if (onStatusChange) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const newStatus: TaskStatus = checked ? 'done' : 'todo';
        onStatusChange(taskId, newStatus);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>タスク一覧</CardTitle>
          <CardDescription>プロジェクトのタスクを管理します</CardDescription>
        </div>
        {onTaskCreate && (
          <Button onClick={onTaskCreate} className="flex items-center gap-1">
            <Plus size={16} />
            <span>タスク追加</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <FadeIn>
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">タスクがありません</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                このプロジェクトにはまだタスクがありません
              </p>
              {onTaskCreate && (
                <div className="mt-6">
                  <Button onClick={onTaskCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    タスク追加
                  </Button>
                </div>
              )}
            </div>
          </FadeIn>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">状態</TableHead>
                  <TableHead>タスク名</TableHead>
                  <TableHead>優先度</TableHead>
                  <TableHead>期限日</TableHead>
                  <TableHead>担当者</TableHead>
                  <TableHead className="w-[80px]">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <StaggerContainer>
                  {tasks.map((task) => (
                    <StaggerItem key={task.id}>
                      <TableRow
                        key={task.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                        onClick={() => onTaskView && onTaskView(task.id)}
                        data-testid="task-row"
                      >
                        <TableCell>
                          <Checkbox
                            checked={task.status === 'done'}
                            onCheckedChange={(checked) => {
                              handleStatusChange(task.id, checked as boolean);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{task.title}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge className={getStatusColor(task.status)}>
                              {getStatusText(task.status)}
                            </Badge>
                            {task.tags?.map(tag => (
                              <Badge key={tag} variant="outline" className="bg-primary/10 text-primary-foreground">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {task.assigneeName ? (
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-2">
                                {task.assigneeName.charAt(0)}
                              </div>
                              <span>{task.assigneeName}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">未割り当て</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">メニューを開く</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onTaskEdit && onTaskEdit(task);
                              }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>編集</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTaskDelete && onTaskDelete(task.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>削除</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}