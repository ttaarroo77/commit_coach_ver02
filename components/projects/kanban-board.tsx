'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, TaskStatus } from './task-list';
import { KanbanColumn } from './kanban-column';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const statusColumns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: '未着手' },
  { id: 'in-progress', title: '進行中' },
  { id: 'review', title: 'レビュー中' },
  { id: 'done', title: '完了' },
];

export function KanbanBoard({ tasks, onTaskStatusChange }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const newStatus = over.id as TaskStatus;
    if (activeTask.status !== newStatus) {
      onTaskStatusChange(activeTask.id, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {statusColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={columnTasks}
            />
          );
        })}
      </div>
    </DndContext>
  );
} 