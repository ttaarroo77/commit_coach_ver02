'use client';

import { useState, useRef, useCallback, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TaskDetailModal } from './task-detail-modal';
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
import { Task, TaskPriority, SubTask } from '@/types/task';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
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
  const handleToggleCompleted = useCallback(() => {
    onUpdate({
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    });
  }, [onUpdate, task.completed]);
  
  // 詳細モーダルを開く
  const handleOpenDetailModal = useCallback(() => {
    setIsDetailModalOpen(true);
  }, []);
  
  // 詳細モーダルを閉じる
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
  }, []);
  
  // タスク更新（詳細モーダルから）
  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    onUpdate(updatedTask);
  }, [onUpdate]);
  
  // サブタスクの表示切り替え
  const toggleSubtasks = useCallback(() => {
    setShowSubtasks(prev => !prev);
  }, []);
  
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
  const isOverdue = useCallback(() => {
    if (!task.dueDate || task.completed) return false;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    
    // 年月日のみで比較するため、時刻をリセット
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  }, [task.dueDate, task.completed]);
  
  // 期限までの日数を計算
  const getDaysUntilDue = useCallback(() => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    
    // 年月日のみで比較するため、時刻をリセット
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }, [task.dueDate]);
  
  // 期限の状態を取得
  const getDueStatus = useCallback(() => {
    if (!task.dueDate) return 'none';
    if (task.completed) return 'completed';
    
    const daysUntilDue = getDaysUntilDue();
    
    if (daysUntilDue === null) return 'none';
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue === 0) return 'today';
    if (daysUntilDue === 1) return 'tomorrow';
    if (daysUntilDue <= 3) return 'soon';
    return 'future';
  }, [task.dueDate, task.completed, getDaysUntilDue]);
  
  // 完了したサブタスクの数
  const completedSubtasksCount = task.subtasks?.filter(subtask => subtask.completed).length || 0;
  
  // サブタスクの総数
  const totalSubtasksCount = task.subtasks?.length || 0;
  
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "transition-all will-change-transform mb-2 cursor-grab active:cursor-grabbing",
          isDragging && "z-10"
        )}
      >
        <Card 
          className={cn(
            "border-l-4 transition-all duration-200",
            {
              "border-l-green-500": task.completed,
              "border-l-red-500": getDueStatus() === 'overdue',
              "border-l-amber-500": getDueStatus() === 'today',
              "border-l-yellow-500": getDueStatus() === 'tomorrow',
              "border-l-blue-500": getDueStatus() === 'soon' || getDueStatus() === 'future' || getDueStatus() === 'none',
              "bg-gray-50 dark:bg-gray-800/50": task.completed,
              "shadow-md border-red-300": getDueStatus() === 'overdue' && !isDragging,
            }
          )}
          onClick={isEditing ? undefined : handleOpenDetailModal}
        >
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
                      {/* 完了ボタン */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCompleted();
                        }}
                        className={cn(
                          "flex-shrink-0 transition-all duration-200 rounded-full",
                          task.completed ? "text-green-500 hover:text-green-600" : "text-gray-400 hover:text-blue-500",
                          getDueStatus() === 'overdue' && !task.completed && "animate-pulse text-red-500 hover:text-red-600"
                        )}
                        title={task.completed ? "完了済み" : "完了する"}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditing();
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
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
                  
                  {/* 期限があれば表示 */}
                  {task.dueDate && (
                    <div className={cn(
                      "flex items-center text-xs px-1.5 py-0.5 rounded-full",
                      {
                        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': getDueStatus() === 'overdue',
                        'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400': getDueStatus() === 'today',
                        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400': getDueStatus() === 'tomorrow',
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': getDueStatus() === 'soon',
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400': getDueStatus() === 'future',
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400': getDueStatus() === 'completed',
                      }
                    )}>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(task.dueDate), 'MM/dd', { locale: ja })}
                      </span>
                      {getDueStatus() === 'overdue' && (
                        <AlertCircle className="h-3 w-3 ml-1" />
                      )}
                      {getDueStatus() === 'today' && (
                        <span className="ml-1 text-[10px] font-medium">今日</span>
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
                          {tag.name}
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
                      className="w-full justify-between text-xs p-1 h-6 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubtasks();
                      }}
                    >
                      <div className="flex items-center">
                        <div className={cn(
                          "transform transition-transform duration-200",
                          showSubtasks ? "rotate-90" : "rotate-0"
                        )}>
                          <ChevronRight className="h-3 w-3 mr-1" />
                        </div>
                        <span>サブタスク</span>
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        completedSubtasksCount === totalSubtasksCount ? "text-green-500" : "text-gray-500"
                      )}>
                        {completedSubtasksCount}/{totalSubtasksCount}
                      </span>
                    </Button>
                    
                    <div className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      showSubtasks ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <div className="mt-1 pl-4 space-y-1">
                        {task.subtasks?.map((subtask) => (
                          <div 
                            key={subtask.id}
                            className="flex items-center gap-2 animate-fadeIn"
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSubtaskComplete(subtask.id);
                              }}
                              className="flex-shrink-0 text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors"
                            >
                              {subtask.completed ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <Circle className="h-3 w-3" />
                              )}
                            </button>
                            <span 
                              className={cn(
                                "text-xs transition-all duration-200",
                                subtask.completed && "line-through text-gray-500 dark:text-gray-400"
                              )}
                            >
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* タスク詳細モーダル */}
      <TaskDetailModal
        task={task}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onSave={handleTaskUpdate}
        onDelete={onDelete}
      />
    </>
  );
}

// メモ化されたコンポーネントをエクスポート
export const KanbanTask = memo(KanbanTaskComponent);
