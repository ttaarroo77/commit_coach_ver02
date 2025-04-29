'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from './task-list';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface KanbanTaskProps {
  task: Task;
}

export function KanbanTask({ task }: KanbanTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">{task.title}</h4>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority === 'high' && '高'}
            {task.priority === 'medium' && '中'}
            {task.priority === 'low' && '低'}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://github.com/${task.assigneeName}.png`} />
              <AvatarFallback>{task.assigneeName[0]}</AvatarFallback>
            </Avatar>
            <span>{task.assigneeName}</span>
          </div>
          <span>
            {format(new Date(task.dueDate), 'M/d', { locale: ja })}
          </span>
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
} 