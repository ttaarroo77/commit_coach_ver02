import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../../components/TaskCard';
import KanbanBoard from '../../components/KanbanBoard';

describe('TaskCard Integration Tests', () => {
  const mockTask = {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'todo',
  };

  it('タスクカードがカンバンボード内で正しく表示されること', async () => {
    const onTaskUpdate = vi.fn();

    render(
      <KanbanBoard
        tasks={[mockTask]}
        onTaskUpdate={onTaskUpdate}
      />
    );

    // タスクカードの要素が存在することを確認
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク1の説明')).toBeInTheDocument();
  });

  it('タスクカードの編集がカンバンボードの状態を更新すること', async () => {
    const onTaskUpdate = vi.fn();

    render(
      <KanbanBoard
        tasks={[mockTask]}
        onTaskUpdate={onTaskUpdate}
      />
    );

    // 編集ボタンをクリック
    const editButton = screen.getByTestId('edit-button-1');
    fireEvent.click(editButton);

    // タイトルを編集
    const titleInput = screen.getByTestId('task-title-input-1');
    fireEvent.change(titleInput, { target: { value: '更新されたタスク1' } });

    // 保存ボタンをクリック
    const saveButton = screen.getByTestId('save-button-1');
    fireEvent.click(saveButton);

    // カンバンボードの状態が更新されることを確認
    await waitFor(() => {
      expect(onTaskUpdate).toHaveBeenCalledWith('1', {
        ...mockTask,
        title: '更新されたタスク1',
      });
    });
  });

  it('タスクカードの削除がカンバンボードの状態を更新すること', async () => {
    const onTaskUpdate = vi.fn();

    render(
      <KanbanBoard
        tasks={[mockTask]}
        onTaskUpdate={onTaskUpdate}
      />
    );

    // 削除ボタンをクリック
    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);

    // カンバンボードの状態が更新されることを確認
    await waitFor(() => {
      expect(onTaskUpdate).toHaveBeenCalledWith('1', null);
    });
  });
}); 