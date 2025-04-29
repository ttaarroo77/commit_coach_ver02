import { render, screen, act } from '@testing-library/react';
import { TimeTracker } from '../../../components/dashboard/time-tracker';

// framer-motionのモック
jest.mock('../../../components/ui/animations', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => <div data-testid="fade-in">{children}</div>,
  SlideUp: ({ children }: { children: React.ReactNode }) => <div data-testid="slide-up">{children}</div>,
  StaggerContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="stagger-container">{children}</div>,
  StaggerItem: ({ children }: { children: React.ReactNode }) => <div data-testid="stagger-item">{children}</div>,
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

// Dateのモック
const mockDate = new Date('2025-04-29T10:30:00');
global.Date = jest.fn(() => mockDate) as any;
global.Date.now = jest.fn(() => mockDate.getTime());
// プロトタイプメソッドを維持
Object.defineProperty(mockDate, 'toLocaleDateString', {
  value: jest.fn().mockReturnValue('2025年4月29日 火曜日')
});
Object.defineProperty(mockDate, 'toLocaleTimeString', {
  value: jest.fn().mockReturnValue('10:30')
});

describe('TimeTrackerコンポーネント', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('現在の日付と時刻が正しく表示される', () => {
    render(<TimeTracker />);

    expect(screen.getByText('2025年4月29日 火曜日')).toBeInTheDocument();
    expect(screen.getByText('10:30')).toBeInTheDocument();
  });

  test('作業時間の設定が正しく表示される', () => {
    render(<TimeTracker workStartTime="08:00" workEndTime="17:00" />);

    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('17:00')).toBeInTheDocument();
  });

  test('予定リストが表示される', () => {
    render(<TimeTracker />);

    expect(screen.getByText('午前ミーティング')).toBeInTheDocument();
    expect(screen.getByText('フロントエンド開発')).toBeInTheDocument();
    expect(screen.getByText('昼休憩')).toBeInTheDocument();
    expect(screen.getByText('バックエンド連携')).toBeInTheDocument();
  });

  test('進捗率が計算される', () => {
    // 10:30は8:00から17:00の間で、約27.8%経過している
    // (10.5時間 - 8時間) / (17時間 - 8時間) * 100 = 27.8%
    jest.spyOn(mockDate, 'getTime').mockReturnValue(new Date('2025-04-29T10:30:00').getTime());

    render(<TimeTracker workStartTime="08:00" workEndTime="17:00" />);

    // 進捗率のテキストを確認
    expect(screen.getByText(/作業時間の \d+% 経過/)).toBeInTheDocument();
  });

  test('インターバルタイマーが設定される', () => {
    render(<TimeTracker />);

    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 60000);
  });

  test('コンポーネントのアンマウント時にタイマーがクリアされる', () => {
    const { unmount } = render(<TimeTracker />);

    jest.spyOn(global, 'clearInterval');
    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });
}); 