import { render, screen } from '@testing-library/react';
import { TaskSummaryCard } from '@/components/dashboard/task-summary-card';
import '@testing-library/jest-dom';

describe('TaskSummaryCard', () => {
  const tasks = [
    { id: '1', title: 'タスク1', status: 'in_progress', dueDate: '2099-12-31', project: 'プロジェクトA', subtasks: [] },
    { id: '2', title: 'タスク2', status: 'completed', dueDate: '2099-12-31', project: 'プロジェクトB', subtasks: [{ completed: true }, { completed: false }] },
  ];

  it('タイトルと件数バッジが表示される', () => {
    render(<TaskSummaryCard title="今日のタスク" icon="clock" tasks={tasks} />);
    expect(screen.getByText('今日のタスク')).toBeInTheDocument();
    expect(screen.getByText('2件')).toBeInTheDocument();
  });

  it('タスクタイトル・プロジェクト名・バッジが表示される', () => {
    render(<TaskSummaryCard title="期限間近" icon="alert" tasks={tasks} />);
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('プロジェクトA')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('プロジェクトB')).toBeInTheDocument();
  });

  it('サブタスク進捗が表示される', () => {
    render(<TaskSummaryCard title="期限間近" icon="alert" tasks={tasks} />);
    expect(screen.getByText('サブタスク:')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('すべて表示ボタンが表示される（タスク6件以上）', () => {
    const manyTasks = Array.from({ length: 6 }, (_, i) => ({ id: String(i), title: `タスク${i}`, status: 'in_progress', dueDate: '2099-12-31', project: '', subtasks: [] }));
    render(<TaskSummaryCard title="多い" icon="clock" tasks={manyTasks} />);
    expect(screen.getByText('すべて表示')).toBeInTheDocument();
  });
});
