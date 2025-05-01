import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/components/dashboard/Dashboard';
import { vi } from 'vitest';
import { mockSupabase, setupAuthTest } from '../../test-utils';

describe('Dashboard', () => {
  beforeEach(() => {
    setupAuthTest();
  });

  it('初期表示時にローディング状態が表示されること', () => {
    render(<Dashboard />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('認証済みユーザーで表示されること', async () => {
    // 認証状態を設定
    mockSupabase.auth.__triggerAuthState('SIGNED_IN', {
      user: { id: '123', email: 'test@example.com' },
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('今日のタスク')).toBeInTheDocument();
      expect(screen.getByText('期限間近')).toBeInTheDocument();
      expect(screen.getByText('AIコーチ')).toBeInTheDocument();
    });
  });

  it('タスクグループが表示されること', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });

  it('レスポンシブデザインが正しく適用されること', async () => {
    render(<Dashboard />);

    // モバイルビュー
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      const mobileElements = screen.getAllByTestId('mobile-view');
      expect(mobileElements.length).toBeGreaterThan(0);
    });

    // デスクトップビュー
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      const desktopElements = screen.getAllByTestId('desktop-view');
      expect(desktopElements.length).toBeGreaterThan(0);
    });
  });
});
