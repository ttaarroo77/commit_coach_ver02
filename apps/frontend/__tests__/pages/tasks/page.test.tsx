import { render, screen, waitFor } from '@testing-library/react';
import { TaskListPage } from '@/app/tasks/page';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useProjectTasks');
jest.mock('@/hooks/useAuth');

describe('TaskListPage', () => {
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

  const mockUser = {
    id: '123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
    });

    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    });
  });

  it('タスク一覧が正しく表示されること', async () => {
    render(<TaskListPage />);

    await waitFor(() => {
      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.getByText('タスク2')).toBeInTheDocument();
    });
  });

  it('ローディング中はローディングインジケータが表示されること', () => {
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
    });

    render(<TaskListPage />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('エラーが発生した場合、エラーメッセージが表示されること', () => {
    const errorMessage = 'タスクの取得に失敗しました';
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: false,
      error: errorMessage,
    });

    render(<TaskListPage />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('未認証ユーザーはログインページにリダイレクトされること', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    render(<TaskListPage />);

    expect(screen.getByText('ログインが必要です')).toBeInTheDocument();
  });

  it('タスクの検索が正しく動作すること', async () => {
    render(<TaskListPage />);

    const searchInput = screen.getByPlaceholderText('タスクを検索...');
    fireEvent.change(searchInput, { target: { value: 'タスク1' } });

    await waitFor(() => {
      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.queryByText('タスク2')).not.toBeInTheDocument();
    });
  });

  it('タスクのフィルタリングが正しく動作すること', async () => {
    render(<TaskListPage />);

    const statusSelect = screen.getByLabelText('ステータス');
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });

    await waitFor(() => {
      expect(screen.getByText('タスク2')).toBeInTheDocument();
      expect(screen.queryByText('タスク1')).not.toBeInTheDocument();
    });
  });

  it('新しいタスクの作成が正しく動作すること', async () => {
    const mockCreateTask = jest.fn();
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      createTask: mockCreateTask,
    });

    render(<TaskListPage />);

    const addButton = screen.getByRole('button', { name: 'タスクを追加' });
    fireEvent.click(addButton);

    const titleInput = screen.getByLabelText('タイトル');
    const descriptionInput = screen.getByLabelText('説明');
    const prioritySelect = screen.getByLabelText('優先度');
    const dueDateInput = screen.getByLabelText('期限');

    fireEvent.change(titleInput, { target: { value: '新しいタスク' } });
    fireEvent.change(descriptionInput, { target: { value: '新しいタスクの説明' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(dueDateInput, { target: { value: '2024-03-03' } });

    const saveButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveButton);

    expect(mockCreateTask).toHaveBeenCalledWith({
      title: '新しいタスク',
      description: '新しいタスクの説明',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-03-03',
      projectId: '1',
    });
  });
}); 