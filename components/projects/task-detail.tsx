'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Tag,
  User,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Task, TaskStatus, TaskPriority } from './task-list';

interface TaskDetailProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export function TaskDetail({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}: TaskDetailProps) {
  if (!task) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '期限なし';
    const date = new Date(dateString);
    return format(date, 'yyyy年MM月dd日', { locale: ja });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { locale: ja, addSuffix: true });
  };

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

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onStatusChange && task) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="mr-8">{task.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(task.status)}>
                {getStatusText(task.status)}
              </Badge>
              <Badge className={getPriorityColor(task.priority)} variant="outline">
                <span className="flex items-center gap-1">
                  {getPriorityIcon(task.priority)}
                  {getPriorityText(task.priority)}優先度
                </span>
              </Badge>
            </div>
          </div>
          <DialogDescription>
            タスクID: {task.id}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">説明</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md whitespace-pre-wrap">
                {task.description}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">日付情報</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    期限日: {formatDate(task.dueDate)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    作成日: {formatDate(task.createdAt)} ({formatRelativeDate(task.createdAt)})
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    更新日: {formatDate(task.updatedAt)} ({formatRelativeDate(task.updatedAt)})
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">担当者</h3>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {task.assigneeName ? task.assigneeName : '未割り当て'}
                </span>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ステータスを変更</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={task.status === 'todo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('todo')}
              >
                未着手
              </Button>
              <Button
                variant={task.status === 'in-progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('in-progress')}
              >
                進行中
              </Button>
              <Button
                variant={task.status === 'review' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('review')}
              >
                レビュー中
              </Button>
              <Button
                variant={task.status === 'done' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('done')}
              >
                完了
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>削除</span>
            </Button>
          )}
          <div className="flex-1"></div>
          <Button
            variant="outline"
            onClick={onClose}
          >
            閉じる
          </Button>
          {onEdit && (
            <Button
              onClick={() => {
                onEdit(task);
                onClose();
              }}
              className="flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" />
              <span>編集</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 