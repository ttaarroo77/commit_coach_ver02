import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskListProps {
  subtasks: Subtask[];
  onUpdate: (subtaskId: string, completed: boolean) => void;
  onDelete: (subtaskId: string) => void;
}

export function SubtaskList({ subtasks, onUpdate, onDelete }: SubtaskListProps) {
  return (
    <div className="space-y-2">
      {subtasks.map((subtask) => (
        <div
          key={subtask.id}
          className="flex items-center justify-between space-x-2"
        >
          <div className="flex items-center space-x-2">
            <Checkbox
              id={subtask.id}
              checked={subtask.completed}
              onCheckedChange={(checked) =>
                onUpdate(subtask.id, checked as boolean)
              }
            />
            <label
              htmlFor={subtask.id}
              className={`text-sm ${subtask.completed ? 'text-muted-foreground line-through' : ''
                }`}
            >
              {subtask.title}
            </label>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(subtask.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
} 