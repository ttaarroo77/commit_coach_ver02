import { render, screen } from '@testing-library/react';
import { ActivityChart } from '../../../components/dashboard/activity-chart';
import { ActivityData } from '../../../types';

const mockActivityData: ActivityData[] = [
  { date: '2023-01-01', count: 5 },
  { date: '2023-01-02', count: 3 },
  { date: '2023-01-03', count: 7 },
  { date: '2023-01-04', count: 2 },
  { date: '2023-01-05', count: 0 },
  { date: '2023-01-06', count: 4 },
  { date: '2023-01-07', count: 6 },
];

describe('ActivityChartコンポーネント', () => {
  test('アクティビティチャートコンポーネントが正しくレンダリングされる', () => {
    render(<ActivityChart activityData={mockActivityData} />);

    // タイトルが表示される
    expect(screen.getByText('アクティビティ')).toBeInTheDocument();

    // チャートが描画されている（チャートはSVG要素として描画される）
    const chartElement = screen.getByTestId('activity-chart');
    expect(chartElement).toBeInTheDocument();

    // SVG要素があることを確認
    expect(chartElement.querySelector('svg')).toBeInTheDocument();
  });

  test('データがない場合、メッセージが表示される', () => {
    render(<ActivityChart activityData={[]} />);

    // データが無い場合のメッセージが表示される
    expect(screen.getByText('アクティビティデータがありません')).toBeInTheDocument();
  });

  test('凡例が表示される', () => {
    render(<ActivityChart activityData={mockActivityData} />);

    // 凡例が表示される
    const legend = screen.getByTestId('activity-legend');
    expect(legend).toBeInTheDocument();

    // 凡例の項目が表示される
    expect(screen.getByText('少ない')).toBeInTheDocument();
    expect(screen.getByText('多い')).toBeInTheDocument();
  });

  test('期間の切り替えが機能する', () => {
    render(<ActivityChart activityData={mockActivityData} />);

    // 期間切り替えボタンが表示される
    const weekButton = screen.getByRole('button', { name: '週間' });
    const monthButton = screen.getByRole('button', { name: '月間' });
    const yearButton = screen.getByRole('button', { name: '年間' });

    expect(weekButton).toBeInTheDocument();
    expect(monthButton).toBeInTheDocument();
    expect(yearButton).toBeInTheDocument();

    // デフォルトでは週間が選択されている
    expect(weekButton).toHaveAttribute('aria-selected', 'true');
    expect(monthButton).toHaveAttribute('aria-selected', 'false');
    expect(yearButton).toHaveAttribute('aria-selected', 'false');
  });
}); 