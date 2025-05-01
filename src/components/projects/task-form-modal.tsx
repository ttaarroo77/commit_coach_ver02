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
import { Task } from '@/types/task';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  initialData?: Partial<Task>;
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TaskFormModalProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<Task['status']>(
    initialData?.status || 'backlog'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      return;
    }
    onSubmit({
      title,
      description,
      status,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'タスクを編集' : '新しいタスクを作成'}
          </DialogTitle>
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
            <Label htmlFor="status">ステータス</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Task['status'])}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="backlog">バックログ</option>
              <option value="in_progress">進行中</option>
              <option value="done">完了</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              閉じる
            </Button>
            <Button type="submit">
              {initialData ? '更新' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskFormModal;