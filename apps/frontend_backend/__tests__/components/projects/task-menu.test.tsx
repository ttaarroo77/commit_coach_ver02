import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskMenu } from '@/components/projects/task-menu';
import userEvent from '@testing-library/user-event';

describe('TaskMenu', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('メニューボタンをクリックするとドロップダウンが表示される', async () => {
    render(
      <TaskMenu onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const menuButton = screen.getByRole('button');
    await userEvent.click(menuButton);

    expect(screen.getByRole('menuitem', { name: '編集' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '削除' })).toBeInTheDocument();
  });

  it('編集メニューをクリックするとonEdit関数が呼ばれる', async () => {
    render(
      <TaskMenu onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const menuButton = screen.getByRole('button');
    await userEvent.click(menuButton);

    const editButton = screen.getByRole('menuitem', { name: '編集' });
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('削除メニューをクリックするとonDelete関数が呼ばれる', async () => {
    render(
      <TaskMenu onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const menuButton = screen.getByRole('button');
    await userEvent.click(menuButton);

    const deleteButton = screen.getByRole('menuitem', { name: '削除' });
    await userEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
}); 