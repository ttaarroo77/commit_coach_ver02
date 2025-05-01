import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskFormModal } from '@/components/projects/task-form-modal';
import { Task } from '@/types';

describe('TaskFormModal', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('モーダルが正しく表示される', () => {
    render(
      <TaskFormModal
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
  });

  it('フォームの入力と送信が正しく動作する', async () => {
    const newTask: Partial<Task> = {
      title: 'テストタスク',
      description: 'テストの説明',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-03-01',
      project_id: 'project-1',
    };

    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
      />
    );

    // タイトルを入力
    const titleInput = screen.getByLabelText('タイトル');
    fireEvent.change(titleInput, { target: { value: newTask.title } });

    // 説明を入力
    const descriptionInput = screen.getByLabelText('説明');
    fireEvent.change(descriptionInput, { target: { value: newTask.description } });

    // ステータスを選択
    const statusSelect = screen.getByLabelText('ステータス');
    fireEvent.click(statusSelect);
    const statusOption = screen.getByRole('option', { name: '進行中' });
    fireEvent.click(statusOption);

    // 優先度を選択
    const prioritySelect = screen.getByLabelText('優先度');
    fireEvent.click(prioritySelect);
    const priorityOption = screen.getByRole('option', { name: '高' });
    fireEvent.click(priorityOption);

    // 期限を入力
    const dueDateInput = screen.getByLabelText('期限');
    fireEvent.change(dueDateInput, { target: { value: newTask.dueDate } });

    // フォームを送信
    const submitButton = screen.getByText('作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(newTask);
    });
  });

  it('キャンセルボタンをクリックするとモーダルが閉じる', () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
      />
    );

    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('必須フィールドが空の場合にエラーが表示される', async () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
      />
    );

    // 空のフォームを送信
    const submitButton = screen.getByText('作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
    });
  });
}); 