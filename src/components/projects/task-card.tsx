import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '@/types/task';
import { TaskMenu } from './task-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      status: task.status,
    },
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <TaskMenu onEdit={onEdit} onDelete={onDelete} />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{task.description}</p>
      </CardContent>
    </Card>
  );
} 