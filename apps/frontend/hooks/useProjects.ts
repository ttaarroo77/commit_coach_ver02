'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectStatus, ProjectWithStats, ProjectFilterValues } from '@/types/project';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/database.types';

// モックデータ（Supabase連携前の仮実装）
const mockProjects: ProjectWithStats[] = [
  {
    id: '1',
    name: 'ウェブサイトリニューアル',
    description: 'コーポレートサイトのデザイン刷新と機能追加',
    status: 'active',
    user_id: 'user-1',
    created_at: new Date(2025, 3, 15).toISOString(),
    updated_at: new Date(2025, 3, 27).toISOString(),
    taskCount: 12,
    completedTaskCount: 5,
    progress: 42
  },
  {
    id: '2',
    name: 'モバイルアプリ開発',
    description: 'クロスプラットフォーム対応のタスク管理アプリ',
    status: 'active',
    user_id: 'user-1',
    created_at: new Date(2025, 2, 10).toISOString(),
    updated_at: new Date(2025, 3, 25).toISOString(),
    taskCount: 24,
    completedTaskCount: 18,
    progress: 75
  },
  {
    id: '3',
    name: 'データ分析ダッシュボード',
    description: 'ユーザー行動分析のためのダッシュボード開発',
    status: 'completed',
    user_id: 'user-1',
    created_at: new Date(2025, 1, 5).toISOString(),
    updated_at: new Date(2025, 3, 20).toISOString(),
    taskCount: 8,
    completedTaskCount: 8,
    progress: 100
  },
  {
    id: '4',
    name: 'マーケティングキャンペーン',
    description: '夏季プロモーションの企画と実施',
    status: 'active',
    user_id: 'user-1',
    created_at: new Date(2025, 3, 1).toISOString(),
    updated_at: new Date(2025, 3, 22).toISOString(),
    taskCount: 15,
    completedTaskCount: 3,
    progress: 20
  },
  {
    id: '5',
    name: 'インフラ最適化',
    description: 'クラウドインフラの見直しとコスト削減',
    status: 'archived',
    user_id: 'user-1',
    created_at: new Date(2024, 11, 15).toISOString(),
    updated_at: new Date(2025, 2, 10).toISOString(),
    taskCount: 10,
    completedTaskCount: 7,
    progress: 70
  }
];

const defaultFilters: ProjectFilterValues = {
  search: '',
  status: 'all',
  sortBy: 'updated_at',
  sortDirection: 'desc'
};

export function useProjects() {
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithStats[]>([]);
  const [filters, setFilters] = useState<ProjectFilterValues>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // プロジェクトデータの取得（将来的にはSupabaseから取得）
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Supabase実装
      // const { data, error } = await supabase
      //   .from('projects')
      //   .select('*')
      //   .eq('user_id', userId);
      
      // if (error) throw new Error(error.message);
      
      // モックデータを使用
      setTimeout(() => {
        setProjects(mockProjects);
        setIsLoading(false);
      }, 800); // ローディング表示のための遅延
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      setIsLoading(false);
    }
  }, []);

  // フィルタリングとソート
  useEffect(() => {
    if (projects.length === 0) return;
    
    let result = [...projects];
    
    // 検索フィルタリング
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        project => 
          project.name.toLowerCase().includes(searchLower) || 
          (project.description && project.description.toLowerCase().includes(searchLower))
      );
    }
    
    // ステータスフィルタリング
    if (filters.status !== 'all') {
      result = result.filter(project => project.status === filters.status);
    }
    
    // ソート
    result.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (filters.sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
      
      return 0;
    });
    
    setFilteredProjects(result);
  }, [projects, filters]);

  // 初期データ取得
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // プロジェクト作成
  const createProject = async (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      // TODO: Supabase実装
      // const { data, error } = await supabase
      //   .from('projects')
      //   .insert([{ ...project, user_id: userId }])
      //   .select()
      //   .single();
      
      // if (error) throw new Error(error.message);
      
      // モック実装
      const newProject: ProjectWithStats = {
        id: `new-${Date.now()}`,
        ...project,
        user_id: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        taskCount: 0,
        completedTaskCount: 0,
        progress: 0
      };
      
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      throw err;
    }
  };

  // プロジェクト更新
  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      // TODO: Supabase実装
      // const { data, error } = await supabase
      //   .from('projects')
      //   .update(updates)
      //   .eq('id', id)
      //   .select()
      //   .single();
      
      // if (error) throw new Error(error.message);
      
      // モック実装
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? { 
                ...project, 
                ...updates, 
                updated_at: new Date().toISOString() 
              } 
            : project
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      throw err;
    }
  };

  // プロジェクト削除
  const deleteProject = async (id: string) => {
    try {
      // TODO: Supabase実装
      // const { error } = await supabase
      //   .from('projects')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw new Error(error.message);
      
      // モック実装
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      throw err;
    }
  };

  // フィルター更新
  const updateFilters = (newFilters: Partial<ProjectFilterValues>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // フィルターリセット
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    projects: filteredProjects,
    allProjects: projects,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects
  };
}
