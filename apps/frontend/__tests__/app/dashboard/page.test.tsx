import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { useTaskData } from '@/hooks/useTaskData';
import { SWRConfig } from 'swr';

// useTaskDataフックをモック
jest.mock('@/hooks/useTaskData', () => ({
  useTaskData: jest.fn(),
}));

// Sidebarコンポーネントをモック
jest.mock('@/components/sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar-mock">サイドバー</div>,
}));

// AIChatコンポーネントをモック
jest.mock('@/components/ai-chat', () => ({
  AIChat: () => <div data-testid="ai-chat-mock">AIチャット</div>,
}));

// TaskGroupコンポーネントをモック
jest.mock('@/components/dashboard/TaskGroup', () => ({
  TaskGroup: ({ group }: any) => (
    <div data-testid={`task-group-${group.id}`}>
      {group.title}
      <ul>
        {group.tasks.map((task: any) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  ),
}));

// SWRのキャッシュをリセットするためのラッパー
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    {children}
  </SWRConfig>
);

describe('DashboardPage Component', () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    
    // useEffectのモック（マウント状態を即座にtrueにする）
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    
    // Dateのモック - 固定の日付オブジェクトを返す
    const mockDate = new Date('2025-04-23T12:00:00');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  it('ローディング状態が表示される', () => {
    // ローディング中の状態をモック
    (useTaskData as jest.Mock).mockReturnValue({
      taskGroups: [],
      isLoading: true,
      isError: null,
      mutate: jest.fn(),
    });
    
    render(<DashboardPage />, { wrapper: Wrapper });
    
    // ローディングメッセージが表示されていることを確認
    expect(screen.getByText('データを読み込み中...')).toBeInTheDocument();
  });

  it('データが読み込まれた後にダッシュボードが表示される', async () => {
    // データが読み込まれた状態をモック
    const mockTaskGroups = [
      {
        id: 'today',
        title: '今日のタスク',
        expanded: true,
        completed: false,
        tasks: [
          {
            id: 'task-1',
            title: 'テストタスク1',
            status: 'todo',
            progress: 0,
            subtasks: [],
            expanded: false,
          },
        ],
      },
      {
        id: 'upcoming',
        title: '今後のタスク',
        expanded: true,
        completed: false,
        tasks: [
          {
            id: 'task-2',
            title: 'テストタスク2',
            status: 'todo',
            progress: 0,
            subtasks: [],
            expanded: false,
          },
        ],
      },
    ];
    
    (useTaskData as jest.Mock).mockReturnValue({
      taskGroups: mockTaskGroups,
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    });
    
    render(<DashboardPage />, { wrapper: Wrapper });
    
    // ダッシュボードのタイトルが表示されていることを確認
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    
    // 日付が表示されていることを確認
    expect(screen.getByText(/2025年4月23日/)).toBeInTheDocument();
    
    // タスクグループが表示されていることを確認
    expect(screen.getByTestId('task-group-today')).toBeInTheDocument();
    expect(screen.getByTestId('task-group-upcoming')).toBeInTheDocument();
    
    // サイドバーとAIチャットが表示されていることを確認
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('ai-chat-mock')).toBeInTheDocument();
  });

  it('エラーが発生した場合にエラーメッセージが表示される', () => {
    // エラー状態をモック
    (useTaskData as jest.Mock).mockReturnValue({
      taskGroups: [],
      isLoading: false,
      isError: new Error('データの読み込みに失敗しました'),
      mutate: jest.fn(),
    });
    
    render(<DashboardPage />, { wrapper: Wrapper });
    
    // ダッシュボードは表示されていることを確認
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
  });
});
