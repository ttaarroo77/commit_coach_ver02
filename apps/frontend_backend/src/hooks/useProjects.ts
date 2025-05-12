import { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '../hooks/use-toast';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // プロジェクト一覧取得
  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) setError(error);
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  // プロジェクト作成
  const createProject = async (project: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      const user = await supabase.auth.getUser();
      console.log('Current user:', user.data.user); // ユーザー情報を出力
      if (!user.data.user?.id) {
        console.error('ユーザーIDが取得できません');
        throw new Error('ユーザーIDが取得できません');
      }
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, owner_id: user.data.user.id }])
        .select();
      if (error) throw error;
      if (data) setProjects(prev => [...prev, ...data]);
      toast({ title: '成功', description: 'プロジェクトが作成されました' });
    } catch (err: any) {
      console.error('Project creation error:', err); // エラー詳細を出力
      setError(err);
      toast({ title: 'エラー', description: err.message || 'プロジェクトの作成に失敗しました', variant: 'destructive' });
      alert(err.message || 'プロジェクトの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // プロジェクト削除
  const deleteProject = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: '成功', description: 'プロジェクトが削除されました' });
    } catch (err: any) {
      setError(err);
      toast({ title: 'エラー', description: err.message || 'プロジェクトの削除に失敗しました', variant: 'destructive' });
      alert(err.message || 'プロジェクトの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading, error, createProject, deleteProject };
}

export default useProjects;