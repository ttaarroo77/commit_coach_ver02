import { renderHook, act } from '@testing-library/react';
import { useProject } from '@/hooks/useProject';
import { mockSupabase } from '../test-utils';
import { vi } from 'vitest';

// Supabaseクライアントのモック
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase,
}));

describe('useProject', () => {
  const mockProject = {
    id: '1',
    name: 'テストプロジェクト',
    description: 'テストプロジェクトの説明',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('プロジェクトの作成が正しく動作すること', async () => {
    const { result } = renderHook(() => useProject());

    await act(async () => {
      await result.current.createProject({
        name: mockProject.name,
        description: mockProject.description,
      });
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('projects');
    expect(result.current.projects).toHaveLength(1);
    expect(result.current.projects[0]).toEqual(expect.objectContaining({
      name: mockProject.name,
      description: mockProject.description,
    }));
  });

  it('プロジェクトの更新が正しく動作すること', async () => {
    const { result } = renderHook(() => useProject());
    const updatedName = 'テストプロジェクト（更新）';

    await act(async () => {
      await result.current.updateProject(mockProject.id, {
        name: updatedName,
      });
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('projects');
    const updatedProject = result.current.projects.find(p => p.id === mockProject.id);
    expect(updatedProject?.name).toBe(updatedName);
  });

  it('プロジェクトの削除が正しく動作すること', async () => {
    const { result } = renderHook(() => useProject());

    await act(async () => {
      await result.current.deleteProject(mockProject.id);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('projects');
    expect(result.current.projects).not.toContain(mockProject);
  });
}); 