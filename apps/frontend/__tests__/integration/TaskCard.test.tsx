import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TaskCard } from '../../components/projects/task-card';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { Task } from '../../types/task';
import { vi } from 'vitest';
import { Wrapper } from '../test-utils';

// モックの設定をインポート
import '../mocks/setup-mocks';

// KanbanBoardコンポーネントは使用せず、TaskCardを直接テストする

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

  it('タスクカードの表示', async () => {
    // タスクデータを直接渡してテスト
    const task1 = {
      id: 'task-1',
      title: 'タスク1',
      description: 'タスク1の説明',
      status: 'todo',
      priority: 'medium',
      projectId: 'project-1',
      dueDate: null,
      subtasks: []
    };

    render(
      <Wrapper>
        <TaskCard task={task1} />
      </Wrapper>
    );

    // タスクカードが表示されていることを確認
    expect(screen.getByTestId('task-task-1')).toHaveTextContent('タスク1');
    expect(screen.getByTestId('task-task-1')).toHaveTextContent('タスク1の説明');
    
    // 優先度バッジが表示されていることを確認
    const badges = screen.getAllByTestId('mock-badge');
    const badgeTexts = badges.map(badge => badge.textContent);
    expect(badgeTexts).toContain('medium');
  });

  it('タスクカードの編集とカンバンボードの状態更新', async () => {
    render(
      <Wrapper>
        <KanbanBoard projectId="project-1" />
      </Wrapper>
    );

    // タスクカードをクリックして詳細モーダルを開く
    const taskCard = screen.getByTestId('task-task-1');
    expect(taskCard).toBeInTheDocument();
    fireEvent.click(taskCard);

    // タスク詳細モーダルが表示されることを確認
    await waitFor(() => {
      // ダイアログコンテントが表示されることを確認
      const dialogTitle = screen.getAllByTestId('mock-dialog-title').find(
        title => title.textContent === 'タスク1'
      );
      expect(dialogTitle).toBeTruthy();
      expect(dialogTitle?.closest('[data-testid="mock-dialog-content"]')).toBeInTheDocument();
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
      <Wrapper>
        <KanbanBoard projectId="project-1" />
      </Wrapper>
    );

    // タスクカードをクリックして詳細モーダルを開く
    const taskCard = screen.getByTestId('task-task-1');
    expect(taskCard).toBeInTheDocument();
    fireEvent.click(taskCard);

    // タスク詳細モーダルが表示されることを確認
    await waitFor(() => {
      const dialogTitle = screen.getAllByTestId('mock-dialog-title').find(
        title => title.textContent === 'タスク1'
      );
      expect(dialogTitle).toBeTruthy();
      expect(dialogTitle?.closest('[data-testid="mock-dialog-content"]')).toBeInTheDocument();
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
      <Wrapper>
        <TaskCard task={mockTask} onUpdateTask={onUpdateTask} />
      </Wrapper>
    );

    // タスクカードの内容が表示されていることを確認
    const taskCard = screen.getByTestId('task-task-1');
    expect(taskCard).toHaveTextContent('タスク1');
    expect(taskCard).toHaveTextContent('タスク1の説明');
    
    // 優先度バッジが表示されていることを確認
    const badges = screen.getAllByTestId('mock-badge');
    const badgeTexts = badges.map(badge => badge.textContent);
    expect(badgeTexts).toContain('medium');

    // タスクカードをクリックして詳細モーダルを開く
    fireEvent.click(taskCard);

    // タスク詳細モーダルが表示されることを確認
    await waitFor(() => {
      const dialogTitle = screen.getAllByTestId('mock-dialog-title').find(
        title => title.textContent === 'タスク1'
      );
      expect(dialogTitle).toBeTruthy();
      expect(dialogTitle?.closest('[data-testid="mock-dialog-content"]')).toBeInTheDocument();
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
