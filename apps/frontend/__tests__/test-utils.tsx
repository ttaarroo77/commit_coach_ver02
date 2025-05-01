import { ReactNode } from 'react';
import { render, renderHook, RenderOptions, waitFor } from '@testing-library/react';
import { AuthProvider } from '../hooks/useAuth';
import { vi } from 'vitest';

// テスト用の共有モック
export const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    })),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    refreshSession: vi.fn(),
    getSession: vi.fn(),
    __triggerAuthState: vi.fn(),
  }
};

// テスト用のプロバイダーラッパー
export const AllProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider supabaseClient={mockSupabase}>{children}</AuthProvider>
  );
};

// テスト用のモックユーザーとセッション
export const mockUser = { id: '123', email: 'test@example.com' };
export const mockSession = {
  user: mockUser,
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
};

// テスト前に実行する初期化関数
export const setupAuthTest = () => {
  // すべてのモックをリセット
  vi.clearAllMocks();

  // 初期状態ではセッションはnull
  mockSupabase.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });
};

// カスタムレンダー関数
export const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// カスタムrenderHook関数
export const customRenderHook: typeof renderHook = (callback, options) => {
  return renderHook(callback, {
    wrapper: AllProviders,
    ...options
  });
};

// テスト用のエクスポート
export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook };
