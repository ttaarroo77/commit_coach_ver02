import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from './TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'テストタスク',
    description: 'テストの説明',
    status: 'todo' as const,
  };

  it('レンダリングが正しく行われること', () => {
    render(
      <TaskCard
        {...mockTask}
        onUpdate={() => { }}
        onDelete={() => { }}
      />
    );

    expect(screen.getByTestId('task-title')).toHaveTextContent('テストタスク');
    expect(screen.getByTestId('task-description')).toHaveTextContent('テストの説明');
    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('編集モードに切り替わること', () => {
    render(
      <TaskCard
        {...mockTask}
        onUpdate={() => { }}
        onDelete={() => { }}
      />
    );

    fireEvent.click(screen.getByTestId('edit-button'));

    expect(screen.getByTestId('task-title-input')).toHaveValue('テストタスク');
    expect(screen.getByTestId('task-description-input')).toHaveValue('テストの説明');
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('タスクの更新が正しく機能すること', () => {
    const onUpdate = vi.fn();
    render(
      <TaskCard
        {...mockTask}
        onUpdate={onUpdate}
        onDelete={() => { }}
      />
    );

    fireEvent.click(screen.getByTestId('edit-button'));
    fireEvent.change(screen.getByTestId('task-title-input'), {
      target: { value: '更新されたタスク' },
    });
    fireEvent.change(screen.getByTestId('task-description-input'), {
      target: { value: '更新された説明' },
    });
    fireEvent.click(screen.getByTestId('save-button'));

    expect(onUpdate).toHaveBeenCalledWith('1', {
      title: '更新されたタスク',
      description: '更新された説明',
    });
  });

  it('編集のキャンセルが正しく機能すること', () => {
    render(
      <TaskCard
        {...mockTask}
        onUpdate={() => { }}
        onDelete={() => { }}
      />
    );

    fireEvent.click(screen.getByTestId('edit-button'));
    fireEvent.change(screen.getByTestId('task-title-input'), {
      target: { value: '変更されたタスク' },
    });
    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(screen.getByTestId('task-title')).toHaveTextContent('テストタスク');
    expect(screen.getByTestId('task-description')).toHaveTextContent('テストの説明');
  });

  it('タスクの削除が正しく機能すること', () => {
    const onDelete = vi.fn();
    render(
      <TaskCard
        {...mockTask}
        onUpdate={() => { }}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByTestId('delete-button'));

    expect(onDelete).toHaveBeenCalledWith('1');
  });
});