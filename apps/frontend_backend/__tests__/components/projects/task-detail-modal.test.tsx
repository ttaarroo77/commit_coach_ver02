import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskDetailModal } from '@/components/projects/task-detail-modal';
import { Task } from '@/types';

describe('TaskDetailModal', () => {
  const mockTask: Task = {
    id: '1',
    title: 'テストタスク',
    description: 'テストの説明',
    status: 'backlog',
    priority: 'high',
    dueDate: '2024-03-01',
    project_id: 'project-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('タスクの詳細が正しく表示されること', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText('未着手')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
  });

  it('編集ボタンをクリックすると編集モードになること', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(screen.getByLabelText('タイトル')).toHaveValue(mockTask.title);
    expect(screen.getByLabelText('説明')).toHaveValue(mockTask.description);
  });

  it('削除ボタンをクリックするとonDeleteが呼ばれること', async () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    // 確認ダイアログの「削除」ボタンをクリック
    const confirmButton = screen.getByText('削除する');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
    });
  });

  it('完了状態を切り替えることができる', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const completeButton = screen.getByTestId('complete-button');
    fireEvent.click(completeButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTask.id, { completed: true });
  });

  it('閉じるボタンをクリックするとモーダルが閉じること', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const closeButton = screen.getByRole('button', { name: '閉じる' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});