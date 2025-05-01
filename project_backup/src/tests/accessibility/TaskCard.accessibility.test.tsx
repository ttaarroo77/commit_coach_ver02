import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import TaskCard from '../../components/TaskCard';

describe('TaskCard Accessibility Tests', () => {
  const mockTask = {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'todo',
  };

  it('タスクカードがWCAG 2.1 AAに準拠していること', async () => {
    const onTaskUpdate = vi.fn();
    const onTaskDelete = vi.fn();
    const { container } = render(
      <TaskCard
        task={mockTask}
        onUpdate={onTaskUpdate}
        onDelete={onTaskDelete}
      />
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('タスクカードが適切なARIA属性を持っていること', () => {
    const onTaskUpdate = vi.fn();
    const onTaskDelete = vi.fn();
    render(
      <TaskCard
        task={mockTask}
        onUpdate={onTaskUpdate}
        onDelete={onTaskDelete}
      />
    );

    const taskCard = screen.getByRole('article');
    expect(taskCard).toHaveAttribute('aria-labelledby', 'task-title-1');
    expect(taskCard).toHaveAttribute('aria-describedby', 'task-description-1');
  });

  it('編集モードのアクセシビリティ', () => {
    const onTaskUpdate = vi.fn();
    const onTaskDelete = vi.fn();
    render(
      <TaskCard
        task={mockTask}
        onUpdate={onTaskUpdate}
        onDelete={onTaskDelete}
      />
    );

    const editButton = screen.getByTestId('edit-button-1');
    fireEvent.click(editButton);

    const titleInput = screen.getByTestId('task-title-input-1');
    expect(titleInput).toHaveAttribute('aria-label', 'タスクのタイトル');
    expect(titleInput).toHaveAttribute('aria-required', 'true');

    const descriptionInput = screen.getByTestId('task-description-input-1');
    expect(descriptionInput).toHaveAttribute('aria-label', 'タスクの説明');
  });

  it('キーボードナビゲーションが正しく機能すること', () => {
    const onTaskUpdate = vi.fn();
    const onTaskDelete = vi.fn();
    render(
      <TaskCard
        task={mockTask}
        onUpdate={onTaskUpdate}
        onDelete={onTaskDelete}
      />
    );

    const editButton = screen.getByTestId('edit-button-1');
    expect(editButton).toHaveAttribute('tabindex', '0');
    expect(editButton).toHaveAttribute('aria-label', 'タスク1を編集');

    const deleteButton = screen.getByTestId('delete-button-1');
    expect(deleteButton).toHaveAttribute('tabindex', '0');
    expect(deleteButton).toHaveAttribute('aria-label', 'タスク1を削除');
  });
}); 