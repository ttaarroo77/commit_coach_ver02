import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Task } from '../types/task';
import { useToast } from './use-toast';

export interface UseProjectTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export function useProjectTasks(projectId: string): UseProjectTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('タスクの取得に失敗しました'));
        toast({
          title: 'エラー',
          description: 'タスクの取得に失敗しました',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    
    // リアルタイム更新のサブスクリプション
    const subscription = supabase
      .channel(`tasks-${projectId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId, supabase, toast]);

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, project_id: projectId }])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
      
      toast({
        title: '成功',
        description: 'タスクが作成されました',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('タスクの作成に失敗しました'));
      toast({
        title: 'エラー',
        description: 'タスクの作成に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === taskId ? data : task));
      
      toast({
        title: '成功',
        description: 'タスクが更新されました',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('タスクの更新に失敗しました'));
      toast({
        title: 'エラー',
        description: 'タスクの更新に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: '成功',
        description: 'タスクが削除されました',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('タスクの削除に失敗しました'));
      toast({
        title: 'エラー',
        description: 'タスクの削除に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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