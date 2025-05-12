import { render, screen } from '@testing-library/react';
import { Clock } from '@/components/dashboard/clock';
import '@testing-library/jest-dom';

describe('Clock', () => {
  it('日付と時刻が表示される', () => {
    render(<Clock />);
    // 日付（例：2023年5月4日 木曜日）
    expect(screen.getByText(/\d{4}年.*日/)).toBeInTheDocument();
    // 時刻（例：12:34:56）
    expect(screen.getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it('クラス名や装飾が適用されている', () => {
    render(<Clock />);
    expect(screen.getByRole('article')).toHaveClass('overflow-hidden');
  });
});
