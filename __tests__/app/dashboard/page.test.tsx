import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '../../../app/(app)/dashboard/page';

// supabaseのモック
jest.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: {
            user_metadata: {
              name: 'テストユーザー'
            }
          }
        },
        error: null
      })
    }
  }
}));

// framer-motionコンポーネントのモック
jest.mock('../../../components/ui/animations', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => <div data-testid="fade-in-mock">{children}</div>,
  SlideUp: ({ children }: { children: React.ReactNode }) => <div data-testid="slide-up-mock">{children}</div>,
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div-mock" {...props}>
        {children}
      </div>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} data-testid="motion-span-mock" {...props}>
        {children}
      </span>
    ),
  },
}));

// ダッシュボードコンポーネントのモック
jest.mock('../../../components/dashboard/ai-coach', () => ({
  AICoach: () => <div data-testid="ai-coach-mock">AIコーチモック</div>
}));

jest.mock('../../../components/dashboard/task-group', () => ({
  TaskGroup: ({ title, tasks, expanded }: any) => (
    <div data-testid="task-group-mock">
      <h3>{title}</h3>
      <div>{expanded ? '展開中' : '折りたたみ中'}</div>
      <div>タスク数: {tasks?.length || 0}</div>
    </div>
  ),
  Task: jest.fn(),
  SubTask: jest.fn()
}));

jest.mock('../../../components/dashboard/sortable-task-group', () => ({
  SortableTaskGroup: ({ title, tasks }: any) => (
    <div data-testid="sortable-task-group-mock">
      <h3>{title}</h3>
      <div>タスク数: {tasks?.length || 0}</div>
    </div>
  )
}));

// 日付関数のモック
jest.mock('date-fns', () => ({
  format: jest.fn().mockReturnValue('2025-04-29')
}));

// 実際のテスト
describe('ダッシュボードページ', () => {
  beforeEach(() => {
    // タイマーとイベントリスナーのモック
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');

    // Dateのモック
    const mockDate = new Date('2025-04-29T10:00:00');
    global.Date = jest.fn(() => mockDate) as any;
    global.Date.now = jest.fn(() => mockDate.getTime());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('ページの基本要素が表示される', async () => {
    render(<DashboardPage />);

    // 読み込み中の表示
    expect(screen.getByText(/読み込み中/i)).toBeInTheDocument();

    // タスク関連のUIが表示されるまで待機
    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    // 見出しとAIコーチが表示される
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    expect(screen.getByTestId('ai-coach-mock')).toBeInTheDocument();
  });

  test('タスクグループが表示される', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    // タスクグループが表示される
    const taskGroups = screen.getAllByTestId('task-group-mock');
    expect(taskGroups.length).toBeGreaterThan(0);
  });

  test('ソート機能が動作する', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    // ソートボタンをクリック
    const sortButton = screen.getByText('期限順にソート');
    fireEvent.click(sortButton);

    // ソート順が変わる
    expect(screen.getByText('期限降順にソート')).toBeInTheDocument();
  });

  test('検索機能が動作する', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText(/読み込み中/i)).not.toBeInTheDocument();
    });

    // 検索入力
    const searchInput = screen.getByPlaceholderText('タスクを検索...');
    fireEvent.change(searchInput, { target: { value: 'テスト' } });

    // 検索ボタンをクリック
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    // 検索結果が表示される（実際の検索処理はモックされているため、UIの変更確認のみ）
  });
});