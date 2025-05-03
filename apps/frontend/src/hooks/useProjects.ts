import { useState, useEffect } from 'react';
import { Project } from '../types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '../hooks/use-toast';

export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  createProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // プロジェクト一覧を取得
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('プロジェクトの取得に失敗しました'));
        toast({
          title: 'エラー',
          description: 'プロジェクトの取得に失敗しました',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // リアルタイム更新のサブスクリプション
    const subscription = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, toast]);

  // プロジェクトを作成
  const createProject = async (project: Partial<Project>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();

      if (error) throw error;
      
      toast({
        title: '成功',
        description: 'プロジェクトが作成されました',
      });
      
      // 作成後に最新のプロジェクト一覧を取得
      const { data: updatedProjects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      setProjects(updatedProjects || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('プロジェクトの作成に失敗しました'));
      toast({
        title: 'エラー',
        description: 'プロジェクトの作成に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // プロジェクトを更新
  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: '成功',
        description: 'プロジェクトが更新されました',
      });
      
      // 更新後に最新のプロジェクト一覧を取得
      const { data: updatedProjects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      setProjects(updatedProjects || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('プロジェクトの更新に失敗しました'));
      toast({
        title: 'エラー',
        description: 'プロジェクトの更新に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // プロジェクトを削除
  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: '成功',
        description: 'プロジェクトが削除されました',
      });
      
      // 削除後に最新のプロジェクト一覧を取得
      const { data: updatedProjects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      setProjects(updatedProjects || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('プロジェクトの削除に失敗しました'));
      toast({
        title: 'エラー',
        description: 'プロジェクトの削除に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}

export default useProjects;