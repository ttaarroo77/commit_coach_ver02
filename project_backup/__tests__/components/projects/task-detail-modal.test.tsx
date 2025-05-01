import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(screen.getByLabelText('タイトル')).toHaveValue(mockTask.title);
    expect(screen.getByLabelText('説明')).toHaveValue(mockTask.description);
  });

  it('タスクの更新ができること', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const titleInput = screen.getByLabelText('タイトル');
    const descriptionInput = screen.getByLabelText('説明');
    const saveButton = screen.getByText('保存');

    fireEvent.change(titleInput, { target: { value: '更新されたタイトル' } });
    fireEvent.change(descriptionInput, { target: { value: '更新された説明' } });
    fireEvent.click(saveButton);

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockTask,
      title: '更新されたタイトル',
      description: '更新された説明',
    });
  });

  it('タスクの削除ができること', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('モーダルを閉じることができること', () => {
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