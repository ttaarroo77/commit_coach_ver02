import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/projects/task-card';
import { Task } from '@/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// DnDコンテキストのモック
jest.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {
      'aria-pressed': false,
    },
    listeners: {},
    setNodeRef: jest.fn(),
    isDragging: false,
    transform: null,
  }),
}));

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'テストタスク',
    description: 'これはテスト用のタスクです',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date(2025, 5, 15).toISOString(),
    created_at: new Date(2025, 4, 1).toISOString(),
    updated_at: new Date(2025, 4, 5).toISOString(),
    project_id: 'project-1',
    subtasks: [
      { id: 'subtask-1', title: 'サブタスク1', completed: true },
      { id: 'subtask-2', title: 'サブタスク2', completed: false },
    ],
  };

  it('タスクカードが正しくレンダリングされること', () => {
    render(<TaskCard task={mockTask} />);
    
    // タスクのタイトルが表示されていること
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    
    // 優先度が表示されていること
    expect(screen.getByText('高')).toBeInTheDocument();
    
    // 期限が表示されていること
    const formattedDate = format(new Date(mockTask.due_date), 'M月d日', { locale: ja });
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    
    // サブタスクの進捗が表示されていること
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('期限切れのタスクが適切なスタイルで表示されること', () => {
    const pastDueTask: Task = {
      ...mockTask,
      due_date: new Date(2024, 3, 1).toISOString(), // 過去の日付
    };
    
    const { container } = render(<TaskCard task={pastDueTask} />);
    
    // 期限切れを示す要素があることを確認
    // 注: 実際の実装によって、期限切れの表示方法は異なる可能性があります
    const dueDateElement = screen.getByText(format(new Date(pastDueTask.due_date), 'M月d日', { locale: ja }));
    expect(dueDateElement.closest('div')).toHaveClass('text-red-500');
  });

  it('ドラッグ中のスタイルが適用されること', () => {
    const { container } = render(<TaskCard task={mockTask} isDragging={true} />);
    
    // ドラッグ中のスタイルが適用されていることを確認
    // カードのルート要素にドラッグ中を示すクラスがあることを確認
    expect(container.firstChild).toHaveClass('opacity-50');
  });

  it('完了したタスクが適切に表示されること', () => {
    const completedTask: Task = {
      ...mockTask,
      status: 'completed',
    };
    
    render(<TaskCard task={completedTask} />);
    
    // 完了を示す要素があることを確認
    // 注: 実際の実装によって、完了の表示方法は異なる可能性があります
    const cardElement = screen.getByText('テストタスク').closest('div');
    expect(cardElement).toHaveClass('bg-gray-100');
  });
});
