import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskCard } from '@/components/projects/task-card';
import { useTask } from '@/hooks/useTask';

jest.mock('@/hooks/useTask');

describe('TaskCard', () => {
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
  };

  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();

  beforeEach(() => {
    (useTask as jest.Mock).mockReturnValue({
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
    });
  });

  it('タスク情報が正しく表示されること', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク1の説明')).toBeInTheDocument();
    expect(screen.getByText('未着手')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
    expect(screen.getByText('2024-03-01')).toBeInTheDocument();
    expect(screen.getByText('ユーザー1')).toBeInTheDocument();
  });

  it('ステータスを「進行中」に変更できること', () => {
    render(<TaskCard task={mockTask} />);

    const statusButton = screen.getByRole('button', { name: '未着手' });
    fireEvent.click(statusButton);

    const inProgressOption = screen.getByText('進行中');
    fireEvent.click(inProgressOption);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', {
      status: 'in_progress',
    });
  });

  it('ステータスを「完了」に変更できること', () => {
    render(<TaskCard task={mockTask} />);

    const statusButton = screen.getByRole('button', { name: '未着手' });
    fireEvent.click(statusButton);

    const doneOption = screen.getByText('完了');
    fireEvent.click(doneOption);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', {
      status: 'done',
    });
  });

  it('優先度を「中」に変更できること', () => {
    render(<TaskCard task={mockTask} />);

    const priorityButton = screen.getByRole('button', { name: '高' });
    fireEvent.click(priorityButton);

    const mediumOption = screen.getByText('中');
    fireEvent.click(mediumOption);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', {
      priority: 'medium',
    });
  });

  it('優先度を「低」に変更できること', () => {
    render(<TaskCard task={mockTask} />);

    const priorityButton = screen.getByRole('button', { name: '高' });
    fireEvent.click(priorityButton);

    const lowOption = screen.getByText('低');
    fireEvent.click(lowOption);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', {
      priority: 'low',
    });
  });

  it('タスクの詳細ページに遷移できること', () => {
    const mockRouter = {
      push: jest.fn(),
    };
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockRouter);

    render(<TaskCard task={mockTask} />);

    const titleLink = screen.getByText('タスク1');
    fireEvent.click(titleLink);

    expect(mockRouter.push).toHaveBeenCalledWith('/projects/1/tasks/1');
  });

  it('タスクの編集モーダルが表示されること', () => {
    render(<TaskCard task={mockTask} />);

    const editButton = screen.getByRole('button', { name: '編集' });
    fireEvent.click(editButton);

    expect(screen.getByText('タスクを編集')).toBeInTheDocument();
  });

  it('タスクの削除確認ダイアログが表示されること', () => {
    render(<TaskCard task={mockTask} />);

    const deleteButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(deleteButton);

    expect(screen.getByText('タスクを削除しますか？')).toBeInTheDocument();
  });

  it('期限切れのタスクが赤色で表示されること', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: '2024-02-01',
    };

    render(<TaskCard task={overdueTask} />);

    const dueDate = screen.getByText('2024-02-01');
    expect(dueDate).toHaveStyle({ color: 'red' });
  });

  it('期限が近いタスクが黄色で表示されること', () => {
    const upcomingTask = {
      ...mockTask,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    render(<TaskCard task={upcomingTask} />);

    const dueDate = screen.getByText(upcomingTask.dueDate);
    expect(dueDate).toHaveStyle({ color: 'orange' });
  });

  it('タスクの説明が長い場合、省略表示されること', () => {
    const longDescriptionTask = {
      ...mockTask,
      description: 'これは非常に長いタスクの説明です。'.repeat(10),
    };

    render(<TaskCard task={longDescriptionTask} />);

    const description = screen.getByText(longDescriptionTask.description);
    expect(description).toHaveClass('line-clamp-2');
  });

  it('タスクの編集モーダルで入力値のバリデーションが機能すること', async () => {
    render(<TaskCard task={mockTask} />);

    const editButton = screen.getByRole('button', { name: '編集' });
    fireEvent.click(editButton);

    const titleInput = screen.getByLabelText('タイトル');
    const saveButton = screen.getByRole('button', { name: '保存' });

    // タイトルを空にして保存を試みる
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
    });
  });

  it('タスクの削除確認ダイアログでキャンセルが機能すること', () => {
    render(<TaskCard task={mockTask} />);

    const deleteButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);

    expect(mockDeleteTask).not.toHaveBeenCalled();
  });

  it('タスクの担当者が変更された場合、正しく表示が更新されること', () => {
    const { rerender } = render(<TaskCard task={mockTask} />);

    const updatedTask = {
      ...mockTask,
      assignee: {
        id: '456',
        name: 'ユーザー2',
      },
    };

    rerender(<TaskCard task={updatedTask} />);

    expect(screen.getByText('ユーザー2')).toBeInTheDocument();
    expect(screen.queryByText('ユーザー1')).not.toBeInTheDocument();
  });

  it('タスクの期限が変更された場合、色の表示が正しく更新されること', () => {
    const { rerender } = render(<TaskCard task={mockTask} />);

    const overdueTask = {
      ...mockTask,
      dueDate: '2024-02-01',
    };

    rerender(<TaskCard task={overdueTask} />);

    const dueDate = screen.getByText('2024-02-01');
    expect(dueDate).toHaveStyle({ color: 'red' });
  });

  it('タスクの優先度が変更された場合、アイコンの表示が正しく更新されること', () => {
    const { rerender } = render(<TaskCard task={mockTask} />);

    const lowPriorityTask = {
      ...mockTask,
      priority: 'low',
    };

    rerender(<TaskCard task={lowPriorityTask} />);

    expect(screen.getByText('低')).toBeInTheDocument();
    expect(screen.queryByText('高')).not.toBeInTheDocument();
  });

  it('タスクのステータスが変更された場合、背景色が正しく更新されること', () => {
    const { rerender } = render(<TaskCard task={mockTask} />);

    const inProgressTask = {
      ...mockTask,
      status: 'in_progress',
    };

    rerender(<TaskCard task={inProgressTask} />);

    const card = screen.getByText('タスク1').closest('.task-card');
    expect(card).toHaveClass('bg-blue-50');
  });
}); 