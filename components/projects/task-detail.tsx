'use client';

import React, { useState } from 'react';
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
  MessageSquare,
  History,
  X,
  ArrowLeftCircle,
  Plus,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Task, TaskStatus, TaskPriority } from './task-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Checkbox,
  CheckboxChecked,
  CheckboxIndicator,
} from '@/components/ui/checkbox';
import {
  Input,
  InputLabel,
  InputMessage,
  InputPlaceholder,
  InputPrefix,
  InputRoot,
  InputSlot,
  InputSuffix,
  InputWrapper,
} from '@/components/ui/input';

// 関連タスクの型を追加
type RelatedTask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeName?: string;
};

// サブタスクの型を追加
type Subtask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeName?: string;
  isCompleted: boolean;
};

interface TaskDetailProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onCommentSubmit?: (taskId: string, comment: string) => void;
  relatedTasks?: RelatedTask[];
  subtasks?: Subtask[]; // サブタスクのプロパティを追加
  onSubtaskAdd?: (taskId: string, title: string) => void;
  onSubtaskEdit?: (taskId: string, subtaskId: string, title: string) => void;
  onSubtaskDelete?: (taskId: string, subtaskId: string) => void;
  onSubtaskStatusChange?: (taskId: string, subtaskId: string, isCompleted: boolean) => void;
}

// 関連タスクの表示用コンポーネントを追加
function RelatedTasksList({ tasks }: { tasks: RelatedTask[] }) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card key={task.id} className="p-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">{task.title}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {getStatusText(task.status)}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {getPriorityText(task.priority)}優先度
                </Badge>
                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                  </span>
                )}
                {task.assigneeName && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {task.assigneeName}
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeftCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// サブタスクの表示用コンポーネントを追加
function SubtaskItem({
  subtask,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  subtask: Subtask;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (isCompleted: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
      <Checkbox
        checked={subtask.isCompleted}
        onCheckedChange={(checked) => onStatusChange(checked as boolean)}
        className="h-4 w-4"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${subtask.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
          {subtask.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className={getStatusColor(subtask.status)}>
            {getStatusText(subtask.status)}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(subtask.priority)}>
            {getPriorityText(subtask.priority)}優先度
          </Badge>
          {subtask.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(subtask.dueDate)}
            </span>
          )}
          {subtask.assigneeName && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {subtask.assigneeName}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// サブタスク追加フォームのコンポーネントを追加
function SubtaskForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
      <Input
        placeholder="サブタスクを追加..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="sm" disabled={!title.trim()}>
        追加
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onCancel}>
        キャンセル
      </Button>
    </form>
  );
}

export function TaskDetail({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onCommentSubmit,
  relatedTasks = [],
  subtasks = [], // デフォルト値を空配列に設定
  onSubtaskAdd,
  onSubtaskEdit,
  onSubtaskDelete,
  onSubtaskStatusChange,
}: TaskDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);

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

  const handleCommentSubmit = () => {
    if (newComment.trim() && onCommentSubmit) {
      onCommentSubmit(task.id, newComment);
      setNewComment('');
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

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">詳細</TabsTrigger>
            <TabsTrigger value="comments">コメント</TabsTrigger>
            <TabsTrigger value="history">履歴</TabsTrigger>
            <TabsTrigger value="related">関連タスク</TabsTrigger>
            <TabsTrigger value="subtasks">サブタスク</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-4">
              {task.comments && task.comments.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  {task.comments.map((comment) => (
                    <Card key={comment.id} className="mb-4">
                      <CardHeader className="p-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{comment.authorName}</p>
                            <p className="text-xs text-gray-500">
                              {formatRelativeDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  コメントはまだありません
                </div>
              )}

              <div className="space-y-2">
                <Textarea
                  placeholder="コメントを入力..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                  className="w-full"
                >
                  コメントを投稿
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {task.history && task.history.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                {task.history.map((item) => (
                  <Card key={item.id} className="mb-4">
                    <CardHeader className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{item.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.userName}</p>
                          <p className="text-xs text-gray-500">
                            {formatRelativeDate(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-sm">
                        {item.action === 'status_changed' && (
                          <>
                            ステータスを「{getStatusText(item.previousValue as TaskStatus)}」から「{getStatusText(item.newValue as TaskStatus)}」に変更しました
                          </>
                        )}
                        {item.action === 'assignee_changed' && (
                          <>
                            担当者を「{item.previousValue || '未割り当て'}」から「{item.newValue || '未割り当て'}」に変更しました
                          </>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            ) : (
              <div className="text-center text-gray-500 py-8">
                履歴はまだありません
              </div>
            )}
          </TabsContent>

          <TabsContent value="related" className="space-y-4">
            <div className="space-y-4">
              {relatedTasks.length > 0 ? (
                <RelatedTasksList tasks={relatedTasks} />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  関連タスクはありません
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subtasks" className="space-y-4">
            <div className="space-y-4">
              {subtasks.length > 0 ? (
                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <SubtaskItem
                      key={subtask.id}
                      subtask={subtask}
                      onEdit={() => setEditingSubtaskId(subtask.id)}
                      onDelete={() => onSubtaskDelete?.(task!.id, subtask.id)}
                      onStatusChange={(isCompleted) =>
                        onSubtaskStatusChange?.(task!.id, subtask.id, isCompleted)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  サブタスクはありません
                </div>
              )}

              {isAddingSubtask ? (
                <SubtaskForm
                  onSubmit={(title) => {
                    onSubtaskAdd?.(task!.id, title);
                    setIsAddingSubtask(false);
                  }}
                  onCancel={() => setIsAddingSubtask(false)}
                />
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsAddingSubtask(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  サブタスクを追加
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

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