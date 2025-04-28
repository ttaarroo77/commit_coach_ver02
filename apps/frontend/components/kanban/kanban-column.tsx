'use client';

import { useState, useRef, useCallback, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanTask } from './kanban-task';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, MoreHorizontal, X, Check } from 'lucide-react';
import { Task } from '@/types/task';
import { FadeIn } from '@/components/ui/animations';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  projectId: string;
  onUpdateTitle: (newTitle: string) => void;
  onDelete: () => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

function KanbanColumnComponent({
  id,
  title,
  tasks,
  projectId,
  onUpdateTitle,
  onDelete,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // dnd-kit の useSortable フックを使用
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    data: {
      type: 'column',
      column: { id, title }
    }
  });
  
  // ドラッグ中のスタイル
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  // タイトル編集の開始
  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    setShowOptions(false);
    // 次のティックでフォーカス
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, []);
  
  // タイトル編集の保存
  const handleSaveTitle = useCallback(() => {
    if (editedTitle.trim()) {
      onUpdateTitle(editedTitle);
    } else {
      setEditedTitle(title); // 空の場合は元に戻す
    }
    setIsEditing(false);
  }, [editedTitle, onUpdateTitle, title]);
  
  // タイトル編集のキャンセル
  const handleCancelEditing = useCallback(() => {
    setEditedTitle(title);
    setIsEditing(false);
  }, [title]);
  
  // 新しいタスクの追加
  const handleAddTask = useCallback(() => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        description: '',
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'todo',
        priority: 'medium',
        dueDate: null,
        assigneeId: null,
        subtasks: [],
        completed: false,
        tags: []
      };
      
      onAddTask(newTask);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  }, [newTaskTitle, projectId, onAddTask]);
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm will-change-transform",
        isDragging && "shadow-lg"
      )}
    >
      <Card className="h-full flex flex-col border-t-4 border-t-blue-500">
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
          {isEditing ? (
            <div className="flex items-center w-full gap-1">
              <Input
                ref={inputRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEditing();
                }}
                className="h-7 text-sm font-medium"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleSaveTitle}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCancelEditing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div
                className="font-medium text-sm cursor-move flex-1"
                {...listeners}
                onDoubleClick={handleStartEditing}
              >
                {title}
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {tasks.length}
                </span>
              </div>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                
                {showOptions && (
                  <FadeIn className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 rounded-md shadow-md border border-gray-200 dark:border-gray-700 z-10">
                    <div className="py-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm px-3"
                        onClick={handleStartEditing}
                      >
                        <span>編集</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm text-red-500 px-3"
                        onClick={onDelete}
                      >
                        <span>削除</span>
                      </Button>
                    </div>
                  </FadeIn>
                )}
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
          {tasks.map((task) => (
            <KanbanTask
              key={task.id}
              task={task}
              onUpdate={(updatedTask) => onUpdateTask(task.id, updatedTask)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
          
          {isAddingTask ? (
            <div className="space-y-2">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="タスク名を入力..."
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask();
                  if (e.key === 'Escape') {
                    setNewTaskTitle('');
                    setIsAddingTask(false);
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddTask}
                  className="w-full text-xs"
                  disabled={!newTaskTitle.trim()}
                >
                  追加
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewTaskTitle('');
                    setIsAddingTask(false);
                  }}
                  className="w-full text-xs"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-gray-500 dark:text-gray-400"
              onClick={() => setIsAddingTask(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              <span>タスクを追加</span>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// メモ化されたコンポーネントをエクスポート
export const KanbanColumn = memo(KanbanColumnComponent);
