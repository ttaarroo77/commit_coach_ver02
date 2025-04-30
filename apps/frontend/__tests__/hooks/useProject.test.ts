import { renderHook, act } from '@testing-library/react';
import { useProject } from '@/hooks/useProject';
import { createBrowserClient } from '@supabase/ssr';

// モックの設定
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

describe('useProject', () => {
  const mockProject = {
    id: '1',
    name: 'テストプロジェクト',
    description: 'テストプロジェクトの説明',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createBrowserClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it('プロジェクトが正しく取得できること', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: mockProject,
      error: null,
    });

    const { result } = renderHook(() => useProject('1'));

    await act(async () => {
      await result.current.fetchProject();
    });

    expect(result.current.project).toEqual(mockProject);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('プロジェクトの取得に失敗した場合、エラーが設定されること', async () => {
    const errorMessage = 'プロジェクトの取得に失敗しました';
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    });

    const { result } = renderHook(() => useProject('1'));

    await act(async () => {
      await result.current.fetchProject();
    });

    expect(result.current.project).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('プロジェクトが正しく更新できること', async () => {
    const updatedProject = {
      ...mockProject,
      name: '更新されたプロジェクト名',
    };

    mockSupabaseClient.update.mockResolvedValueOnce({
      data: updatedProject,
      error: null,
    });

    const { result } = renderHook(() => useProject('1'));

    await act(async () => {
      await result.current.updateProject({ name: '更新されたプロジェクト名' });
    });

    expect(result.current.project).toEqual(updatedProject);
    expect(result.current.error).toBeNull();
  });

  it('プロジェクトが正しく削除できること', async () => {
    mockSupabaseClient.delete.mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useProject('1'));

    await act(async () => {
      await result.current.deleteProject();
    });

    expect(result.current.project).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('プロジェクトの作成が成功すること', async () => {
    const newProject = {
      name: '新しいプロジェクト',
      description: '新しいプロジェクトの説明',
      status: 'active',
    };

    mockSupabaseClient.insert.mockResolvedValueOnce({
      data: [mockProject],
      error: null,
    });

    const { result } = renderHook(() => useProject());

    await act(async () => {
      await result.current.createProject(newProject);
    });

    expect(result.current.project).toEqual(mockProject);
    expect(result.current.error).toBeNull();
  });
}); 