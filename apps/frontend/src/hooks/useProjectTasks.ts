import { useState, useEffect } from 'react';
import { Task } from '@/types';

export interface UseProjectTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export function useProjectTasks(projectId: string): UseProjectTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTask = async (task: Partial<Task>) => {
    // 実装は後で追加
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    // 実装は後で追加
  };

  const deleteTask = async (id: string) => {
    // 実装は後で追加
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}

export default useProjectTasks; 