import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '@/components/projects/task-form';
import { format } from 'date-fns';

// モックデータ
const mockProjects = [
  { id: 'project-1', name: 'プロジェクトA' },
  { id: 'project-2', name: 'プロジェクトB' }
];

const mockMembers = [
  { id: 'user-1', name: '山田太郎' },
  { id: 'user-2', name: '佐藤花子' }
];

const mockTask = {
  id: 'task-1',
  title: '機能Aの実装',
  description: 'ログイン機能の実装に関するタスクです。',
  status: 'in_progress',
  priority: 'high',
  dueDate: new Date('2023-12-31'),
  assigneeId: 'user-1',
  projectId: 'project-1',
  tags: ['フロントエンド', '新機能']
};

// モック関数
const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('新規作成モードでフォームが正しくレンダリングされる', () => {
    render(
      <TaskForm
        projects={mockProjects}
        members={mockMembers}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // フォームのタイトルが正しい
    expect(screen.getByText('新規タスク作成')).toBeInTheDocument();

    // フォームの各項目が存在する
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('ステータス')).toBeInTheDocument();
    expect(screen.getByLabelText('優先度')).toBeInTheDocument();
    expect(screen.getByLabelText('プロジェクト')).toBeInTheDocument();
    expect(screen.getByLabelText('担当者')).toBeInTheDocument();
    expect(screen.getByLabelText('期日')).toBeInTheDocument();

    // ボタンが存在する
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  test('編集モードでフォームが初期値とともに正しくレンダリングされる', () => {
    render(
      <TaskForm
        task={mockTask}
        projects={mockProjects}
        members={mockMembers}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // フォームのタイトルが正しい
    expect(screen.getByText('タスクの編集')).toBeInTheDocument();

    // 初期値が正しく設定されている
    expect(screen.getByLabelText('タイトル')).toHaveValue('機能Aの実装');
    expect(screen.getByLabelText('説明')).toHaveValue('ログイン機能の実装に関するタスクです。');

    // セレクトボックスの初期値
    expect(screen.getByDisplayValue('進行中')).toBeInTheDocument();
    expect(screen.getByDisplayValue('高')).toBeInTheDocument();
    expect(screen.getByDisplayValue('プロジェクトA')).toBeInTheDocument();
    expect(screen.getByDisplayValue('山田太郎')).toBeInTheDocument();

    // タグが表示されている
    expect(screen.getByText('フロントエンド')).toBeInTheDocument();
    expect(screen.getByText('新機能')).toBeInTheDocument();
  });

  test('キャンセルボタンをクリックするとonClose関数が呼び出される', () => {
    render(
      <TaskForm
        projects={mockProjects}
        members={mockMembers}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('有効なデータを入力して送信するとonSubmit関数が呼び出される', async () => {
    render(
      <TaskForm
        projects={mockProjects}
        members={mockMembers}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // フォームに値を入力
    fireEvent.change(screen.getByLabelText('タイトル'), {
      target: { value: 'テストタスク' }
    });

    fireEvent.change(screen.getByLabelText('説明'), {
      target: { value: 'これはテスト用のタスクです。' }
    });

    // セレクトボックスの選択
    fireEvent.change(screen.getByLabelText('ステータス'), {
      target: { value: 'todo' }
    });

    fireEvent.change(screen.getByLabelText('優先度'), {
      target: { value: 'medium' }
    });

    fireEvent.change(screen.getByLabelText('プロジェクト'), {
      target: { value: 'project-1' }
    });

    fireEvent.change(screen.getByLabelText('担当者'), {
      target: { value: 'user-2' }
    });

    // 期日の設定（今日から1週間後）
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    const formattedDate = format(oneWeekLater, 'yyyy-MM-dd');
    fireEvent.change(screen.getByLabelText('期日'), {
      target: { value: formattedDate }
    });

    // タグの追加
    const tagInput = screen.getByPlaceholderText('新しいタグを追加...');
    fireEvent.change(tagInput, { target: { value: 'テスト' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

    // フォームの送信
    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    // onSubmit関数が正しいデータで呼ばれることを確認
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'テストタスク',
        description: 'これはテスト用のタスクです。',
        status: 'todo',
        priority: 'medium',
        projectId: 'project-1',
        assigneeId: 'user-2',
        dueDate: expect.any(Date),
        tags: ['テスト']
      }));
    });
  });

  test('必須フィールドが空の場合はバリデーションエラーが表示される', async () => {
    render(
      <TaskForm
        projects={mockProjects}
        members={mockMembers}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // タイトルを空にする
    const titleInput = screen.getByLabelText('タイトル');
    fireEvent.change(titleInput, { target: { value: '' } });

    // フォームの送信
    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    // バリデーションエラーが表示される
    await waitFor(() => {
      expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
    });

    // onSubmit関数は呼ばれない
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('タグの追加と削除が正しく動作する', () => {
    render(
      <TaskForm
        projects={mockProjects}
        members={mockMembers}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // タグの追加
    const tagInput = screen.getByPlaceholderText('新しいタグを追加...');

    // 1つ目のタグを追加
    fireEvent.change(tagInput, { target: { value: 'タグ1' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('タグ1')).toBeInTheDocument();

    // 2つ目のタグを追加
    fireEvent.change(tagInput, { target: { value: 'タグ2' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('タグ2')).toBeInTheDocument();

    // タグの削除
    const removeButtons = screen.getAllByRole('button', { name: 'タグを削除' });
    fireEvent.click(removeButtons[0]); // 1つ目のタグを削除

    // 削除されたタグがなくなり、残りのタグは表示されている
    expect(screen.queryByText('タグ1')).not.toBeInTheDocument();
    expect(screen.getByText('タグ2')).toBeInTheDocument();
  });

  test('重複するタグは追加されない', () => {
    render(
      <TaskForm
        projects={mockProjects}
        members={mockMembers}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const tagInput = screen.getByPlaceholderText('新しいタグを追加...');

    // タグを追加
    fireEvent.change(tagInput, { target: { value: '重複タグ' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('重複タグ')).toBeInTheDocument();

    // 同じタグを再度追加しようとする
    fireEvent.change(tagInput, { target: { value: '重複タグ' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

    // タグの出現回数は1回のまま
    const tagElements = screen.getAllByText('重複タグ');
    expect(tagElements.length).toBe(1);
  });

  test('空のタグは追加されない', () => {
    render(
      <TaskForm
        projects={mockProjects}
        members={mockMembers}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const tagInput = screen.getByPlaceholderText('新しいタグを追加...');

    // 空文字のタグを追加しようとする
    fireEvent.change(tagInput, { target: { value: '' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

    // タグが追加されていないことを確認
    const tagContainer = screen.getByTestId('tag-container');
    expect(tagContainer.children.length).toBe(1); // 入力フィールドのみ
  });
});