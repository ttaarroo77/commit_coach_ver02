'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Task, SubTask, TaskPriority } from '@/types/task';
import { CalendarIcon, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete
}: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  // タスクデータの初期化
  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  // 入力フィールドの変更ハンドラ
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedTask) return;
    
    const { name, value } = e.target;
    setEditedTask((prev: Task | null) => prev ? { ...prev, [name]: value } : null);
  }, [editedTask]);

  // 期日の変更ハンドラ
  const handleDueDateChange = useCallback((date: Date | undefined) => {
    if (!editedTask || !date) return;
    
    setEditedTask((prev: Task | null) => prev ? { 
      ...prev, 
      dueDate: date.toISOString() 
    } : null);
    setCalendarOpen(false);
  }, [editedTask]);

  // 優先度の変更ハンドラ
  const handlePriorityChange = useCallback((priority: TaskPriority) => {
    if (!editedTask) return;
    
    setEditedTask((prev: Task | null) => prev ? { ...prev, priority } : null);
  }, [editedTask]);

  // サブタスクの追加
  const handleAddSubtask = useCallback(() => {
    if (!editedTask || !newSubtaskTitle.trim()) return;
    
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: newSubtaskTitle,
      completed: false
    };
    
    setEditedTask((prev: Task | null) => prev ? {
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtask]
    } : null);
    
    setNewSubtaskTitle('');
  }, [editedTask, newSubtaskTitle]);

  // サブタスクの削除
  const handleDeleteSubtask = useCallback((subtaskId: string) => {
    if (!editedTask) return;
    
    setEditedTask((prev: Task | null) => prev ? {
      ...prev,
      subtasks: prev.subtasks?.filter((st: SubTask) => st.id !== subtaskId) || []
    } : null);
  }, [editedTask]);

  // サブタスクの完了状態の切り替え
  const handleToggleSubtask = useCallback((subtaskId: string) => {
    if (!editedTask) return;
    
    setEditedTask((prev: Task | null) => {
      if (!prev) return null;
      
      return {
        ...prev,
        subtasks: prev.subtasks?.map((st: SubTask) => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        ) || []
      };
    });
  }, [editedTask]);

  // タスクの保存
  const handleSave = useCallback(() => {
    if (!editedTask) return;
    
    onSave(editedTask);
    onClose();
  }, [editedTask, onSave, onClose]);

  // タスクの削除
  const handleDelete = useCallback(() => {
    if (!editedTask) return;
    
    if (window.confirm('このタスクを削除してもよろしいですか？この操作は元に戻せません。')) {
      onDelete(editedTask.id);
      onClose();
    }
  }, [editedTask, onDelete, onClose]);

  // 優先度に応じたバッジの色を取得
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (!editedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            <Input
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
              className="text-xl font-semibold mt-2"
              placeholder="タスクのタイトル"
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* 説明 */}
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              説明
            </label>
            <Textarea
              id="description"
              name="description"
              value={editedTask.description || ''}
              onChange={handleInputChange}
              placeholder="タスクの詳細を入力してください"
              className="min-h-[100px]"
            />
          </div>
          
          {/* 期日 */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">期日</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editedTask.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedTask.dueDate ? (
                    format(new Date(editedTask.dueDate), 'yyyy年MM月dd日', { locale: ja })
                  ) : (
                    <span>期日を選択</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                  onSelect={handleDueDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* 優先度 */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">優先度</label>
            <div className="flex space-x-2">
              <Badge 
                className={cn(
                  "cursor-pointer",
                  editedTask.priority === 'low' ? getPriorityColor('low') : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                onClick={() => handlePriorityChange('low')}
              >
                低
              </Badge>
              <Badge 
                className={cn(
                  "cursor-pointer",
                  editedTask.priority === 'medium' ? getPriorityColor('medium') : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                onClick={() => handlePriorityChange('medium')}
              >
                中
              </Badge>
              <Badge 
                className={cn(
                  "cursor-pointer",
                  editedTask.priority === 'high' ? getPriorityColor('high') : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                onClick={() => handlePriorityChange('high')}
              >
                高
              </Badge>
            </div>
          </div>
          
          {/* サブタスク */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">サブタスク</label>
            <div className="space-y-2">
              {editedTask.subtasks && editedTask.subtasks.length > 0 ? (
                <ul className="space-y-2">
                  {editedTask.subtasks.map((subtask: SubTask) => (
                    <li key={subtask.id} className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleSubtask(subtask.id)}
                        className="flex-shrink-0"
                      >
                        {subtask.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </button>
                      <span className={cn(
                        "flex-grow",
                        subtask.completed && "line-through text-gray-500"
                      )}>
                        {subtask.title}
                      </span>
                      <button
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">サブタスクはありません</p>
              )}
              
              <div className="flex mt-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="新しいサブタスク"
                  className="flex-grow"
                />
                <Button 
                  onClick={handleAddSubtask}
                  className="ml-2"
                  disabled={!newSubtaskTitle.trim()}
                >
                  追加
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            削除
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
