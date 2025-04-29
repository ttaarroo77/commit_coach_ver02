import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from '../../../components/dashboard/task-list';
import { Task } from '../../../types';

// テスト用タスクデータ
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'タスク1',
    completed: false,
    createdAt: new Date('2023-01-01').toISOString(),
  },
  {
    id: '2',
    title: 'タスク2',
    completed: true,
    completedAt: new Date('2023-01-02').toISOString(),
    createdAt: new Date('2023-01-01').toISOString(),
  },
  {
    id: '3',
    title: 'タスク3',
    completed: false,
    createdAt: new Date('2023-01-02').toISOString(),
  },
];

// モックハンドラ
const mockOnDelete = jest.fn();
const mockOnComplete = jest.fn();
const mockOnEdit = jest.fn();

describe('TaskListコンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('タスクリストが正しくレンダリングされる', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={mockOnDelete}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        showCompleted={false}
      />
    );

    // 未完了のタスクのみが表示される
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument();

    // タスクの数が正しい
    const taskItems = screen.getAllByTestId('task-item');
    expect(taskItems).toHaveLength(2);
  });

  test('完了済みタスクを表示するオプション', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={mockOnDelete}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        showCompleted={true}
      />
    );

    // すべてのタスクが表示される
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();

    // タスクの数が正しい
    const taskItems = screen.getAllByTestId('task-item');
    expect(taskItems).toHaveLength(3);
  });

  test('タスクが空の場合メッセージが表示される', () => {
    render(
      <TaskList
        tasks={[]}
        onDelete={mockOnDelete}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        showCompleted={false}
      />
    );

    // 「タスクがありません」というメッセージが表示される
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
  });

  test('削除ボタンクリックで正しいタスクIDが渡される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={mockOnDelete}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        showCompleted={false}
      />
    );

    // 1つ目のタスクの削除ボタンをクリック
    const deleteButtons = screen.getAllByLabelText('タスクを削除');
    fireEvent.click(deleteButtons[0]);

    // 正しいタスクIDでコールバックが呼ばれることを確認
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  test('完了ボタンクリックで正しいタスクIDが渡される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={mockOnDelete}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        showCompleted={false}
      />
    );

    // 1つ目のタスクの完了ボタンをクリック
    const completeButtons = screen.getAllByLabelText('タスクを完了としてマーク');
    fireEvent.click(completeButtons[0]);

    // 正しいタスクIDでコールバックが呼ばれることを確認
    expect(mockOnComplete).toHaveBeenCalledWith('1');
  });

  test('編集ボタンクリックで正しいタスクが渡される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={mockOnDelete}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        showCompleted={false}
      />
    );

    // 1つ目のタスクの編集ボタンをクリック
    const editButtons = screen.getAllByLabelText('タスクを編集');
    fireEvent.click(editButtons[0]);

    // 正しいタスクでコールバックが呼ばれることを確認
    expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0]);
  });
});