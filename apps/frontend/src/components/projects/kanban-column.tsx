import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task } from '@/types/task';
import { TaskCard } from './task-card';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskEdit: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onTaskEdit,
  onTaskDelete,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex h-full flex-col rounded-lg border bg-background p-4"
    >
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onTaskEdit(task.id)}
            onDelete={() => onTaskDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
} 