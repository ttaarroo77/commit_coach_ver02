'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from './task-list';
import { KanbanTask } from './kanban-task';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg min-h-[500px]"
    >
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <div className="flex-1">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.map((task) => (
              <KanbanTask key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
} 