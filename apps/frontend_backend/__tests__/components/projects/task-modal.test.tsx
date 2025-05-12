import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskModal } from '@/components/projects/task-modal';
import { Task } from '@/types';

describe('TaskModal', () => {
  const mockTask: Task = {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-03-01',
    project_id: 'project-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('新規タスク作成モードで正しくレンダリングされること', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
      />
    );

    expect(screen.getByText('新規タスクの作成')).toBeInTheDocument();
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('ステータス')).toBeInTheDocument();
    expect(screen.getByLabelText('優先度')).toBeInTheDocument();
    expect(screen.getByLabelText('期限')).toBeInTheDocument();
    expect(screen.getByText('作成')).toBeInTheDocument();
  });

  it('タスク編集モードで正しくレンダリングされること', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
        task={mockTask}
      />
    );

    expect(screen.getByText('タスクの編集')).toBeInTheDocument();
    expect(screen.getByDisplayValue('タスク1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('タスク1の説明')).toBeInTheDocument();
    expect(screen.getByDisplayValue('todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-03-01')).toBeInTheDocument();
    expect(screen.getByText('更新')).toBeInTheDocument();
  });

  it('フォームのバリデーションが正しく機能すること', async () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
      />
    );

    // タイトルを空にして送信
    fireEvent.click(screen.getByText('作成'));

    await waitFor(() => {
      expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
    });

    // タイトルを入力
    fireEvent.change(screen.getByLabelText('タイトル'), {
      target: { value: '新しいタスク' },
    });

    // 期限を過去の日付に設定
    fireEvent.change(screen.getByLabelText('期限'), {
      target: { value: '2024-02-01' },
    });

    fireEvent.click(screen.getByText('作成'));

    await waitFor(() => {
      expect(screen.getByText('期限は未来の日付を指定してください')).toBeInTheDocument();
    });
  });

  it('タスクの作成が正しく処理されること', async () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
      />
    );

    // フォームを埋める
    fireEvent.change(screen.getByLabelText('タイトル'), {
      target: { value: '新しいタスク' },
    });
    fireEvent.change(screen.getByLabelText('説明'), {
      target: { value: '新しいタスクの説明' },
    });
    fireEvent.change(screen.getByLabelText('ステータス'), {
      target: { value: 'todo' },
    });
    fireEvent.change(screen.getByLabelText('優先度'), {
      target: { value: 'medium' },
    });
    fireEvent.change(screen.getByLabelText('期限'), {
      target: { value: '2024-03-15' },
    });

    // 送信
    fireEvent.click(screen.getByText('作成'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: '新しいタスク',
        description: '新しいタスクの説明',
        status: 'todo',
        priority: 'medium',
        dueDate: '2024-03-15',
        project_id: 'project-1',
      });
    });
  });

  it('タスクの更新が正しく処理されること', async () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
        task={mockTask}
      />
    );

    // タイトルを変更
    fireEvent.change(screen.getByLabelText('タイトル'), {
      target: { value: '更新されたタスク' },
    });

    // 送信
    fireEvent.click(screen.getByText('更新'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        ...mockTask,
        title: '更新されたタスク',
      });
    });
  });

  it('モーダルを閉じるボタンが正しく機能すること', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
}); 