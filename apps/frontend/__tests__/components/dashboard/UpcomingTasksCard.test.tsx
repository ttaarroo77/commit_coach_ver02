import React from 'react';
import { render, screen } from '@testing-library/react';
import { UpcomingTasksCard } from '@/components/dashboard/UpcomingTasksCard';
import type { Task } from '@/types/dashboard';

// Dateのモック用関数
const mockDate = (date: Date) => {
  const originalDate = global.Date;
  jest.spyOn(global, 'Date')
    .mockImplementation((args: any) => {
      if (args) {
        return new originalDate(args);
      }
      return date;
    });
};

describe('UpcomingTasksCard Component', () => {
  // テスト用の固定日付（2025年4月23日）
  const fixedDate = new Date('2025-04-23T12:00:00');
  
  beforeEach(() => {
    // 日付を固定
    mockDate(fixedDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('期限間近のタスクが表示される', () => {
    // 期限間近のタスクを含むモックデータ
    const tasks: Task[] = [
      {
        id: '1',
        title: '明日期限のタスク',
        status: 'todo',
        progress: 0,
        dueDate: '2025-04-24',
        projectId: 'web-app-development',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: '高',
        expanded: false,
        subtasks: []
      },
      {
        id: '2',
        title: '3日後期限のタスク',
        status: 'todo',
        progress: 0,
        dueDate: '2025-04-26',
        projectId: 'design-project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: '中',
        expanded: false,
        subtasks: []
      }
    ];
    
    render(<UpcomingTasksCard tasks={tasks} />);
    
    // カードのタイトルが表示されていることを確認
    expect(screen.getByText('期限間近 / 期限超過タスク')).toBeInTheDocument();
    
    // 期限間近セクションが表示されていることを確認
    expect(screen.getByText('期限間近')).toBeInTheDocument();
    
    // タスクのタイトルが表示されていることを確認
    expect(screen.getByText('明日期限のタスク')).toBeInTheDocument();
    expect(screen.getByText('3日後期限のタスク')).toBeInTheDocument();
    
    // 期限表示が正しいことを確認
    expect(screen.getByText('明日')).toBeInTheDocument();
    expect(screen.getByText('3日後')).toBeInTheDocument();
    
    // プロジェクト名が表示されていることを確認
    expect(screen.getByText('ウェブアプリ開発')).toBeInTheDocument();
    expect(screen.getByText('デザインプロジェクト')).toBeInTheDocument();
  });

  it('期限超過のタスクが表示される', () => {
    // 期限超過のタスクを含むモックデータ
    const tasks: Task[] = [
      {
        id: '3',
        title: '昨日期限のタスク',
        status: 'todo',
        progress: 0,
        dueDate: '2025-04-22',
        projectId: 'qa-project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: '高',
        expanded: false,
        subtasks: []
      },
      {
        id: '4',
        title: '3日前期限のタスク',
        status: 'todo',
        progress: 0,
        dueDate: '2025-04-20',
        projectId: 'team-management',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: '中',
        expanded: false,
        subtasks: []
      }
    ];
    
    render(<UpcomingTasksCard tasks={tasks} />);
    
    // 期限超過セクションが表示されていることを確認
    expect(screen.getByText('期限超過')).toBeInTheDocument();
    
    // タスクのタイトルが表示されていることを確認
    expect(screen.getByText('昨日期限のタスク')).toBeInTheDocument();
    expect(screen.getByText('3日前期限のタスク')).toBeInTheDocument();
    
    // 期限表示が正しいことを確認
    expect(screen.getByText('1日経過')).toBeInTheDocument();
    expect(screen.getByText('3日経過')).toBeInTheDocument();
    
    // プロジェクト名が表示されていることを確認
    expect(screen.getByText('QA')).toBeInTheDocument();
    expect(screen.getByText('チーム管理')).toBeInTheDocument();
  });

  it('完了済みのタスクは表示されない', () => {
    // 完了済みのタスクを含むモックデータ
    const tasks: Task[] = [
      {
        id: '5',
        title: '完了済みの期限間近タスク',
        status: 'completed',
        progress: 100,
        dueDate: '2025-04-24',
        projectId: 'web-app-development',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: '高',
        expanded: false,
        subtasks: []
      },
      {
        id: '6',
        title: '未完了の期限間近タスク',
        status: 'todo',
        progress: 0,
        dueDate: '2025-04-24',
        projectId: 'design-project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: '中',
        expanded: false,
        subtasks: []
      }
    ];
    
    render(<UpcomingTasksCard tasks={tasks} />);
    
    // 完了済みのタスクは表示されないことを確認
    expect(screen.queryByText('完了済みの期限間近タスク')).not.toBeInTheDocument();
    
    // 未完了のタスクは表示されることを確認
    expect(screen.getByText('未完了の期限間近タスク')).toBeInTheDocument();
  });

  it('タスクがない場合はメッセージが表示される', () => {
    // 空のタスク配列
    render(<UpcomingTasksCard tasks={[]} />);
    
    // メッセージが表示されることを確認
    expect(screen.getByText('期限間近のタスクはありません')).toBeInTheDocument();
  });
});
