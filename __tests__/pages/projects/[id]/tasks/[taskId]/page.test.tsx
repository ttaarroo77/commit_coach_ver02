import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TaskDetailPage } from '@/app/projects/[id]/tasks/[taskId]/page';
import { useTask } from '@/hooks/useTask';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useTask');
jest.mock('@/hooks/useAuth');

describe('TaskDetailPage', () => {
  const mockTask = {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-03-01',
    assignee: {
      id: '123',
      name: 'ユーザー1',
    },
    comments: [
      {
        id: '1',
        content: 'コメント1',
        createdAt: '2024-03-01T10:00:00Z',
        user: {
          id: '123',
          name: 'ユーザー1',
        },
      },
    ],
  };

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

    (useTask as jest.Mock).mockReturnValue({
      task: mockTask,
      loading: false,
      error: null,
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      addComment: jest.fn(),
    });
  });

  it('タスク情報が正しく表示されること', async () => {
    render(<TaskDetailPage params={{ id: '1', taskId: '1' }} />);

    await waitFor(() => {
      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.getByText('タスク1の説明')).toBeInTheDocument();
      expect(screen.getByText('ステータス: 未着手')).toBeInTheDocument();
      expect(screen.getByText('優先度: 高')).toBeInTheDocument();
      expect(screen.getByText('期限: 2024-03-01')).toBeInTheDocument();
      expect(screen.getByText('担当者: ユーザー1')).toBeInTheDocument();
    });
  });

  it('ローディング中はローディングインジケータが表示されること', () => {
    (useTask as jest.Mock).mockReturnValue({
      task: null,
      loading: true,
      error: null,
    });

    render(<TaskDetailPage params={{ id: '1', taskId: '1' }} />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('エラーが発生した場合、エラーメッセージが表示されること', () => {
    const errorMessage = 'タスクの取得に失敗しました';
    (useTask as jest.Mock).mockReturnValue({
      task: null,
      loading: false,
      error: errorMessage,
    });

    render(<TaskDetailPage params={{ id: '1', taskId: '1' }} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('未認証ユーザーはログインページにリダイレクトされること', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    render(<TaskDetailPage params={{ id: '1', taskId: '1' }} />);

    expect(screen.getByText('ログインが必要です')).toBeInTheDocument();
  });

  it('タスクの更新が正しく動作すること', async () => {
    const mockUpdateTask = jest.fn();
    (useTask as jest.Mock).mockReturnValue({
      task: mockTask,
      loading: false,
      error: null,
      updateTask: mockUpdateTask,
    });

    render(<TaskDetailPage params={{ id: '1', taskId: '1' }} />);

    const editButton = screen.getByRole('button', { name: 'タスクを編集' });
    fireEvent.click(editButton);

    const titleInput = screen.getByLabelText('タイトル');
    const descriptionInput = screen.getByLabelText('説明');
    const statusSelect = screen.getByLabelText('ステータス');
    const prioritySelect = screen.getByLabelText('優先度');
    const dueDateInput = screen.getByLabelText('期限');

    fireEvent.change(titleInput, { target: { value: '更新されたタスク' } });
    fireEvent.change(descriptionInput, { target: { value: '更新された説明' } });
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });
    fireEvent.change(dueDateInput, { target: { value: '2024-03-02' } });

    const saveButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveButton);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', {
      title: '更新されたタスク',
      description: '更新された説明',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2024-03-02',
    });
  });

  it('タスクの削除が正しく動作すること', async () => {
    const mockDeleteTask = jest.fn();
    (useTask as jest.Mock).mockReturnValue({
      task: mockTask,
      loading: false,
      error: null,
      deleteTask: mockDeleteTask,
    });

    render(<TaskDetailPage params={{ id: '1', taskId: '1' }} />);

    const deleteButton = screen.getByRole('button', { name: 'タスクを削除' });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(confirmButton);

    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  it('コメントの追加が正しく動作すること', async () => {
    const mockAddComment = jest.fn();
    (useTask as jest.Mock).mockReturnValue({
      task: mockTask,
      loading: false,
      error: null,
      addComment: mockAddComment,
    });

    render(<TaskDetailPage params={{ id: '1', taskId: '1' }} />);

    const commentInput = screen.getByPlaceholderText('コメントを入力...');
    fireEvent.change(commentInput, { target: { value: '新しいコメント' } });

    const submitButton = screen.getByRole('button', { name: 'コメントを投稿' });
    fireEvent.click(submitButton);

    expect(mockAddComment).toHaveBeenCalledWith('1', '新しいコメント');
  });

  it('コメント一覧が正しく表示されること', async () => {
    render(<TaskDetailPage params={{ id: '1', taskId: '1' }} />);

    await waitFor(() => {
      expect(screen.getByText('コメント1')).toBeInTheDocument();
      expect(screen.getByText('ユーザー1')).toBeInTheDocument();
      expect(screen.getByText('2024-03-01 19:00')).toBeInTheDocument();
    });
  });
}); 