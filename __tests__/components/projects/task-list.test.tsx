import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList, Task } from '../../../components/projects/task-list';

// テスト用モックデータ
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'テストタスク1',
    description: 'テスト用のタスク説明1',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-05-15',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z',
    projectId: '1',
    tags: ['フロントエンド', 'バグ修正']
  },
  {
    id: '2',
    title: 'テストタスク2',
    description: 'テスト用のタスク説明2',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-05-20',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-04-10T00:00:00Z',
    assigneeId: 'user1',
    assigneeName: '佐藤太郎',
    projectId: '1',
    tags: ['バックエンド']
  },
  {
    id: '3',
    title: 'テストタスク3',
    description: 'テスト用のタスク説明3',
    status: 'done',
    priority: 'low',
    dueDate: '2025-04-10',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-04-05T00:00:00Z',
    assigneeId: 'user2',
    assigneeName: '鈴木次郎',
    projectId: '1',
    tags: ['テスト']
  }
];

// モック関数
const mockOnTaskCreate = jest.fn();
const mockOnTaskEdit = jest.fn();
const mockOnTaskDelete = jest.fn();
const mockOnTaskView = jest.fn();
const mockOnStatusChange = jest.fn();

describe('TaskListコンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('タスクリストが正しく表示される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="1"
        onTaskCreate={mockOnTaskCreate}
        onTaskEdit={mockOnTaskEdit}
        onTaskDelete={mockOnTaskDelete}
        onTaskView={mockOnTaskView}
        onStatusChange={mockOnStatusChange}
      />
    );

    // ヘッダーが表示される
    expect(screen.getByText('タスク一覧')).toBeInTheDocument();
    expect(screen.getByText('タスク追加')).toBeInTheDocument();

    // タスクが表示される
    expect(screen.getByText('テストタスク1')).toBeInTheDocument();
    expect(screen.getByText('テストタスク2')).toBeInTheDocument();
    expect(screen.getByText('テストタスク3')).toBeInTheDocument();

    // タスク行が正しく表示される
    const taskRows = screen.getAllByTestId('task-row');
    expect(taskRows).toHaveLength(3);

    // ステータスバッジが表示される
    expect(screen.getByText('未着手')).toBeInTheDocument();
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('完了')).toBeInTheDocument();

    // 優先度が表示される
    expect(screen.getByText('高')).toBeInTheDocument();
    expect(screen.getByText('中')).toBeInTheDocument();
    expect(screen.getByText('低')).toBeInTheDocument();

    // タグが表示される
    expect(screen.getByText('フロントエンド')).toBeInTheDocument();
    expect(screen.getByText('バグ修正')).toBeInTheDocument();
    expect(screen.getByText('バックエンド')).toBeInTheDocument();

    // 担当者が表示される
    expect(screen.getByText('佐藤太郎')).toBeInTheDocument();
    expect(screen.getByText('鈴木次郎')).toBeInTheDocument();
    expect(screen.getByText('未割り当て')).toBeInTheDocument();
  });

  test('空のタスクリストの場合、メッセージが表示される', () => {
    render(
      <TaskList
        tasks={[]}
        projectId="1"
        onTaskCreate={mockOnTaskCreate}
        onTaskEdit={mockOnTaskEdit}
        onTaskDelete={mockOnTaskDelete}
        onTaskView={mockOnTaskView}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    expect(screen.getByText('このプロジェクトにはまだタスクがありません')).toBeInTheDocument();
  });

  test('タスク追加ボタンをクリックするとコールバックが呼ばれる', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="1"
        onTaskCreate={mockOnTaskCreate}
        onTaskEdit={mockOnTaskEdit}
        onTaskDelete={mockOnTaskDelete}
        onTaskView={mockOnTaskView}
        onStatusChange={mockOnStatusChange}
      />
    );

    const createButton = screen.getByText('タスク追加');
    fireEvent.click(createButton);

    expect(mockOnTaskCreate).toHaveBeenCalledTimes(1);
  });

  test('タスク行をクリックするとonTaskViewが呼ばれる', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="1"
        onTaskCreate={mockOnTaskCreate}
        onTaskEdit={mockOnTaskEdit}
        onTaskDelete={mockOnTaskDelete}
        onTaskView={mockOnTaskView}
        onStatusChange={mockOnStatusChange}
      />
    );

    const taskRows = screen.getAllByTestId('task-row');
    fireEvent.click(taskRows[0]);

    expect(mockOnTaskView).toHaveBeenCalledTimes(1);
    expect(mockOnTaskView).toHaveBeenCalledWith('1');
  });

  test('編集メニューをクリックするとonTaskEditが呼ばれる', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="1"
        onTaskCreate={mockOnTaskCreate}
        onTaskEdit={mockOnTaskEdit}
        onTaskDelete={mockOnTaskDelete}
        onTaskView={mockOnTaskView}
        onStatusChange={mockOnStatusChange}
      />
    );

    // ドロップダウンメニューを開く
    const menuButtons = screen.getAllByRole('button', { name: 'メニューを開く' });
    fireEvent.click(menuButtons[0]);

    // 編集メニューをクリック
    const editMenuItem = screen.getByText('編集');
    fireEvent.click(editMenuItem);

    expect(mockOnTaskEdit).toHaveBeenCalledTimes(1);
    expect(mockOnTaskEdit).toHaveBeenCalledWith(mockTasks[0]);
  });

  test('削除メニューをクリックするとonTaskDeleteが呼ばれる', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="1"
        onTaskCreate={mockOnTaskCreate}
        onTaskEdit={mockOnTaskEdit}
        onTaskDelete={mockOnTaskDelete}
        onTaskView={mockOnTaskView}
        onStatusChange={mockOnStatusChange}
      />
    );

    // ドロップダウンメニューを開く
    const menuButtons = screen.getAllByRole('button', { name: 'メニューを開く' });
    fireEvent.click(menuButtons[0]);

    // 削除メニューをクリック
    const deleteMenuItem = screen.getByText('削除');
    fireEvent.click(deleteMenuItem);

    expect(mockOnTaskDelete).toHaveBeenCalledTimes(1);
    expect(mockOnTaskDelete).toHaveBeenCalledWith('1');
  });

  test('チェックボックスをクリックするとonStatusChangeが呼ばれる', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="1"
        onTaskCreate={mockOnTaskCreate}
        onTaskEdit={mockOnTaskEdit}
        onTaskDelete={mockOnTaskDelete}
        onTaskView={mockOnTaskView}
        onStatusChange={mockOnStatusChange}
      />
    );

    // 最初のタスク（未着手）のチェックボックスをクリック
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
    expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'done');

    // 3番目のタスク（完了）のチェックボックスをクリック
    fireEvent.click(checkboxes[2]);

    expect(mockOnStatusChange).toHaveBeenCalledTimes(2);
    expect(mockOnStatusChange).toHaveBeenCalledWith('3', 'todo');
  });
}); 