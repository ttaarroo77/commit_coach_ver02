import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KanbanBoard } from '@/components/projects/kanban-board';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

jest.mock('@/hooks/useProjectTasks');
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Droppable: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Draggable: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('KanbanBoard', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'タスク1',
      description: 'タスク1の説明',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-03-01',
      assignee: {
        id: '123',
        name: 'ユーザー1',
      },
    },
    {
      id: '2',
      title: 'タスク2',
      description: 'タスク2の説明',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2024-03-02',
      assignee: {
        id: '456',
        name: 'ユーザー2',
      },
    },
    {
      id: '3',
      title: 'タスク3',
      description: 'タスク3の説明',
      status: 'done',
      priority: 'low',
      dueDate: '2024-03-03',
      assignee: {
        id: '789',
        name: 'ユーザー3',
      },
    },
  ];

  const mockUpdateTask = jest.fn();
  const mockCreateTask = jest.fn();

  beforeEach(() => {
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      updateTask: mockUpdateTask,
      createTask: mockCreateTask,
    });
  });

  it('タスクが正しいステータス列に表示されること', () => {
    render(<KanbanBoard projectId="1" />);

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();

    const todoColumn = screen.getByText('未着手');
    const inProgressColumn = screen.getByText('進行中');
    const doneColumn = screen.getByText('完了');

    expect(todoColumn.closest('.column')).toContainElement(screen.getByText('タスク1'));
    expect(inProgressColumn.closest('.column')).toContainElement(screen.getByText('タスク2'));
    expect(doneColumn.closest('.column')).toContainElement(screen.getByText('タスク3'));
  });

  it('タスクをドラッグ&ドロップで移動できること', () => {
    render(<KanbanBoard projectId="1" />);

    const task1 = screen.getByText('タスク1');
    const inProgressColumn = screen.getByText('進行中');

    fireEvent.dragStart(task1);
    fireEvent.dragOver(inProgressColumn);
    fireEvent.drop(inProgressColumn);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', {
      status: 'in_progress',
    });
  });

  it('同じ列内でのタスクの順序変更が正しく動作すること', () => {
    const mockTasksWithMultipleTodo = [
      ...mockTasks,
      {
        id: '4',
        title: 'タスク4',
        description: 'タスク4の説明',
        status: 'todo',
        priority: 'medium',
        dueDate: '2024-03-04',
        assignee: {
          id: '123',
          name: 'ユーザー1',
        },
      },
    ];

    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: mockTasksWithMultipleTodo,
      loading: false,
      error: null,
      updateTask: mockUpdateTask,
    });

    render(<KanbanBoard projectId="1" />);

    const task1 = screen.getByText('タスク1');
    const task4 = screen.getByText('タスク4');

    fireEvent.dragStart(task1);
    fireEvent.dragOver(task4);
    fireEvent.drop(task4);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', {
      order: expect.any(Number),
    });
  });

  it('ローディング中はローディングインジケータが表示されること', () => {
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
    });

    render(<KanbanBoard projectId="1" />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('エラーが発生した場合、エラーメッセージが表示されること', () => {
    const errorMessage = 'タスクの取得に失敗しました';
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: false,
      error: errorMessage,
    });

    render(<KanbanBoard projectId="1" />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('タスクが存在しない場合、空のメッセージが表示されること', () => {
    (useProjectTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
    });

    render(<KanbanBoard projectId="1" />);

    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
  });

  it('タスクの作成フォームが正しく機能すること', async () => {
    render(<KanbanBoard projectId="1" />);

    const addButton = screen.getByRole('button', { name: 'タスクを追加' });
    fireEvent.click(addButton);

    const titleInput = screen.getByLabelText('タイトル');
    const descriptionInput = screen.getByLabelText('説明');
    const saveButton = screen.getByRole('button', { name: '保存' });

    fireEvent.change(titleInput, { target: { value: '新しいタスク' } });
    fireEvent.change(descriptionInput, { target: { value: '新しいタスクの説明' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: '新しいタスク',
        description: '新しいタスクの説明',
        status: 'todo',
        priority: 'medium',
      });
    });
  });

  it('タスクの作成フォームでバリデーションが機能すること', async () => {
    render(<KanbanBoard projectId="1" />);

    const addButton = screen.getByRole('button', { name: 'タスクを追加' });
    fireEvent.click(addButton);

    const saveButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
    });
  });

  it('タスクの作成フォームでキャンセルが機能すること', () => {
    render(<KanbanBoard projectId="1" />);

    const addButton = screen.getByRole('button', { name: 'タスクを追加' });
    fireEvent.click(addButton);

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);

    expect(screen.queryByLabelText('タイトル')).not.toBeInTheDocument();
  });

  it('タスクのフィルタリングが正しく機能すること', () => {
    render(<KanbanBoard projectId="1" />);

    const filterInput = screen.getByPlaceholderText('タスクを検索');
    fireEvent.change(filterInput, { target: { value: 'タスク1' } });

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument();
    expect(screen.queryByText('タスク3')).not.toBeInTheDocument();
  });

  it('タスクの優先度によるフィルタリングが正しく機能すること', () => {
    render(<KanbanBoard projectId="1" />);

    const priorityFilter = screen.getByLabelText('優先度でフィルタ');
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument();
    expect(screen.queryByText('タスク3')).not.toBeInTheDocument();
  });

  it('タスクの担当者によるフィルタリングが正しく機能すること', () => {
    render(<KanbanBoard projectId="1" />);

    const assigneeFilter = screen.getByLabelText('担当者でフィルタ');
    fireEvent.change(assigneeFilter, { target: { value: '123' } });

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument();
    expect(screen.queryByText('タスク3')).not.toBeInTheDocument();
  });

  it('タスクの期限によるフィルタリングが正しく機能すること', () => {
    render(<KanbanBoard projectId="1" />);

    const dateFilter = screen.getByLabelText('期限でフィルタ');
    fireEvent.change(dateFilter, { target: { value: '2024-03-01' } });

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument();
    expect(screen.queryByText('タスク3')).not.toBeInTheDocument();
  });

  it('タスクの並び替えが正しく機能すること', () => {
    render(<KanbanBoard projectId="1" />);

    const sortButton = screen.getByRole('button', { name: '並び替え' });
    fireEvent.click(sortButton);

    const sortByDueDate = screen.getByText('期限順');
    fireEvent.click(sortByDueDate);

    const tasks = screen.getAllByText(/タスク/);
    expect(tasks[0]).toHaveTextContent('タスク1');
    expect(tasks[1]).toHaveTextContent('タスク2');
    expect(tasks[2]).toHaveTextContent('タスク3');
  });
}); 