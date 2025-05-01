import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanbanBoard from '../../components/KanbanBoard';
import TaskCard from '../../components/TaskCard';
import ProjectList from '../../components/ProjectList';

describe('KanbanBoard Integration Tests', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'タスク1',
      description: 'タスク1の説明',
      status: 'todo',
    },
    {
      id: '2',
      title: 'タスク2',
      description: 'タスク2の説明',
      status: 'in_progress',
    },
  ];

  const mockProjects = [
    {
      id: '1',
      name: 'プロジェクト1',
      description: 'プロジェクト1の説明',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    },
  ];

  it('プロジェクト選択時にタスクが正しく表示されること', async () => {
    const onTaskUpdate = vi.fn();
    const onProjectClick = vi.fn();

    render(
      <div>
        <ProjectList
          projects={mockProjects}
          onProjectClick={onProjectClick}
          onProjectDelete={() => { }}
        />
        <KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />
      </div>
    );

    // プロジェクトをクリック
    fireEvent.click(screen.getByText('プロジェクト1'));

    // タスクが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.getByText('タスク2')).toBeInTheDocument();
    });
  });

  it('タスクのドラッグ＆ドロップが正しく機能すること', async () => {
    const onTaskUpdate = vi.fn();

    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    // ドラッグ開始
    const taskElement = screen.getByText('タスク1');
    fireEvent.dragStart(taskElement);

    // ドロップ先の要素を取得
    const dropZone = screen.getByText('In Progress');
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone);

    // タスクの状態が更新されることを確認
    await waitFor(() => {
      expect(onTaskUpdate).toHaveBeenCalledWith('1', {
        ...mockTasks[0],
        status: 'in_progress',
      });
    });
  });

  it('タスクの編集が正しく機能すること', async () => {
    const onTaskUpdate = vi.fn();

    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    // タスクの編集ボタンをクリック
    const editButton = screen.getByTestId('edit-button-1');
    fireEvent.click(editButton);

    // タイトルを編集
    const titleInput = screen.getByTestId('task-title-input-1');
    fireEvent.change(titleInput, { target: { value: '更新されたタスク1' } });

    // 保存ボタンをクリック
    const saveButton = screen.getByTestId('save-button-1');
    fireEvent.click(saveButton);

    // タスクが更新されることを確認
    await waitFor(() => {
      expect(onTaskUpdate).toHaveBeenCalledWith('1', {
        ...mockTasks[0],
        title: '更新されたタスク1',
      });
    });
  });
}); 