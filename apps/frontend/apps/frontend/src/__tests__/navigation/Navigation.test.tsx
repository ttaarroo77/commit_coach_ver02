import { render, screen } from '@/lib/utils/render';
import Navigation from '@/components/Navigation';

describe('Navigation', () => {
  it('renders navigation links', () => {
    render(<Navigation />);

    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
    expect(screen.getByText('設定')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<Navigation />);

    expect(screen.getByRole('button', { name: /テーマ切り替え/i })).toBeInTheDocument();
  });
}); 