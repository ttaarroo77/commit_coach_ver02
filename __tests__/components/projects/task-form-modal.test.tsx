import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFormModal } from '@/components/projects/task-form-modal';
import { Task } from '@/types';

describe('TaskFormModal', () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('モーダルが正しく表示される', () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('新しいタスクを作成')).toBeInTheDocument();
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('ステータス')).toBeInTheDocument();
  });

  it('フォームの入力と送信が正しく動作する', () => {
    const newTask = {
      title: 'テストタスク',
      description: 'テストの説明',
      status: 'in_progress',
    };

    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const titleInput = screen.getByLabelText('タイトル');
    const descriptionInput = screen.getByLabelText('説明');
    const statusSelect = screen.getByLabelText('ステータス');

    fireEvent.change(titleInput, { target: { value: newTask.title } });
    fireEvent.change(descriptionInput, { target: { value: newTask.description } });
    fireEvent.change(statusSelect, { target: { value: newTask.status } });

    const submitButton = screen.getByRole('button', { name: '作成' });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(newTask);
  });

  it('必須フィールドが空の場合にエラーが表示される', () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: '作成' });
    fireEvent.click(submitButton);

    expect(screen.getByText(/タイトルは必須です/i)).toBeInTheDocument();
  });

  it('モーダルを閉じることができること', () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const closeButton = screen.getByRole('button', { name: '閉じる' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('初期データが正しく表示されること', () => {
    const initialData: Partial<Task> = {
      title: '初期タイトル',
      description: '初期説明',
      status: 'in_progress',
    };

    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={initialData}
      />
    );

    expect(screen.getByLabelText('タイトル')).toHaveValue(initialData.title);
    expect(screen.getByLabelText('説明')).toHaveValue(initialData.description);
    expect(screen.getByLabelText('ステータス')).toHaveValue(initialData.status);
    expect(screen.getByText('タスクを編集')).toBeInTheDocument();
  });
});