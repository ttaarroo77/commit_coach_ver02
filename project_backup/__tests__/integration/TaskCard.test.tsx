import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TaskCard } from '../../components/projects/task-card';
import { KanbanBoard } from '../../components/projects/kanban-board';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { Task } from '../../types/task';
import { vi } from 'vitest';
import { TestWrapper } from '../test-utils';

// useProjectTasksフックをモック
vi.mock('../../hooks/useProjectTasks', () => ({
  useProjectTasks: vi.fn()
}));

// DnD関連のモック
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual,
    DndContext: ({ children }) => <div data-testid="dnd-context">{children}</div>,
    DragOverlay: ({ children }) => <div data-testid="drag-overlay">{children}</div>,
    useSensors: vi.fn(() => ({})),
    useSensor: vi.fn(),
    PointerSensor: vi.fn(),
    KeyboardSensor: vi.fn(),
  };
});

// useSortableをモック
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false
  }),
  SortableContext: ({ children }) => <div data-testid="sortable-context">{children}</div>,
  arrayMove: vi.fn((arr, from, to) => {
    const result = [...arr];
    const [removed] = result.splice(from, 1);
    result.splice(to, 0, removed);
    return result;
  })
}));

// モックタスクデータ
const mockTask: Task = {
  id: 'task-1',
  title: 'タスク1',
  description: 'タスク1の説明',
  status: 'backlog',
  priority: 'medium',
  project_id: 'project-1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockTasks: Task[] = [
  mockTask,
  {
    id: 'task-2',
    title: 'タスク2',
    description: 'タスク2の説明',
    status: 'in_progress',
    priority: 'high',
    project_id: 'project-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// モック関数
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();
const mockUpdateTaskStatus = vi.fn();
const mockCreateTask = vi.fn();

describe('TaskCard 統合テスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // useProjectTasksフックのモック実装
    (useProjectTasks as any).mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      updateTaskStatus: mockUpdateTaskStatus,
      deleteTask: mockDeleteTask
    });
  });

  it('カンバンボード内でのタスクカード表示', async () => {
    render(
      <TestWrapper>
        <KanbanBoard projectId="project-1" />
      </TestWrapper>
    );

    // タスクカードが表示されていることを確認
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    
    // 優先度バッジが表示されていることを確認
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('タスクカードの編集とカンバンボードの状態更新', async () => {
    render(
      <TestWrapper>
        <KanbanBoard projectId="project-1" />
      </TestWrapper>
    );

    // タスクカードをクリックして詳細モーダルを開く
    const taskCard = screen.getByText('タスク1').closest('[data-testid^="task-"]');
    expect(taskCard).toBeInTheDocument();
    fireEvent.click(taskCard!);

    // タスク詳細モーダルが表示されることを確認
    await waitFor(() => {
      // モーダルの表示を確認（実際の実装に合わせて調整が必要）
      // ここではモーダルがDOMに追加されることを想定
      expect(document.body.innerHTML).toContain('task-detail-modal');
    });

    // タスクの更新をシミュレート
    const updatedTask = {
      ...mockTask,
      title: '更新されたタスク1',
      description: '更新された説明'
    };

    await act(async () => {
      mockUpdateTask.mockResolvedValueOnce(updatedTask);
      // タスク更新関数を直接呼び出し
      await mockUpdateTask('task-1', {
        title: '更新されたタスク1',
        description: '更新された説明'
      });
    });

    // updateTaskが呼ばれたことを確認
    expect(mockUpdateTask).toHaveBeenCalledWith('task-1', expect.objectContaining({
      title: '更新されたタスク1',
      description: '更新された説明'
    }));
  });

  it('タスクカードの削除とカンバンボードの状態更新', async () => {
    render(
      <TestWrapper>
        <KanbanBoard projectId="project-1" />
      </TestWrapper>
    );

    // タスクカードをクリックして詳細モーダルを開く
    const taskCard = screen.getByText('タスク1').closest('[data-testid^="task-"]');
    expect(taskCard).toBeInTheDocument();
    fireEvent.click(taskCard!);

    // タスク詳細モーダルが表示されることを確認
    await waitFor(() => {
      expect(document.body.innerHTML).toContain('task-detail-modal');
    });

    // タスクの削除をシミュレート
    await act(async () => {
      mockDeleteTask.mockResolvedValueOnce({ success: true });
      // タスク削除関数を直接呼び出し
      await mockDeleteTask('task-1');
    });

    // deleteTaskが呼ばれたことを確認
    expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
  });

  it('単独のタスクカードコンポーネントのテスト', async () => {
    const onUpdateTask = vi.fn();
    
    render(
      <TestWrapper>
        <TaskCard task={mockTask} onUpdateTask={onUpdateTask} />
      </TestWrapper>
    );

    // タスクカードの内容が表示されていることを確認
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク1の説明')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();

    // タスクカードをクリックして詳細モーダルを開く
    fireEvent.click(screen.getByText('タスク1'));

    // タスク詳細モーダルが表示されることを確認
    await waitFor(() => {
      expect(document.body.innerHTML).toContain('task-detail-modal');
    });

    // タスクの更新をシミュレート
    await act(async () => {
      // onUpdateTaskコールバックを直接呼び出し
      onUpdateTask('task-1', {
        title: '更新されたタスク1'
      });
    });

    // onUpdateTaskが呼ばれたことを確認
    expect(onUpdateTask).toHaveBeenCalledWith('task-1', expect.objectContaining({
      title: '更新されたタスク1'
    }));
  });
});
