import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanbanBoard from './KanbanBoard';

describe('KanbanBoard', () => {
  const mockTasks = [
    { id: '1', title: 'タスク1', status: 'todo' },
    { id: '2', title: 'タスク2', status: 'inProgress' },
    { id: '3', title: 'タスク3', status: 'done' },
  ];

  it('レンダリングが正しく行われること', () => {
    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={() => { }} />);

    // 各カラムが表示されていることを確認
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    // タスクが正しいカラムに表示されていることを確認
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();
  });

  it('タスクのドラッグ＆ドロップが正しく機能すること', () => {
    const onTaskUpdate = vi.fn();
    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    // ドラッグ＆ドロップのシミュレーション
    const taskElement = screen.getByText('タスク1');
    const targetColumn = screen.getByText('In Progress').closest('.kanban-column');

    fireEvent.dragStart(taskElement);
    fireEvent.dragEnter(targetColumn!);
    fireEvent.dragOver(targetColumn!);
    fireEvent.drop(targetColumn!);

    // onTaskUpdateが正しい引数で呼ばれたことを確認
    expect(onTaskUpdate).toHaveBeenCalledWith('1', 'inProgress');
  });

  it('タスクの追加が正しく機能すること', () => {
    const onTaskUpdate = vi.fn();
    render(<KanbanBoard tasks={mockTasks} onTaskUpdate={onTaskUpdate} />);

    // タスク追加ボタンをクリック
    const addButton = screen.getByText('タスクを追加');
    fireEvent.click(addButton);

    // タスク追加フォームが表示されることを確認
    expect(screen.getByPlaceholderText('タスクのタイトル')).toBeInTheDocument();

    // タスクを追加
    const input = screen.getByPlaceholderText('タスクのタイトル');
    fireEvent.change(input, { target: { value: '新しいタスク' } });
    fireEvent.click(screen.getByText('追加'));

    // onTaskUpdateが正しい引数で呼ばれたことを確認
    expect(onTaskUpdate).toHaveBeenCalledWith(expect.any(String), 'todo');
  });
}); 