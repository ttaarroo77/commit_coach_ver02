import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubtaskList } from './subtask-list';
import { Task } from '@/types/task';
import { formatDate, formatPriority, formatStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...task,
      title,
      description,
      subtasks,
    });
  };

  const handleSubtaskUpdate = (subtaskId: string, completed: boolean) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed } : subtask
      )
    );
  };

  const handleSubtaskDelete = (subtaskId: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== subtaskId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タスクの詳細</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>サブタスク</Label>
            <SubtaskList
              subtasks={subtasks}
              onUpdate={handleSubtaskUpdate}
              onDelete={handleSubtaskDelete}
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit">保存</Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(task.id)}
            >
              削除
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskDetailModal;