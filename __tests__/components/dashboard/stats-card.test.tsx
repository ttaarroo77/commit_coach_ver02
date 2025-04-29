import { render, screen } from '@testing-library/react';
import { StatsCard } from '../../../components/dashboard/stats-card';
import { CheckCircle } from 'lucide-react';

// framer-motionのアニメーションをモック
jest.mock('../../../components/ui/animations', () => ({
  ScaleIn: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="scale-in-mock">
      {children}
    </div>
  ),
}));

describe('StatsCardコンポーネント', () => {
  test('基本的なpropsが正しく表示される', () => {
    // コンポーネントをレンダリング
    render(
      <StatsCard
        title="完了タスク"
        value={10}
        icon={<CheckCircle data-testid="check-icon" />}
      />
    );

    // 各要素が正しく表示されているか確認
    expect(screen.getByText('完了タスク')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  test('descriptionが表示される', () => {
    render(
      <StatsCard
        title="完了タスク"
        value={10}
        description="今週のタスク"
        icon={<CheckCircle />}
      />
    );

    expect(screen.getByText('今週のタスク')).toBeInTheDocument();
  });

  test('トレンド値が表示される（ポジティブ）', () => {
    render(
      <StatsCard
        title="完了タスク"
        value={10}
        description="今週のタスク"
        icon={<CheckCircle />}
        trend={{ value: 15, isPositive: true }}
      />
    );

    expect(screen.getByText('+15%')).toBeInTheDocument();
  });

  test('トレンド値が表示される（ネガティブ）', () => {
    render(
      <StatsCard
        title="完了タスク"
        value={10}
        description="今週のタスク"
        icon={<CheckCircle />}
        trend={{ value: 5, isPositive: false }}
      />
    );

    expect(screen.getByText('-5%')).toBeInTheDocument();
  });
}); 