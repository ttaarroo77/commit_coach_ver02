import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KanbanBoard } from '@/components/projects/kanban-board';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { Task } from '@/types';

// モックの作成
jest.mock('@/hooks/useProjectTasks', () => ({
  useProjectTasks: jest.fn(),
}));

// @dnd-kit/coreのモック
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: jest.fn(),
  useSensors: jest.fn(),
  MouseSensor: jest.fn(),
  TouchSensor: jest.fn(),
}));

// @dnd-kit/sortableのモック
jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: jest.fn(),
  sortableKeyboardCoordinates: jest.fn(),
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  })),
}));

describe('KanbanBoard', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'タスク1',
      description: 'タスク1の説明',
      status: 'backlog',
      priority: 'high',
      dueDate: '2024-03-01',
      project_id: 'project-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'タスク2',
      description: 'タスク2の説明',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2024-03-02',
      project_id: 'project-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const mockUpdateTaskStatus = jest.fn();
  const mockCreateTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('初期表示時に正しくレンダリングされること', () => {
    render(<KanbanBoard projectId="project-1" />);

    expect(screen.getByText('カンバンボード')).toBeInTheDocument();
    expect(screen.getByText('タスク追加')).toBeInTheDocument();
    expect(screen.getByText('未着手')).toBeInTheDocument();
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('レビュー中')).toBeInTheDocument();
    expect(screen.getByText('完了')).toBeInTheDocument();
  });

  it('タスクが正しいステータス列に表示されること', () => {
    render(<KanbanBoard projectId="project-1" />);

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();

    const backlogColumn = screen.getByText('未着手');
    const inProgressColumn = screen.getByText('進行中');

    expect(backlogColumn.closest('.column')).toContainElement(screen.getByText('タスク1'));
    expect(inProgressColumn.closest('.column')).toContainElement(screen.getByText('タスク2'));
  });

  it('ローディング状態が正しく表示されること', () => {
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

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('タスク追加ボタンをクリックするとモーダルが表示されること', async () => {
    render(<KanbanBoard projectId="project-1" />);

    fireEvent.click(screen.getByText('タスク追加'));

    await waitFor(() => {
      expect(screen.getByText('新規タスクの作成')).toBeInTheDocument();
    });
  });

  it('タスクの作成が正しく処理されること', async () => {
    const newTask = {
      title: '新しいタスク',
      description: '新しいタスクの説明',
      status: 'backlog' as const,
      priority: 'high' as const,
      dueDate: '2024-03-03',
      project_id: 'project-1',
    };

    render(<KanbanBoard projectId="project-1" />);

    fireEvent.click(screen.getByText('タスク追加'));

    await waitFor(() => {
      expect(screen.getByText('新規タスクの作成')).toBeInTheDocument();
    });

    // モーダル内のフォームを埋める
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: newTask.title } });
    fireEvent.change(screen.getByLabelText('説明'), { target: { value: newTask.description } });
    fireEvent.change(screen.getByLabelText('期限'), { target: { value: newTask.dueDate } });

    // 送信ボタンをクリック
    fireEvent.click(screen.getByText('作成'));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(newTask);
    });
  });

  it('エラーが発生した場合にトーストが表示されること', async () => {
    const errorMessage = 'タスクの作成に失敗しました';
    mockCreateTask.mockRejectedValueOnce(new Error(errorMessage));

    render(<KanbanBoard projectId="project-1" />);

    fireEvent.click(screen.getByText('タスク追加'));

    await waitFor(() => {
      expect(screen.getByText('新規タスクの作成')).toBeInTheDocument();
    });

    // モーダル内のフォームを埋める
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: '新しいタスク' } });

    // 送信ボタンをクリック
    fireEvent.click(screen.getByText('作成'));

    await waitFor(() => {
      expect(screen.getByText('エラー')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
