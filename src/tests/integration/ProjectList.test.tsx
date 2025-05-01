import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectList from '../../components/ProjectList';
import KanbanBoard from '../../components/KanbanBoard';

describe('ProjectList Integration Tests', () => {
  const mockProjects = [
    {
      id: '1',
      name: 'プロジェクト1',
      description: 'プロジェクト1の説明',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    },
    {
      id: '2',
      name: 'プロジェクト2',
      description: 'プロジェクト2の説明',
      createdAt: '2025-01-03T00:00:00Z',
      updatedAt: '2025-01-04T00:00:00Z',
    },
  ];

  const mockTasks = [
    {
      id: '1',
      title: 'タスク1',
      description: 'タスク1の説明',
      status: 'todo',
    },
  ];

  it('プロジェクトリストとカンバンボードが連携して正しく動作すること', async () => {
    const onProjectClick = vi.fn();
    const onTaskUpdate = vi.fn();

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

    // プロジェクトクリックイベントが発火することを確認
    await waitFor(() => {
      expect(onProjectClick).toHaveBeenCalledWith('1');
    });

    // タスクが表示されることを確認
    expect(screen.getByText('タスク1')).toBeInTheDocument();
  });

  it('プロジェクトの検索が正しく機能すること', async () => {
    const onProjectClick = vi.fn();

    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={onProjectClick}
        onProjectDelete={() => { }}
      />
    );

    // 検索ボックスにテキストを入力
    const searchInput = screen.getByPlaceholderText('プロジェクトを検索...');
    fireEvent.change(searchInput, { target: { value: 'プロジェクト2' } });

    // 検索結果が正しく表示されることを確認
    expect(screen.getByText('プロジェクト2')).toBeInTheDocument();
    expect(screen.queryByText('プロジェクト1')).not.toBeInTheDocument();
  });

  it('プロジェクトの削除が正しく機能すること', async () => {
    const onProjectDelete = vi.fn();

    render(
      <ProjectList
        projects={mockProjects}
        onProjectClick={() => { }}
        onProjectDelete={onProjectDelete}
      />
    );

    // 削除ボタンをクリック
    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);

    // 削除イベントが発火することを確認
    await waitFor(() => {
      expect(onProjectDelete).toHaveBeenCalledWith('1');
    });
  });
}); 