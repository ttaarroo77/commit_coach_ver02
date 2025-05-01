import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import KanbanBoard from '../../components/KanbanBoard';

describe('KanbanBoard Accessibility Tests', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'タスク1',
      description: 'タスク1の説明',
      status: 'todo',
    },
  ];

  it('カンバンボードがWCAG 2.1 AAに準拠していること', async () => {
    const onTaskUpdate = vi.fn();
    const { container } = render(
      <KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('カラムヘッダーが適切なARIAラベルを持っていること', () => {
    const onTaskUpdate = vi.fn();
    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    expect(screen.getByRole('heading', { name: 'To Do' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'In Progress' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Done' })).toBeInTheDocument();
  });

  it('タスクカードが適切なARIA属性を持っていること', () => {
    const onTaskUpdate = vi.fn();
    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    const taskCard = screen.getByRole('article');
    expect(taskCard).toHaveAttribute('aria-labelledby', 'task-title-1');
    expect(taskCard).toHaveAttribute('aria-describedby', 'task-description-1');
  });

  it('キーボードナビゲーションが正しく機能すること', () => {
    const onTaskUpdate = vi.fn();
    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    const editButton = screen.getByTestId('edit-button-1');
    expect(editButton).toHaveAttribute('tabindex', '0');
    expect(editButton).toHaveAttribute('aria-label', 'タスク1を編集');
  });
}); 