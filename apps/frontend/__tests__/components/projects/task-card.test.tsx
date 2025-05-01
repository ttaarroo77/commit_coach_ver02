import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/components/projects/task-card';
import { Task } from '@/types';

// @dnd-kit/sortableのモック
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  })),
}));

describe('TaskCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-03-01',
    project_id: 'project-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('タスクの基本情報が正しく表示されること', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
  });

  it('タスクをクリックするとonClickが呼ばれること', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    const card = screen.getByTestId(`task-${mockTask.id}`);
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledWith(mockTask);
  });

  it('期限切れのタスクが正しく表示されること', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: '2023-01-01',
    };

    render(<TaskCard task={overdueTask} onClick={mockOnClick} />);

    expect(screen.getByText('期限切れ')).toBeInTheDocument();
  });

  it('ドラッグ可能な状態で正しくレンダリングされること', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} isDragging />);

    const card = screen.getByTestId(`task-${mockTask.id}`);
    expect(card).toHaveClass('scale-105');
    expect(card).toHaveClass('rotate-1');
    expect(card).toHaveClass('shadow-xl');
  });

  it('異なる優先度が正しく表示されること', () => {
    const priorities = ['low', 'medium', 'high'] as const;
    const priorityLabels = {
      low: '低',
      medium: '中',
      high: '高',
    };

    priorities.forEach((priority) => {
      const task = {
        ...mockTask,
        priority,
      };

      render(<TaskCard task={task} onClick={mockOnClick} />);
      expect(screen.getByText(priorityLabels[priority])).toBeInTheDocument();
    });
  });
});
