import React from 'react';
import { Task } from '@/types';
import { formatDate, formatPriority, formatStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TaskDetailModalProps {
  isOpen: boolean;
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, task: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskDetailModal({
  isOpen,
  task,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="task-detail-modal">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <div className="flex gap-2">
            <button
              data-testid="edit-button"
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => {/* 編集処理 */ }}
            >
              編集
            </button>
            <button
              data-testid="delete-button"
              className="p-2 rounded hover:bg-red-100 text-red-600"
              onClick={() => onDelete(task.id)}
            >
              削除
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">{task.description}</p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" data-testid="status-badge">
              {formatStatus(task.status)}
            </Badge>
            <Badge variant="secondary" data-testid="priority-badge">
              優先度: {formatPriority(task.priority)}
            </Badge>
            <Badge variant="secondary" data-testid="due-date-badge">
              期限: {formatDate(task.dueDate)}
            </Badge>
          </div>
          {task.status !== 'done' && (
            <button
              data-testid="complete-button"
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => onUpdate(task.id, { status: 'done' })}
            >
              完了にする
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;