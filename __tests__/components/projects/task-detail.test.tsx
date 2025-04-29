import { render, screen, fireEvent } from '@testing-library/react';
import { TaskDetail } from '../../../components/projects/task-detail';
import { Task } from '../../../components/projects/task-list';

// モック関数
const mockOnClose = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnStatusChange = jest.fn();

// テスト用タスクデータ
const mockTask: Task = {
  id: '1',
  title: 'テストタスク',
  description: 'これはテスト用のタスク説明です。詳細な説明が含まれています。',
  status: 'in-progress',
  priority: 'high',
  dueDate: '2025-05-15',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-04-01T00:00:00Z',
  assigneeId: 'user1',
  assigneeName: '佐藤太郎',
  projectId: '1',
  tags: ['フロントエンド', 'バグ修正']
};

describe('TaskDetailコンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('タスク詳細が正しく表示される', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    // タスク名が表示される
    expect(screen.getByText('テストタスク')).toBeInTheDocument();

    // タスクの説明が表示される
    expect(screen.getByText('これはテスト用のタスク説明です。詳細な説明が含まれています。')).toBeInTheDocument();

    // ステータスが表示される
    expect(screen.getByText('進行中')).toBeInTheDocument();

    // 優先度が表示される
    expect(screen.getByText('高優先度')).toBeInTheDocument();

    // 期限日が表示される
    expect(screen.getByText(/期限日: 2025年05月15日/)).toBeInTheDocument();

    // 作成日が表示される
    expect(screen.getByText(/作成日: 2025年01月01日/)).toBeInTheDocument();

    // 更新日が表示される
    expect(screen.getByText(/更新日: 2025年04月01日/)).toBeInTheDocument();

    // 担当者が表示される
    expect(screen.getByText('佐藤太郎')).toBeInTheDocument();

    // タグが表示される
    expect(screen.getByText('フロントエンド')).toBeInTheDocument();
    expect(screen.getByText('バグ修正')).toBeInTheDocument();

    // ステータス変更ボタンが表示される
    expect(screen.getByRole('button', { name: '未着手' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '進行中' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'レビュー中' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument();

    // 操作ボタンが表示される
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '閉じる' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
  });

  test('編集ボタンをクリックするとonEditが呼ばれる', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('削除ボタンをクリックするとonDeleteが呼ばれる', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const deleteButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('閉じるボタンをクリックするとonCloseが呼ばれる', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const closeButton = screen.getByRole('button', { name: '閉じる' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('ステータス変更ボタンをクリックするとonStatusChangeが呼ばれる', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    // 「完了」ステータスボタンをクリック
    const doneButton = screen.getByRole('button', { name: '完了' });
    fireEvent.click(doneButton);

    expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
    expect(mockOnStatusChange).toHaveBeenCalledWith(mockTask.id, 'done');
  });

  test('タスクデータがない場合はnullを返す', () => {
    const { container } = render(
      <TaskDetail
        task={null}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });
}); 