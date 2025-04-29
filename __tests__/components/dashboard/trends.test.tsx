import { render, screen } from '@testing-library/react';
import { Trends } from '../../../components/dashboard/trends';

// 完了タスクデータのモック
const mockCompletedTasks = [
  { id: '1', completed_at: '2025-04-22T10:00:00Z', title: 'タスク1' },
  { id: '2', completed_at: '2025-04-23T11:00:00Z', title: 'タスク2' },
  { id: '3', completed_at: '2025-04-23T14:00:00Z', title: 'タスク3' },
  { id: '4', completed_at: '2025-04-24T09:00:00Z', title: 'タスク4' },
  { id: '5', completed_at: '2025-04-25T16:00:00Z', title: 'タスク5' },
  { id: '6', completed_at: '2025-04-26T13:00:00Z', title: 'タスク6' },
  { id: '7', completed_at: '2025-04-27T10:00:00Z', title: 'タスク7' },
];

// 日付関数のモック
jest.mock('../../../lib/date-utils', () => ({
  getLastNDays: jest.fn().mockReturnValue([
    '2025-04-22',
    '2025-04-23',
    '2025-04-24',
    '2025-04-25',
    '2025-04-26',
    '2025-04-27',
    '2025-04-28',
  ]),
  formatDateForDisplay: jest.fn().mockImplementation((date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }),
}));

describe('Trendsコンポーネント', () => {
  test('コンポーネントが正しくレンダリングされる', () => {
    render(<Trends completedTasks={mockCompletedTasks} />);

    // タイトルが表示される
    expect(screen.getByText('生産性トレンド')).toBeInTheDocument();

    // グラフが表示される
    expect(screen.getByTestId('trends-chart')).toBeInTheDocument();
  });

  test('データがない場合はメッセージが表示される', () => {
    render(<Trends completedTasks={[]} />);

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });

  test('正しい日数のデータが表示される', () => {
    render(<Trends completedTasks={mockCompletedTasks} />);

    // 7日分のデータポイントが存在する
    const { getLastNDays } = require('../../../lib/date-utils');
    expect(getLastNDays).toHaveBeenCalledWith(7);

    // 日付が表示される
    expect(screen.getByText('4/22')).toBeInTheDocument();
    expect(screen.getByText('4/23')).toBeInTheDocument();
    expect(screen.getByText('4/24')).toBeInTheDocument();
    expect(screen.getByText('4/25')).toBeInTheDocument();
    expect(screen.getByText('4/26')).toBeInTheDocument();
    expect(screen.getByText('4/27')).toBeInTheDocument();
    expect(screen.getByText('4/28')).toBeInTheDocument();
  });

  test('各日のタスク完了数が正しく計算される', () => {
    const { container } = render(<Trends completedTasks={mockCompletedTasks} />);

    // バーの高さからタスク完了数を検証
    // 2025-04-22: 1件, 2025-04-23: 2件, 2025-04-24: 1件, 2025-04-25: 1件,
    // 2025-04-26: 1件, 2025-04-27: 1件, 2025-04-28: 0件
    const bars = container.querySelectorAll('[data-testid="trend-bar"]');
    expect(bars).toHaveLength(7);

    // バーの高さが完了タスク数に比例していることを確認
    const barHeights = Array.from(bars).map(bar => {
      const height = bar.getAttribute('height');
      return height ? parseInt(height, 10) : 0;
    });

    // 2025-04-23（2件）のバーが他の日（1件）より高いことを確認
    expect(barHeights[1] > barHeights[0]).toBe(true);
    expect(barHeights[1] > barHeights[2]).toBe(true);

    // 2025-04-28（0件）のバーが最も低いことを確認
    expect(barHeights[6]).toBe(0);
  });
});