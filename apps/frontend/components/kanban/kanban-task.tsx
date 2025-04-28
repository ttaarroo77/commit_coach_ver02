'use client';

import { useState, useRef, useCallback, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Circle,
  ChevronDown,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Task, TaskPriority } from '@/types/task';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FadeIn } from '@/components/ui/animations';

// 優先度に応じたバッジの色を定義
const priorityConfig: Record<TaskPriority, { label: string; variant: string }> = {
  high: { label: '高', variant: 'destructive' },
  medium: { label: '中', variant: 'warning' },
  low: { label: '低', variant: 'secondary' }
};

interface KanbanTaskProps {
  task: Task;
  onUpdate: (updatedTask: Partial<Task>) => void;
  onDelete: () => void;
}

function KanbanTaskComponent({ task, onUpdate, onDelete }: KanbanTaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [showSubtasks, setShowSubtasks] = useState(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // dnd-kit の useSortable フックを使用
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  });
  
  // ドラッグ中のスタイル
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  // 編集の開始
  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    // 次のティックでフォーカス
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 0);
  }, []);
  
  // 編集の保存
  const handleSaveEdit = useCallback(() => {
    if (editedTitle.trim()) {
      onUpdate({
        title: editedTitle,
        description: editedDescription,
        updatedAt: new Date().toISOString()
      });
    } else {
      // タイトルが空の場合は元に戻す
      setEditedTitle(task.title);
      setEditedDescription(task.description || '');
    }
    setIsEditing(false);
  }, [editedTitle, editedDescription, onUpdate, task.title, task.description]);
  
  // 編集のキャンセル
  const handleCancelEdit = useCallback(() => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setIsEditing(false);
  }, [task.title, task.description]);
  
  // 完了状態の切り替え
  const handleToggleComplete = useCallback(() => {
    onUpdate({
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    });
  }, [task.completed, onUpdate]);
  
  // サブタスクの完了状態の切り替え
  const handleToggleSubtaskComplete = useCallback((subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed } 
        : subtask
    );
    
    onUpdate({
      subtasks: updatedSubtasks,
      updatedAt: new Date().toISOString()
    });
  }, [task.subtasks, onUpdate]);
  
  // 期限切れかどうかを判定
  const isOverdue = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now && !task.completed;
  };
  
  // 完了したサブタスクの数
  const completedSubtasksCount = task.subtasks?.filter(subtask => subtask.completed).length || 0;
  const totalSubtasksCount = task.subtasks?.length || 0;
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "transition-all will-change-transform",
        isDragging && "z-10"
      )}
    >
      <Card className={cn(
        "border-l-4",
        task.completed ? "border-l-green-500" : 
        isOverdue() ? "border-l-red-500" : 
        "border-l-blue-500",
        task.completed && "bg-gray-50 dark:bg-gray-800/50"
      )}>
        <CardContent className="p-3">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                ref={titleInputRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-sm font-medium"
                placeholder="タスク名"
                autoFocus
              />
              
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="text-xs min-h-[60px]"
                placeholder="説明（任意）"
              />
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="w-full text-xs"
                  disabled={!editedTitle.trim()}
                >
                  保存
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="w-full text-xs"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleToggleComplete}
                      className="flex-shrink-0 text-gray-500 hover:text-blue-500 dark:text-gray-400"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    
                    <h3 
                      className={cn(
                        "text-sm font-medium cursor-move",
                        task.completed && "line-through text-gray-500 dark:text-gray-400"
                      )}
                      {...listeners}
                    >
                      {task.title}
                    </h3>
                  </div>
                  
                  {task.description && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleStartEditing}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {task.priority && (
                  <Badge 
                    variant={priorityConfig[task.priority].variant as any}
                    className="text-[10px] h-5"
                  >
                    {priorityConfig[task.priority].label}
                  </Badge>
                )}
                
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center text-[10px] text-gray-500 dark:text-gray-400",
                    isOverdue() && !task.completed && "text-red-500 dark:text-red-400"
                  )}>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {format(new Date(task.dueDate), 'MM/dd', { locale: ja })}
                    </span>
                    {isOverdue() && !task.completed && (
                      <AlertCircle className="h-3 w-3 ml-1 text-red-500" />
                    )}
                  </div>
                )}
                
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.tags.slice(0, 2).map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-[10px] h-5 bg-gray-100 dark:bg-gray-800"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {task.tags.length > 2 && (
                      <Badge 
                        variant="outline"
                        className="text-[10px] h-5"
                      >
                        +{task.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {totalSubtasksCount > 0 && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs p-1 h-6"
                    onClick={() => setShowSubtasks(!showSubtasks)}
                  >
                    <div className="flex items-center">
                      {showSubtasks ? (
                        <ChevronDown className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronRight className="h-3 w-3 mr-1" />
                      )}
                      <span>サブタスク</span>
                    </div>
                    <span className="text-gray-500">
                      {completedSubtasksCount}/{totalSubtasksCount}
                    </span>
                  </Button>
                  
                  {showSubtasks && (
                    <FadeIn className="mt-1 pl-4 space-y-1">
                      {task.subtasks?.map((subtask) => (
                        <div 
                          key={subtask.id}
                          className="flex items-center gap-2"
                        >
                          <button 
                            onClick={() => handleToggleSubtaskComplete(subtask.id)}
                            className="flex-shrink-0 text-gray-500 hover:text-blue-500 dark:text-gray-400"
                          >
                            {subtask.completed ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <Circle className="h-3 w-3" />
                            )}
                          </button>
                          <span 
                            className={cn(
                              "text-xs",
                              subtask.completed && "line-through text-gray-500 dark:text-gray-400"
                            )}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </FadeIn>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// メモ化されたコンポーネントをエクスポート
export const KanbanTask = memo(KanbanTaskComponent);
