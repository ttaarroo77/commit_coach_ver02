import React from 'react';
import { Task } from '@/types/task';
import { TaskCard } from './task-card';
import { TaskFilters } from './task-filters';

interface TaskListProps {
  tasks: Task[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onTaskEdit: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskList({
  tasks,
  searchQuery,
  onSearchChange,
  onSearch,
  onTaskEdit,
  onTaskDelete,
}: TaskListProps) {
  return (
    <div className="space-y-4">
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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