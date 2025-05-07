import { useState, useCallback } from 'react';
import { DashboardTask } from '@commit-coach/shared-types';
import { toast } from '@/components/ui/use-toast';

export const useDashboardTasks = () => {
   const [tasks, setTasks] = useState<DashboardTask[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   // タスク一覧の取得
   const fetchTasks = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
         const response = await fetch('/api/dashboard/tasks');
         if (!response.ok) throw new Error('タスクの取得に失敗しました');
         const data = await response.json();
         setTasks(data);
      } catch (err) {
         setError(err instanceof Error ? err : new Error('予期せぬエラーが発生しました'));
         toast({
            title: 'エラー',
            description: 'タスクの取得に失敗しました',
            variant: 'destructive',
         });
      } finally {
         setIsLoading(false);
      }
   }, []);

   // タスクの追加
   const addTask = useCallback(async (task: Omit<DashboardTask, 'id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      setError(null);
      try {
         const response = await fetch('/api/dashboard/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
         });
         if (!response.ok) throw new Error('タスクの追加に失敗しました');
         const newTask = await response.json();
         setTasks(prev => [...prev, newTask]);
         toast({
            title: '成功',
            description: 'タスクを追加しました',
         });
      } catch (err) {
         setError(err instanceof Error ? err : new Error('予期せぬエラーが発生しました'));
         toast({
            title: 'エラー',
            description: 'タスクの追加に失敗しました',
            variant: 'destructive',
         });
      } finally {
         setIsLoading(false);
      }
   }, []);

   // タスクの更新
   const updateTask = useCallback(async (id: string, updates: Partial<DashboardTask>) => {
      setIsLoading(true);
      setError(null);
      try {
         const response = await fetch(`/api/dashboard/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
         });
         if (!response.ok) throw new Error('タスクの更新に失敗しました');
         const updatedTask = await response.json();
         setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
         toast({
            title: '成功',
            description: 'タスクを更新しました',
         });
      } catch (err) {
         setError(err instanceof Error ? err : new Error('予期せぬエラーが発生しました'));
         toast({
            title: 'エラー',
            description: 'タスクの更新に失敗しました',
            variant: 'destructive',
         });
      } finally {
         setIsLoading(false);
      }
   }, []);

   // タスクの削除
   const deleteTask = useCallback(async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
         const response = await fetch(`/api/dashboard/tasks/${id}`, {
            method: 'DELETE',
         });
         if (!response.ok) throw new Error('タスクの削除に失敗しました');
         setTasks(prev => prev.filter(task => task.id !== id));
         toast({
            title: '成功',
            description: 'タスクを削除しました',
         });
      } catch (err) {
         setError(err instanceof Error ? err : new Error('予期せぬエラーが発生しました'));
         toast({
            title: 'エラー',
            description: 'タスクの削除に失敗しました',
            variant: 'destructive',
         });
      } finally {
         setIsLoading(false);
      }
   }, []);

   // タスクの並び替え
   const reorderTasks = useCallback((startIndex: number, endIndex: number) => {
      setTasks(prev => {
         const result = Array.from(prev);
         const [removed] = result.splice(startIndex, 1);
         result.splice(endIndex, 0, removed);
         return result;
      });
   }, []);

   return {
      tasks,
      isLoading,
      error,
      fetchTasks,
      addTask,
      updateTask,
      deleteTask,
      reorderTasks,
   };
}; 