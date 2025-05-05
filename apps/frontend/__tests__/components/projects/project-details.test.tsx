import { render, screen } from '@testing-library/react';
import { ProjectDetails } from '@/components/projects/project-details';
import '@testing-library/jest-dom';

describe('ProjectDetails', () => {
  const project = {
    id: '1',
    name: 'テストプロジェクト',
    description: '説明文',
    created_at: '2025-05-04T12:00:00Z',
    updated_at: '2025-05-05T12:00:00Z',
  };
  const tasks = [
    { id: 't1', title: 'タスク1', description: 'タスク説明1', status: 'todo', created_at: '2025-05-04T12:00:00Z' },
    { id: 't2', title: 'タスク2', description: 'タスク説明2', status: 'done', created_at: '2025-05-05T12:00:00Z' },
  ];

  it('プロジェクト名・説明・作成日・更新日が表示される', () => {
    render(<ProjectDetails project={project} tasks={tasks} />);
    expect(screen.getByText('テストプロジェクト')).toBeInTheDocument();
    expect(screen.getByText('説明文')).toBeInTheDocument();
    expect(screen.getByText('作成日')).toBeInTheDocument();
    expect(screen.getByText('更新日')).toBeInTheDocument();
  });

  it('タスク一覧が表示される', () => {
    render(<ProjectDetails project={project} tasks={tasks} />);
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク説明1')).toBeInTheDocument();
    expect(screen.getByText('タスク説明2')).toBeInTheDocument();
  });
});
