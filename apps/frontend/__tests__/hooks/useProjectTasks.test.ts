import { renderHook, act, waitFor } from '@testing-library/react';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { createBrowserClient } from '@supabase/ssr';
import { Task } from '@/types';

// Supabaseクライアントのモック
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

// useToastのモック
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('useProjectTasks', () => {
  // モックタスクデータ
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'タスク1',
      description: 'タスク1の説明',
      status: 'backlog',
      priority: 'medium',
      due_date: new Date(2025, 5, 1).toISOString(),
      created_at: new Date(2025, 4, 1).toISOString(),
      updated_at: new Date(2025, 4, 1).toISOString(),
      project_id: 'project-1',
      subtasks: []
    },
    {
      id: 'task-2',
      title: 'タスク2',
      description: 'タスク2の説明',
      status: 'in_progress',
      priority: 'high',
      due_date: new Date(2025, 5, 5).toISOString(),
      created_at: new Date(2025, 4, 2).toISOString(),
      updated_at: new Date(2025, 4, 2).toISOString(),
      project_id: 'project-1',
      subtasks: []
    }
  ];

  // Supabaseのモック関数
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockRange = jest.fn();
  const mockFrom = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockSingle = jest.fn();
  const mockChannel = jest.fn();
  const mockOn = jest.fn();
  const mockSubscribe = jest.fn();
  const mockUnsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Supabaseクライアントのモック実装
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ range: mockRange });
    mockRange.mockReturnValue({ 
      data: mockTasks, 
      error: null,
      count: mockTasks.length
    });
    
    mockFrom.mockReturnValue({ select: mockSelect });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockSingle.mockReturnValue({ data: mockTasks[0], error: null });
    
    mockOn.mockReturnValue({ on: mockOn, subscribe: mockSubscribe });
    mockChannel.mockReturnValue({ on: mockOn, unsubscribe: mockUnsubscribe });
    
    (createBrowserClient as jest.Mock).mockReturnValue({
      from: mockFrom,
      channel: mockChannel,
    });
  });

  it('初期状態が正しく設定されること', async () => {
    const { result } = renderHook(() => useProjectTasks('project-1'));
    
    // 初期状態の確認
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.tasks).toEqual([]);
    
    // フックの初期化時にfetchTasksが呼ばれることを確認
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('tasks');
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  it('タスクの作成が正しく動作すること', async () => {
    const { result } = renderHook(() => useProjectTasks('project-1'));
    
    // 新しいタスクのデータ
    const newTask = {
      title: '新しいタスク',
      description: '新しいタスクの説明',
      status: 'backlog' as const,
      priority: 'medium' as const,
      due_date: new Date().toISOString(),
      project_id: 'project-1',
      subtasks: []
    };
    
    // createTaskの呼び出しをモック
    mockFrom.mockReturnValue({ insert: mockInsert });
    mockInsert.mockReturnValue({ select: jest.fn().mockReturnValue({ single: mockSingle }) });
    mockSingle.mockReturnValue({ 
      data: { id: 'new-task-id', ...newTask, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, 
      error: null 
    });
    
    // createTaskの実行
    await act(async () => {
      await result.current.createTask(newTask);
    });
    
    // Supabaseのinsertが呼ばれたことを確認
    expect(mockFrom).toHaveBeenCalledWith('tasks');
    expect(mockInsert).toHaveBeenCalled();
  });

  it('タスクの更新が正しく動作すること', async () => {
    const { result } = renderHook(() => useProjectTasks('project-1'));
    
    // 更新するタスクのデータ
    const taskUpdate = {
      title: '更新されたタスク',
      status: 'in_progress' as const,
    };
    
    // updateTaskの呼び出しをモック
    mockFrom.mockReturnValue({ update: mockUpdate });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: jest.fn().mockReturnValue({ single: mockSingle }) });
    mockSingle.mockReturnValue({ 
      data: { ...mockTasks[0], ...taskUpdate, updated_at: new Date().toISOString() }, 
      error: null 
    });
    
    // updateTaskの実行
    await act(async () => {
      await result.current.updateTask('task-1', taskUpdate);
    });
    
    // Supabaseのupdateが呼ばれたことを確認
    expect(mockFrom).toHaveBeenCalledWith('tasks');
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 'task-1');
  });

  it('タスクの削除が正しく動作すること', async () => {
    const { result } = renderHook(() => useProjectTasks('project-1'));
    
    // deleteTaskの呼び出しをモック
    mockFrom.mockReturnValue({ delete: mockDelete });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ data: null, error: null });
    
    // deleteTaskの実行
    await act(async () => {
      await result.current.deleteTask('task-1');
    });
    
    // Supabaseのdeleteが呼ばれたことを確認
    expect(mockFrom).toHaveBeenCalledWith('tasks');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 'task-1');
  });

  it('ページネーションが正しく動作すること', async () => {
    const { result } = renderHook(() => useProjectTasks('project-1', { pageSize: 10 }));
    
    // fetchNextPageの実行
    await act(async () => {
      result.current.fetchNextPage();
    });
    
    // 2ページ目のデータ取得が行われたことを確認
    expect(mockRange).toHaveBeenCalledWith(10, 19);
  });
});
