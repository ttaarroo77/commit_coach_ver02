import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList, { Task } from '@/components/projects/task-list';

// モックデータ
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: '機能Aの実装',
    description: 'ログイン機能の実装',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    assigneeId: 'user-1',
    assigneeName: '山田太郎',
    projectId: 'project-1',
    tags: ['フロントエンド', '新機能']
  },
  {
    id: 'task-2',
    title: 'バグ修正',
    description: 'ナビゲーションのバグ修正',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date('2023-11-20'),
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-15'),
    assigneeId: 'user-2',
    assigneeName: '佐藤花子',
    projectId: 'project-1',
    tags: ['バグ修正']
  },
  {
    id: 'task-3',
    title: 'デザイン改善',
    description: 'UIデザインの改善',
    status: 'review',
    priority: 'low',
    dueDate: new Date('2023-12-10'),
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-10'),
    assigneeId: 'user-3',
    assigneeName: '鈴木一郎',
    projectId: 'project-1',
    tags: ['デザイン', 'UI/UX']
  }
];

// モック関数
const mockOnCreateTask = jest.fn();
const mockOnEditTask = jest.fn();
const mockOnDeleteTask = jest.fn();
const mockOnViewTask = jest.fn();
const mockOnStatusChange = jest.fn();

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('タスク一覧が正しく表示される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="project-1"
        onCreateTask={mockOnCreateTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onViewTask={mockOnViewTask}
        onStatusChange={mockOnStatusChange}
      />
    );

    // タスクの各タイトルが表示されていることを確認
    expect(screen.getByText('機能Aの実装')).toBeInTheDocument();
    expect(screen.getByText('バグ修正')).toBeInTheDocument();
    expect(screen.getByText('デザイン改善')).toBeInTheDocument();

    // 優先度のラベルが表示されていることを確認
    expect(screen.getByText('高')).toBeInTheDocument();
    expect(screen.getByText('中')).toBeInTheDocument();
    expect(screen.getByText('低')).toBeInTheDocument();

    // 担当者の名前が表示されていることを確認
    expect(screen.getByText('山田太郎')).toBeInTheDocument();
    expect(screen.getByText('佐藤花子')).toBeInTheDocument();
    expect(screen.getByText('鈴木一郎')).toBeInTheDocument();

    // ステータスが表示されていることを確認
    expect(screen.getByText('未着手')).toBeInTheDocument();
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('レビュー中')).toBeInTheDocument();
  });

  test('タスクがない場合は「タスクがありません」メッセージが表示される', () => {
    render(
      <TaskList
        tasks={[]}
        projectId="project-1"
        onCreateTask={mockOnCreateTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onViewTask={mockOnViewTask}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    expect(screen.getByText('タスクを追加する')).toBeInTheDocument();
  });

  test('タスク作成ボタンをクリックするとonCreateTask関数が呼び出される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="project-1"
        onCreateTask={mockOnCreateTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onViewTask={mockOnViewTask}
        onStatusChange={mockOnStatusChange}
      />
    );

    const createButton = screen.getByRole('button', { name: 'タスクを追加' });
    fireEvent.click(createButton);

    expect(mockOnCreateTask).toHaveBeenCalledWith('project-1');
  });

  test('タスクの編集ボタンをクリックするとonEditTask関数が呼び出される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="project-1"
        onCreateTask={mockOnCreateTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onViewTask={mockOnViewTask}
        onStatusChange={mockOnStatusChange}
      />
    );

    // 各タスクの行にマウスオーバーして編集ボタンを表示
    const taskRow = screen.getByText('機能Aの実装').closest('tr');
    if (!taskRow) throw new Error('タスク行が見つかりません');

    fireEvent.mouseEnter(taskRow);

    // 編集ボタンをクリック
    const editButtons = screen.getAllByRole('button', { name: /編集/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEditTask).toHaveBeenCalledWith('task-1');
  });

  test('タスクの削除ボタンをクリックするとonDeleteTask関数が呼び出される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="project-1"
        onCreateTask={mockOnCreateTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onViewTask={mockOnViewTask}
        onStatusChange={mockOnStatusChange}
      />
    );

    // 各タスクの行にマウスオーバーして削除ボタンを表示
    const taskRow = screen.getByText('バグ修正').closest('tr');
    if (!taskRow) throw new Error('タスク行が見つかりません');

    fireEvent.mouseEnter(taskRow);

    // 削除ボタンをクリック
    const deleteButtons = screen.getAllByRole('button', { name: /削除/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDeleteTask).toHaveBeenCalledWith('task-2');
  });

  test('タスク行をクリックするとonViewTask関数が呼び出される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="project-1"
        onCreateTask={mockOnCreateTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onViewTask={mockOnViewTask}
        onStatusChange={mockOnStatusChange}
      />
    );

    // タスク行をクリック（タイトルをクリック）
    fireEvent.click(screen.getByText('デザイン改善'));

    expect(mockOnViewTask).toHaveBeenCalledWith('task-3');
  });

  test('タスクのステータスチェックボックスをクリックするとonStatusChange関数が呼び出される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="project-1"
        onCreateTask={mockOnCreateTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onViewTask={mockOnViewTask}
        onStatusChange={mockOnStatusChange}
      />
    );

    // ステータスのチェックボックスを見つける
    const checkboxes = screen.getAllByRole('checkbox');

    // 未着手タスクのチェックボックスをクリック
    fireEvent.click(checkboxes[0]);

    // 未着手→完了に変更される
    expect(mockOnStatusChange).toHaveBeenCalledWith('task-1', 'done');
  });

  test('日付が正しくフォーマットされて表示される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        projectId="project-1"
        onCreateTask={mockOnCreateTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onViewTask={mockOnViewTask}
        onStatusChange={mockOnStatusChange}
      />
    );

    // フォーマットされた日付が表示されていることを確認
    expect(screen.getByText('2023年12月31日')).toBeInTheDocument();
    expect(screen.getByText('2023年11月20日')).toBeInTheDocument();
    expect(screen.getByText('2023年12月10日')).toBeInTheDocument();
  });
}); 