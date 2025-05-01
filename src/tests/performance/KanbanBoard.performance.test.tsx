import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanbanBoard from '../../components/KanbanBoard';

describe('KanbanBoard Performance Tests', () => {
  const generateMockTasks = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${i + 1}`,
      title: `タスク${i + 1}`,
      description: `タスク${i + 1}の説明`,
      status: i % 3 === 0 ? 'todo' : i % 3 === 1 ? 'in_progress' : 'done',
    }));
  };

  it('大量のタスクを表示した際のレンダリングパフォーマンス', () => {
    const mockTasks = generateMockTasks(1000);
    const onTaskUpdate = vi.fn();

    const startTime = performance.now();
    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);
    const endTime = performance.now();

    // レンダリング時間が500ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(500);
  });

  it('タスクのドラッグ＆ドロップ時のパフォーマンス', () => {
    const mockTasks = generateMockTasks(100);
    const onTaskUpdate = vi.fn();

    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    const taskElement = screen.getByText('タスク1');
    const startTime = performance.now();
    fireEvent.dragStart(taskElement);
    fireEvent.dragOver(screen.getByText('In Progress'));
    fireEvent.drop(screen.getByText('In Progress'));
    const endTime = performance.now();

    // ドラッグ＆ドロップ操作の時間が100ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(100);
  });

  it('タスクの編集時のパフォーマンス', () => {
    const mockTasks = generateMockTasks(100);
    const onTaskUpdate = vi.fn();

    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    const editButton = screen.getByTestId('edit-button-1');
    const startTime = performance.now();
    fireEvent.click(editButton);
    const endTime = performance.now();

    // 編集モードへの切り替え時間が50ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(50);
  });
}); 