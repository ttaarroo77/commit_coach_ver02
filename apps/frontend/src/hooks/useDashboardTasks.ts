import { useState, useEffect } from 'react';

export interface DashboardTask {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  project: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export type NewDashboardTask = Omit<DashboardTask, 'id' | 'createdAt'>;

const STORAGE_KEY = 'dashboardTasks';

export function useDashboardTasks() {
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ローカルストレージからタスクを読み込む
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (err) {
      setError('タスクの読み込みに失敗しました');
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // タスクをローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      setError('タスクの保存に失敗しました');
      console.error('Failed to save tasks:', err);
    }
  }, [tasks]);

  // タスクの追加
  const addTask = (task: NewDashboardTask): DashboardTask => {
    const newTask: DashboardTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  };

  // タスクの更新
  const updateTask = (id: string, updates: Partial<DashboardTask>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  // タスクの削除
  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // タスクの並び替え
  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks((prevTasks) => {
      const result = Array.from(prevTasks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
  };
} 