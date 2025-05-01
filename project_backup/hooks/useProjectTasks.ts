'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Task, TaskStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface UseProjectTasksOptions {
  pageSize?: number;
  initialPage?: number;
}

export function useProjectTasks(projectId: string, options: UseProjectTasksOptions = {}) {
  const { pageSize = 20, initialPage = 1 } = options;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { toast } = useToast();
  
  // Supabaseクライアント
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // タスクの取得
  const fetchTasks = useCallback(async (page = 1, reset = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // ページネーションの計算
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Supabaseからタスクを取得
      const { data, error, count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      // 取得したデータをタスク配列として設定
      if (reset) {
        setTasks(data as Task[]);
      } else {
        setTasks(prev => [...prev, ...(data as Task[])]);
      }
      
      // 次のページがあるか確認
      setHasMore(count !== null && from + data.length < count);
      setCurrentPage(page);
      setIsLoading(false);
      
    } catch (err) {
      console.error('タスクの取得中にエラーが発生しました:', err);
      setError(err as Error);
      setIsLoading(false);
      
      toast({
        title: 'エラー',
        description: 'タスクの取得中にエラーが発生しました',
        variant: 'destructive',
      });
    }
  }, [projectId, pageSize, supabase, toast]);
  
  // 次のページを取得
  const fetchNextPage = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchTasks(currentPage + 1);
    }
  }, [fetchTasks, currentPage, isLoading, hasMore]);
  
  // データの再取得
  const refreshTasks = useCallback(() => {
    setCurrentPage(1);
    fetchTasks(1, true);
  }, [fetchTasks]);
  
  // タスクの作成
  const createTask = useCallback(async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const now = new Date().toISOString();
      
      const task = {
        ...newTask,
        created_at: now,
        updated_at: now,
      };
      
      // Supabaseにタスクを追加
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();
      
      if (error) throw error;
      
      // 状態の更新
      setTasks(prev => [...prev, data as Task]);
      
      toast({
        title: '成功',
        description: 'タスクが作成されました',
      });
      
      return data as Task;
      
    } catch (err) {
      console.error('タスクの作成中にエラーが発生しました:', err);
      
      toast({
        title: 'エラー',
        description: 'タスクの作成中にエラーが発生しました',
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [supabase, toast]);
  
  // タスクの更新
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      // Supabaseでタスクを更新
      const { data, error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      // 状態の更新
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, ...data } as Task : task
        )
      );
      
      toast({
        title: '成功',
        description: 'タスクが更新されました',
      });
      
      return data as Task;
      
    } catch (err) {
      console.error('タスクの更新中にエラーが発生しました:', err);
      
      toast({
        title: 'エラー',
        description: 'タスクの更新中にエラーが発生しました',
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [supabase, toast]);
  
  // タスクの削除
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      // Supabaseでタスクを削除
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      // 状態の更新
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: '成功',
        description: 'タスクが削除されました',
      });
      
    } catch (err) {
      console.error('タスクの削除中にエラーが発生しました:', err);
      
      toast({
        title: 'エラー',
        description: 'タスクの削除中にエラーが発生しました',
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [supabase, toast]);
  
  // タスクのステータス変更
  const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    return updateTask(taskId, { status });
  }, [updateTask]);
  
  // 初期データの取得とリアルタイム更新の設定
  useEffect(() => {
    if (projectId) {
      // 初期データの取得
      fetchTasks(initialPage, true);
      
      // Supabase Realtimeの設定
      const channel = supabase
        .channel(`tasks-${projectId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        }, (payload) => {
          // 新しいタスクが追加された場合
          const newTask = payload.new as Task;
          
          // 自分自身が追加したタスクはすでに表示されているはずなので、
          // 重複を避けるためにチェック
          setTasks(prev => {
            if (prev.some(task => task.id === newTask.id)) {
              return prev;
            }
            return [newTask, ...prev];
          });
          
          toast({
            title: '更新',
            description: '新しいタスクが追加されました',
          });
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        }, (payload) => {
          // タスクが更新された場合
          const updatedTask = payload.new as Task;
          setTasks(prev => 
            prev.map(task => 
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        }, (payload) => {
          // タスクが削除された場合
          const deletedTaskId = payload.old.id;
          setTasks(prev => prev.filter(task => task.id !== deletedTaskId));
        })
        .subscribe();
      
      // クリーンアップ関数
      return () => {
        supabase.channel(`tasks-${projectId}`).unsubscribe();
      };
    }
  }, [projectId, fetchTasks, initialPage, supabase, toast]);
  
  return {
    tasks,
    isLoading,
    error,
    hasMore,
    fetchTasks,
    fetchNextPage,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
}
