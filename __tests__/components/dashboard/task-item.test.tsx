import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem, Task } from '../../../components/dashboard/task-item';

// framer-motionのアニメーションをモック
jest.mock('../../../components/ui/animations', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} data-testid="motion-span" {...props}>
        {children}
      </span>
    ),
  },
}));

describe('TaskItemコンポーネント', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'テストタスク',
    description: 'これはテスト用のタスクです',
    status: 'todo',
    due_date: '2025-05-01',
    priority: 'medium',
    created_at: '2025-04-01',
    tags: ['フロントエンド', 'UI'],
  };

  const mockStatusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('タスクの基本情報が正しく表示される', () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('これはテスト用のタスクです')).toBeInTheDocument();
    expect(screen.getByText('2025/5/1')).toBeInTheDocument();
  });

  test('タグが正しく表示される', () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText('フロントエンド')).toBeInTheDocument();
    expect(screen.getByText('UI')).toBeInTheDocument();
  });

  test('チェックボックスをクリックするとステータスが変わる', () => {
    render(<TaskItem task={mockTask} onStatusChange={mockStatusChange} />);

    // チェックボックスを取得してクリック
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // コールバック関数が呼ばれたか確認
    expect(mockStatusChange).toHaveBeenCalledWith('task-1', 'done');
  });

  test('期限切れのタスクは警告表示される', () => {
    // 期限切れのタスク
    const overdueTask: Task = {
      ...mockTask,
      due_date: '2025-03-01', // 過去の日付
    };

    // 日付関数をモック
    const originalDate = global.Date;
    global.Date = class extends originalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          // new Date() を呼び出すと 2025-04-01 を返す
          return new originalDate('2025-04-01');
        }
        return new originalDate(...args);
      }
    } as DateConstructor;

    render(<TaskItem task={overdueTask} />);

    // 期限切れの表示があるか確認
    expect(screen.getByText('期限切れ')).toBeInTheDocument();

    // グローバル関数を元に戻す
    global.Date = originalDate;
  });

  test('完了タスクは打ち消し線が表示される', () => {
    const completedTask: Task = {
      ...mockTask,
      status: 'done',
    };

    render(<TaskItem task={completedTask} />);

    // タイトル要素を取得
    const titleElement = screen.getByText('テストタスク');

    // 打ち消し線のクラスが適用されているか確認
    expect(titleElement).toHaveClass('line-through');
  });
}); 