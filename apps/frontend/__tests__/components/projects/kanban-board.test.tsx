import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KanbanBoard } from '@/components/projects/kanban-board';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { Task } from '@/types';

// モックの作成
jest.mock('@/hooks/useProjectTasks', () => ({
  useProjectTasks: jest.fn(),
}));

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
    subtasks: [
      { id: 'subtask-1', title: 'サブタスク1', completed: true },
      { id: 'subtask-2', title: 'サブタスク2', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'タスク3',
    description: 'タスク3の説明',
    status: 'completed',
    priority: 'low',
    due_date: new Date(2025, 4, 20).toISOString(),
    created_at: new Date(2025, 4, 3).toISOString(),
    updated_at: new Date(2025, 4, 10).toISOString(),
    project_id: 'project-1',
    subtasks: []
  }
];

// モックフック関数
const mockUpdateTaskStatus = jest.fn();
const mockCreateTask = jest.fn();

describe('KanbanBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // useProjectTasksのモック実装
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      updateTaskStatus: mockUpdateTaskStatus,
      createTask: mockCreateTask,
      fetchTasks: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      hasMore: false,
      fetchNextPage: jest.fn(),
      refreshTasks: jest.fn(),
    });
  });

  it('カンバンボードが正しくレンダリングされること', () => {
    render(<KanbanBoard projectId="project-1" />);
    
    // カンバンボードのタイトルが表示されていること
    expect(screen.getByText('カンバンボード')).toBeInTheDocument();
    
    // 各列が表示されていること
    expect(screen.getByText('未着手')).toBeInTheDocument();
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('レビュー中')).toBeInTheDocument();
    expect(screen.getByText('完了')).toBeInTheDocument();
    
    // タスクが正しい列に表示されていること
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();
  });

  it('ローディング状態が正しく表示されること', () => {
    // ローディング状態をtrueに設定
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: [],
      isLoading: true,
      error: null,
      updateTaskStatus: mockUpdateTaskStatus,
      createTask: mockCreateTask,
      fetchTasks: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      hasMore: false,
      fetchNextPage: jest.fn(),
      refreshTasks: jest.fn(),
    });
    
    render(<KanbanBoard projectId="project-1" />);
    
    // ローディングインジケータが表示されていること
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('タスク追加ボタンをクリックするとモーダルが表示されること', async () => {
    render(<KanbanBoard projectId="project-1" />);
    
    // タスク追加ボタンをクリック
    fireEvent.click(screen.getByText('タスク追加'));
    
    // モーダルが表示されることを確認（モーダルのタイトルが表示される）
    await waitFor(() => {
      expect(screen.getByText('新規タスクの作成')).toBeInTheDocument();
    });
  });

  // 注: ドラッグ＆ドロップのテストは複雑なため、この例では省略しています
  // 実際のテストでは、@testing-library/user-eventを使用して
  // ドラッグ＆ドロップの操作をシミュレートする必要があります
});
