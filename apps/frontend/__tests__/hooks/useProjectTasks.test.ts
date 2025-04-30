import { renderHook, act } from '@testing-library/react';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { createBrowserClient } from '@supabase/ssr';

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

describe('useProjectTasks', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'タスク1',
      description: 'タスク1の説明',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-03-01',
      projectId: '1',
    },
    {
      id: '2',
      title: 'タスク2',
      description: 'タスク2の説明',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2024-03-02',
      projectId: '1',
    },
  ];

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createBrowserClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it('タスク一覧が正しく取得できること', async () => {
    mockSupabaseClient.eq.mockResolvedValueOnce({
      data: mockTasks,
      error: null,
    });

    const { result } = renderHook(() => useProjectTasks('1'));

    await act(async () => {
      await result.current.fetchTasks();
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('タスクの作成が成功すること', async () => {
    const newTask = {
      title: '新しいタスク',
      description: '新しいタスクの説明',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-03-03',
      projectId: '1',
    };

    mockSupabaseClient.insert.mockResolvedValueOnce({
      data: [mockTasks[0]],
      error: null,
    });

    const { result } = renderHook(() => useProjectTasks('1'));

    await act(async () => {
      await result.current.createTask(newTask);
    });

    expect(result.current.error).toBeNull();
  });

  it('タスクの更新が成功すること', async () => {
    const updatedTask = {
      ...mockTasks[0],
      title: '更新されたタスク',
    };

    mockSupabaseClient.update.mockResolvedValueOnce({
      data: updatedTask,
      error: null,
    });

    const { result } = renderHook(() => useProjectTasks('1'));

    await act(async () => {
      await result.current.updateTask('1', { title: '更新されたタスク' });
    });

    expect(result.current.error).toBeNull();
  });

  it('タスクの削除が成功すること', async () => {
    mockSupabaseClient.delete.mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useProjectTasks('1'));

    await act(async () => {
      await result.current.deleteTask('1');
    });

    expect(result.current.error).toBeNull();
  });

  it('タスクのステータス更新が成功すること', async () => {
    mockSupabaseClient.update.mockResolvedValueOnce({
      data: { ...mockTasks[0], status: 'in_progress' },
      error: null,
    });

    const { result } = renderHook(() => useProjectTasks('1'));

    await act(async () => {
      await result.current.updateTaskStatus('1', 'in_progress');
    });

    expect(result.current.error).toBeNull();
  });
});
