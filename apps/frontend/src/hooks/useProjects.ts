import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/components/ui/use-toast';
import { Project, CreateProjectInput } from '@/types/project';

export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  fetchProjects: () => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  createProject: (project: CreateProjectInput) => Promise<Project | null>;
  updateProject: (
    id: string,
    updates: Partial<CreateProjectInput>
  ) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
}

/**
 * プロジェクト管理のためのカスタムフック
 * 
 * - プロジェクトの読み込み、追加、更新、削除機能を提供
 * - Supabaseと連携してデータを管理
 * - エラーハンドリングとトースト通知機能付き
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // プロジェクト一覧を取得
  const fetchProjects = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setProjects(data as Project[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      toast({
        title: 'エラー',
        description: 'プロジェクトの取得に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 特定のプロジェクトを取得
  const getProject = async (id: string): Promise<Project | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data as Project;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project'));
      toast({
        title: 'エラー',
        description: 'プロジェクトの取得に失敗しました',
        variant: 'destructive',
      });
      return null;
    }
  };

  // 新しいプロジェクトを作成
  const createProject = async (
    project: CreateProjectInput
  ): Promise<Project | null> => {
    try {
      const { data, error: createError } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setProjects((prev) => [data as Project, ...prev]);
      toast({
        title: '成功',
        description: 'プロジェクトが作成されました',
      });
      return data as Project;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create project'));
      toast({
        title: 'エラー',
        description: 'プロジェクトの作成に失敗しました',
        variant: 'destructive',
      });
      return null;
    }
  };

  // プロジェクトを更新
  const updateProject = async (
    id: string,
    updates: Partial<CreateProjectInput>
  ): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      toast({
        title: '成功',
        description: 'プロジェクトが更新されました',
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update project'));
      toast({
        title: 'エラー',
        description: 'プロジェクトの更新に失敗しました',
        variant: 'destructive',
      });
      return false;
    }
  };

  // プロジェクトを削除
  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: '成功',
        description: 'プロジェクトが削除されました',
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete project'));
      toast({
        title: 'エラー',
        description: 'プロジェクトの削除に失敗しました',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  };
}

// 単一インスタンスとしてエクスポート
export default useProjects;