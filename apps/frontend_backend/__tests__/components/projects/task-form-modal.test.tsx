import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskFormModal } from '@/components/projects/task-form-modal';
import userEvent from '@testing-library/user-event';

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
    const newTask = {
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

    const titleInput = screen.getByLabelText('タイトル');
    const descriptionInput = screen.getByLabelText('説明');
    const statusSelect = screen.getByLabelText('ステータス');
    const prioritySelect = screen.getByLabelText('優先度');
    const dueDateInput = screen.getByLabelText('期限');

    await userEvent.type(titleInput, newTask.title);
    await userEvent.type(descriptionInput, newTask.description);
    await userEvent.selectOptions(statusSelect, newTask.status);
    await userEvent.selectOptions(prioritySelect, newTask.priority);
    await userEvent.type(dueDateInput, newTask.dueDate);

    const submitButton = screen.getByRole('button', { name: '作成' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(newTask);
    });
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

    const submitButton = screen.getByRole('button', { name: '作成' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/タイトルは必須です/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('キャンセルボタンをクリックするとモーダルが閉じる', async () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="project-1"
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
}); 