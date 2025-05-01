import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../../components/TaskCard';

describe('TaskCard Performance Tests', () => {
  const mockTask = {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'todo',
  };

  it('タスクカードのレンダリングパフォーマンス', () => {
    const onTaskUpdate = vi.fn();
    const onTaskDelete = vi.fn();

    const startTime = performance.now();
    render(
      <TaskCard
        task={mockTask}
        onUpdate={onTaskUpdate}
        onDelete={onTaskDelete}
      />
    );
    const endTime = performance.now();

    // レンダリング時間が50ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(50);
  });

  it('タスクカードの編集モード切り替えパフォーマンス', () => {
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
    const startTime = performance.now();
    fireEvent.click(editButton);
    const endTime = performance.now();

    // 編集モードへの切り替え時間が30ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(30);
  });

  it('タスクカードの保存操作パフォーマンス', () => {
    const onTaskUpdate = vi.fn();
    const onTaskDelete = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onUpdate={onTaskUpdate}
        onDelete={onTaskDelete}
      />
    );

    // 編集モードに切り替え
    fireEvent.click(screen.getByTestId('edit-button-1'));

    // タイトルを編集
    const titleInput = screen.getByTestId('task-title-input-1');
    fireEvent.change(titleInput, { target: { value: '更新されたタスク1' } });

    const saveButton = screen.getByTestId('save-button-1');
    const startTime = performance.now();
    fireEvent.click(saveButton);
    const endTime = performance.now();

    // 保存操作の時間が50ms以内であることを確認
    expect(endTime - startTime).toBeLessThan(50);
  });
}); 