"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '@/types/task';
import { SortableTaskItem } from './sortable-task-item';
import { Plus } from 'lucide-react';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  status: string;
  styles: {
    bgColor: string;
    borderColor: string;
    textColor: string;
    badgeBg: string;
    badgeText: string;
  };
  onCreateTask: () => void;
  onTaskClick?: (task: Task) => void;
}

export function TaskColumn({ id, title, tasks, status, styles, onCreateTask, onTaskClick }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border border-dashed ${styles.borderColor} rounded-md p-3 ${styles.bgColor} min-h-[200px] flex flex-col`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className={`text-sm font-medium ${styles.textColor}`}>{title}</span>
          <span className={`ml-2 text-xs ${styles.badgeBg} ${styles.badgeText} px-2 py-0.5 rounded-full`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onCreateTask}
          className="p-1 hover:bg-white/50 rounded-full transition-colors"
          title="タスクを追加"
        >
          <Plus className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-2 flex-grow">
        <SortableContext
          items={tasks.map(task => `task-${task.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length > 0 ? (
            tasks.map(task => (
              <SortableTaskItem
                key={task.id}
                id={`task-${task.id}`}
                task={task}
                onClick={onTaskClick ? () => onTaskClick(task) : undefined}
              />
            ))
          ) : (
            <div className="border border-dashed border-gray-200 rounded p-3 bg-white/50 text-center">
              <p className="text-xs text-gray-400">タスクがありません</p>
              <p className="text-xs text-gray-400">「＋」ボタンで追加</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
