import { ReactNode } from 'react';
import { render, renderHook, RenderOptions, waitFor } from '@testing-library/react';
import { AuthProvider } from '../hooks/useAuth';
import { supabase as mockSupabaseClient } from '../__mocks__/lib/supabase';
import { resetSupabaseMock } from '../__mocks__/lib/supabase';
import { vi } from 'vitest';

// テスト用のプロバイダーラッパー
export const AllProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider supabaseClient={mockSupabaseClient}>{children}</AuthProvider>
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
  resetSupabaseMock();
  
  // 初期状態ではセッションはnull
  mockSupabaseClient.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });
  
  // 認証状態変更のコールバックは何もしない
  mockSupabaseClient.auth.onAuthStateChange.mockImplementation(() => {
    return { data: { subscription: { unsubscribe: vi.fn() } } };
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
