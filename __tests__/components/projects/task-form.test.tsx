import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../../../components/projects/task-form';
import { Task } from '../../../components/projects/task-list';

// モック関数
const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

// テスト用タスクデータ
const mockTask: Task = {
  id: '1',
  title: 'テストタスク',
  description: 'これはテスト用のタスク説明です',
  status: 'in-progress',
  priority: 'medium',
  dueDate: '2025-05-15',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-04-01T00:00:00Z',
  projectId: '1',
  assigneeId: 'user1',
  assigneeName: '佐藤太郎',
  tags: ['テスト', 'バグ修正']
};

// テスト用チームメンバーデータ
const mockTeamMembers = [
  { id: 'user1', name: '佐藤太郎' },
  { id: 'user2', name: '鈴木次郎' },
  { id: 'user3', name: '田中三郎' }
];

describe('TaskFormコンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('新規作成モードでフォームが正しく表示される', () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="1"
        teamMembers={mockTeamMembers}
        title="新規タスク"
      />
    );

    // タイトルが表示される
    expect(screen.getByText('新規タスク')).toBeInTheDocument();

    // フォーム要素が表示される
    expect(screen.getByLabelText('タスク名')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('ステータス')).toBeInTheDocument();
    expect(screen.getByLabelText('優先度')).toBeInTheDocument();
    expect(screen.getByLabelText('期限日')).toBeInTheDocument();
    expect(screen.getByLabelText('担当者')).toBeInTheDocument();
    expect(screen.getByLabelText('タグ')).toBeInTheDocument();

    // ボタンが表示される
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  test('編集モードでフォームが初期値で表示される', () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={mockTask}
        projectId="1"
        teamMembers={mockTeamMembers}
        title="タスクを編集"
      />
    );

    // タイトルが表示される
    expect(screen.getByText('タスクを編集')).toBeInTheDocument();

    // フォーム要素が初期値で表示される
    expect(screen.getByLabelText('タスク名')).toHaveValue('テストタスク');
    expect(screen.getByLabelText('説明')).toHaveValue('これはテスト用のタスク説明です');

    // タグが表示される
    expect(screen.getByText('テスト')).toBeInTheDocument();
    expect(screen.getByText('バグ修正')).toBeInTheDocument();
  });

  test('キャンセルボタンをクリックするとonCloseが呼ばれる', () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="1"
        teamMembers={mockTeamMembers}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('有効なデータでフォームを送信するとonSubmitが呼ばれる', async () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="1"
        teamMembers={mockTeamMembers}
      />
    );

    // フォームに値を入力
    const titleInput = screen.getByLabelText('タスク名');
    fireEvent.change(titleInput, { target: { value: '新しいタスク' } });

    const descriptionInput = screen.getByLabelText('説明');
    fireEvent.change(descriptionInput, { target: { value: '新しいタスクの説明' } });

    // フォームを送信
    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    // onSubmitが正しい値で呼ばれることを確認
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '新しいタスク',
          description: '新しいタスクの説明',
          status: 'todo',
          priority: 'medium',
        })
      );
    });

    // フォームが閉じられることを確認
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('タグを追加できる', async () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="1"
        teamMembers={mockTeamMembers}
      />
    );

    // タグ入力欄に値を入力
    const tagInput = screen.getByPlaceholderText('タグを入力');
    fireEvent.change(tagInput, { target: { value: '新しいタグ' } });

    // 追加ボタンをクリック
    const addButton = screen.getByRole('button', { name: '' });
    fireEvent.click(addButton);

    // タグが追加されることを確認
    expect(screen.getByText('新しいタグ')).toBeInTheDocument();
  });

  test('タグを削除できる', async () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={mockTask}
        projectId="1"
        teamMembers={mockTeamMembers}
      />
    );

    // 最初にタグが表示されていることを確認
    expect(screen.getByText('テスト')).toBeInTheDocument();

    // タグの削除ボタンをクリック
    const removeButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(removeButtons[0]); // 最初のタグの削除ボタンをクリック

    // タグが削除されることを確認
    expect(screen.queryByText('テスト')).not.toBeInTheDocument();
  });

  test('担当者を選択できる', async () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projectId="1"
        teamMembers={mockTeamMembers}
      />
    );

    // 担当者選択のトリガーをクリック
    const assigneeSelect = screen.getByRole('combobox', { name: '担当者' });
    fireEvent.click(assigneeSelect);

    // 担当者を選択
    const assigneeOption = screen.getByRole('option', { name: '田中三郎' });
    fireEvent.click(assigneeOption);

    // フォームを送信
    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    // 正しい担当者IDで送信されることを確認
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          assigneeId: 'user3',
        })
      );
    });
  });
});