import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskDetail from '@/components/projects/task-detail';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Task, TaskStatus, TaskPriority } from '@/components/projects/task-list';

// モックデータ
const mockTask = {
  id: 'task-1',
  title: '機能Aの実装',
  description: 'ログイン機能の実装に関するタスクです。認証フローの設計と実装を行います。',
  status: 'in-progress',
  priority: 'high',
  dueDate: '2023-12-31',
  createdAt: '2023-10-01',
  updatedAt: '2023-10-15',
  assigneeId: 'user-1',
  assigneeName: '山田太郎',
  projectId: 'project-1',
  projectName: 'プロジェクトA',
  tags: ['フロントエンド', '新機能'],
  comments: [
    {
      id: 'comment-1',
      content: 'この機能に関する仕様書を確認しました。',
      createdAt: '2023-10-05',
      authorId: 'user-2',
      authorName: '佐藤花子'
    },
    {
      id: 'comment-2',
      content: 'テスト環境での動作も問題なさそうです。',
      createdAt: '2023-10-10',
      authorId: 'user-1',
      authorName: '山田太郎'
    }
  ],
  history: [
    {
      id: 'history-1',
      action: 'status_changed',
      previousValue: 'todo',
      newValue: 'in-progress',
      timestamp: '2023-10-03',
      userId: 'user-1',
      userName: '山田太郎'
    },
    {
      id: 'history-2',
      action: 'assignee_changed',
      previousValue: null,
      newValue: 'user-1',
      timestamp: '2023-10-02',
      userId: 'user-2',
      userName: '佐藤花子'
    }
  ]
};

// サブタスクのモックデータを追加
const mockSubtasks = [
  {
    id: 'subtask-1',
    title: 'サブタスク1',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '2024-03-20',
    assigneeName: '山田太郎',
    isCompleted: false,
  },
  {
    id: 'subtask-2',
    title: 'サブタスク2',
    status: 'in-progress' as TaskStatus,
    priority: 'high' as TaskPriority,
    dueDate: '2024-03-25',
    assigneeName: '鈴木花子',
    isCompleted: true,
  },
];

// モック関数
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnClose = jest.fn();
const mockOnStatusChange = jest.fn();
const mockOnCommentSubmit = jest.fn();

// サブタスク関連のモック関数を追加
const mockOnSubtaskAdd = jest.fn();
const mockOnSubtaskEdit = jest.fn();
const mockOnSubtaskDelete = jest.fn();
const mockOnSubtaskStatusChange = jest.fn();

describe('TaskDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('タスクの詳細が正しく表示される', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    // タスクのタイトルと説明
    expect(screen.getByText('機能Aの実装')).toBeInTheDocument();
    expect(screen.getByText('ログイン機能の実装に関するタスクです。認証フローの設計と実装を行います。')).toBeInTheDocument();

    // ステータスと優先度
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('高優先度')).toBeInTheDocument();

    // 担当者とプロジェクト
    expect(screen.getByText('山田太郎')).toBeInTheDocument();
    expect(screen.getByText('プロジェクトA')).toBeInTheDocument();

    // 期日と作成日
    const formattedDueDate = format(new Date(mockTask.dueDate), 'yyyy年MM月dd日', { locale: ja });
    expect(screen.getByText(`期限日: ${formattedDueDate}`)).toBeInTheDocument();
    expect(screen.getByText(format(new Date(mockTask.createdAt), 'yyyy年MM月dd日', { locale: ja }))).toBeInTheDocument();

    // タグ
    expect(screen.getByText('フロントエンド')).toBeInTheDocument();
    expect(screen.getByText('新機能')).toBeInTheDocument();
  });

  test('タスクがnullの場合、空のコンテンツが表示される', () => {
    render(
      <TaskDetail
        task={null}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    expect(screen.getByText('タスクが選択されていません')).toBeInTheDocument();
  });

  test('編集ボタンをクリックするとonEdit関数が呼び出される', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  test('閉じるボタンをクリックするとonClose関数が呼び出される', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    const closeButton = screen.getByRole('button', { name: '閉じる' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('削除ボタンをクリックするとonDelete関数が呼び出される', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    const deleteButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  test('ステータス変更ボタンをクリックするとonStatusChange関数が呼び出される', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    const statusButton = screen.getByRole('button', { name: '完了' });
    fireEvent.click(statusButton);

    expect(mockOnStatusChange).toHaveBeenCalledWith(mockTask.id, 'done');
  });

  test('コメントが正しく表示される', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    // コメントタブをクリック
    const commentsTab = screen.getByRole('tab', { name: 'コメント' });
    fireEvent.click(commentsTab);

    // コメントの内容が表示されていることを確認
    expect(screen.getByText('この機能に関する仕様書を確認しました。')).toBeInTheDocument();
    expect(screen.getByText('テスト環境での動作も問題なさそうです。')).toBeInTheDocument();

    // コメントの投稿者が表示されていることを確認
    expect(screen.getByText('佐藤花子')).toBeInTheDocument();
    expect(screen.getByText('山田太郎')).toBeInTheDocument();
  });

  test('コメントを投稿できる', async () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    // コメントタブをクリック
    const commentsTab = screen.getByRole('tab', { name: 'コメント' });
    fireEvent.click(commentsTab);

    // コメントを入力
    const commentInput = screen.getByPlaceholderText('コメントを入力...');
    fireEvent.change(commentInput, { target: { value: '新しいコメントです。' } });

    // 投稿ボタンをクリック
    const submitButton = screen.getByRole('button', { name: 'コメントを投稿' });
    fireEvent.click(submitButton);

    // onCommentSubmitが呼び出されることを確認
    await waitFor(() => {
      expect(mockOnCommentSubmit).toHaveBeenCalledWith(mockTask.id, '新しいコメントです。');
    });
  });

  test('タスク履歴が正しく表示される', () => {
    render(
      <TaskDetail
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        onCommentSubmit={mockOnCommentSubmit}
      />
    );

    // 履歴タブをクリック
    const historyTab = screen.getByRole('tab', { name: '履歴' });
    fireEvent.click(historyTab);

    // 履歴の内容が表示されていることを確認
    expect(screen.getByText('ステータスを「未着手」から「進行中」に変更しました')).toBeInTheDocument();
    expect(screen.getByText('担当者を「未割り当て」から「山田太郎」に変更しました')).toBeInTheDocument();

    // 履歴の投稿者が表示されていることを確認
    expect(screen.getByText('山田太郎')).toBeInTheDocument();
    expect(screen.getByText('佐藤花子')).toBeInTheDocument();
  });

  describe('サブタスク機能', () => {
    it('サブタスクが正しく表示されること', () => {
      render(
        <TaskDetail
          task={mockTask}
          isOpen={true}
          onClose={mockOnClose}
          subtasks={mockSubtasks}
          onSubtaskAdd={mockOnSubtaskAdd}
          onSubtaskEdit={mockOnSubtaskEdit}
          onSubtaskDelete={mockOnSubtaskDelete}
          onSubtaskStatusChange={mockOnSubtaskStatusChange}
        />
      );

      // サブタスクタブをクリック
      fireEvent.click(screen.getByText('サブタスク'));

      // サブタスクのタイトルが表示されていることを確認
      expect(screen.getByText('サブタスク1')).toBeInTheDocument();
      expect(screen.getByText('サブタスク2')).toBeInTheDocument();

      // サブタスクの詳細情報が表示されていることを確認
      expect(screen.getByText('中優先度')).toBeInTheDocument();
      expect(screen.getByText('高優先度')).toBeInTheDocument();
      expect(screen.getByText('山田太郎')).toBeInTheDocument();
      expect(screen.getByText('鈴木花子')).toBeInTheDocument();
    });

    it('サブタスクが空の場合、適切なメッセージが表示されること', () => {
      render(
        <TaskDetail
          task={mockTask}
          isOpen={true}
          onClose={mockOnClose}
          subtasks={[]}
          onSubtaskAdd={mockOnSubtaskAdd}
          onSubtaskEdit={mockOnSubtaskEdit}
          onSubtaskDelete={mockOnSubtaskDelete}
          onSubtaskStatusChange={mockOnSubtaskStatusChange}
        />
      );

      // サブタスクタブをクリック
      fireEvent.click(screen.getByText('サブタスク'));

      // 空のメッセージが表示されていることを確認
      expect(screen.getByText('サブタスクはありません')).toBeInTheDocument();
    });

    it('サブタスクを追加できること', async () => {
      render(
        <TaskDetail
          task={mockTask}
          isOpen={true}
          onClose={mockOnClose}
          subtasks={mockSubtasks}
          onSubtaskAdd={mockOnSubtaskAdd}
          onSubtaskEdit={mockOnSubtaskEdit}
          onSubtaskDelete={mockOnSubtaskDelete}
          onSubtaskStatusChange={mockOnSubtaskStatusChange}
        />
      );

      // サブタスクタブをクリック
      fireEvent.click(screen.getByText('サブタスク'));

      // サブタスク追加ボタンをクリック
      fireEvent.click(screen.getByText('サブタスクを追加'));

      // 入力フィールドにテキストを入力
      const input = screen.getByPlaceholderText('サブタスクを追加...');
      fireEvent.change(input, { target: { value: '新しいサブタスク' } });

      // 追加ボタンをクリック
      fireEvent.click(screen.getByText('追加'));

      // コールバックが正しく呼ばれることを確認
      expect(mockOnSubtaskAdd).toHaveBeenCalledWith(mockTask.id, '新しいサブタスク');
    });

    it('サブタスクのステータスを変更できること', () => {
      render(
        <TaskDetail
          task={mockTask}
          isOpen={true}
          onClose={mockOnClose}
          subtasks={mockSubtasks}
          onSubtaskAdd={mockOnSubtaskAdd}
          onSubtaskEdit={mockOnSubtaskEdit}
          onSubtaskDelete={mockOnSubtaskDelete}
          onSubtaskStatusChange={mockOnSubtaskStatusChange}
        />
      );

      // サブタスクタブをクリック
      fireEvent.click(screen.getByText('サブタスク'));

      // チェックボックスをクリック
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);

      // コールバックが正しく呼ばれることを確認
      expect(mockOnSubtaskStatusChange).toHaveBeenCalledWith(mockTask.id, mockSubtasks[0].id, true);
    });

    it('サブタスクを削除できること', () => {
      render(
        <TaskDetail
          task={mockTask}
          isOpen={true}
          onClose={mockOnClose}
          subtasks={mockSubtasks}
          onSubtaskAdd={mockOnSubtaskAdd}
          onSubtaskEdit={mockOnSubtaskEdit}
          onSubtaskDelete={mockOnSubtaskDelete}
          onSubtaskStatusChange={mockOnSubtaskStatusChange}
        />
      );

      // サブタスクタブをクリック
      fireEvent.click(screen.getByText('サブタスク'));

      // 削除ボタンをクリック
      const deleteButtons = screen.getAllByRole('button', { name: /削除/i });
      fireEvent.click(deleteButtons[0]);

      // コールバックが正しく呼ばれることを確認
      expect(mockOnSubtaskDelete).toHaveBeenCalledWith(mockTask.id, mockSubtasks[0].id);
    });

    it('サブタスクの追加をキャンセルできること', () => {
      render(
        <TaskDetail
          task={mockTask}
          isOpen={true}
          onClose={mockOnClose}
          subtasks={mockSubtasks}
          onSubtaskAdd={mockOnSubtaskAdd}
          onSubtaskEdit={mockOnSubtaskEdit}
          onSubtaskDelete={mockOnSubtaskDelete}
          onSubtaskStatusChange={mockOnSubtaskStatusChange}
        />
      );

      // サブタスクタブをクリック
      fireEvent.click(screen.getByText('サブタスク'));

      // サブタスク追加ボタンをクリック
      fireEvent.click(screen.getByText('サブタスクを追加'));

      // キャンセルボタンをクリック
      fireEvent.click(screen.getByText('キャンセル'));

      // フォームが非表示になり、追加ボタンが表示されることを確認
      expect(screen.getByText('サブタスクを追加')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('サブタスクを追加...')).not.toBeInTheDocument();
    });
  });
});