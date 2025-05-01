import React from 'react';
import { render as rtlRender, renderHook as rtlRenderHook, waitFor as rtlWaitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';
import type { RenderOptions } from '@testing-library/react';

// モックのSupabaseクライアント
export const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({
      data: {},
      error: null,
    }),
    refreshSession: vi.fn().mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    }),
    onAuthStateChange: vi.fn((callback) => {
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  storage: { from: vi.fn() },
  realtime: { channel: vi.fn() },
  rpc: vi.fn(),
} as any;

// テスト用のQueryClient
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// テスト用のモックデータ
export const mockSession = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'authenticated',
  },
};

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'authenticated',
};

// 共通のラッパーコンポーネント
export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider supabaseClient={mockSupabase}>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

// カスタムレンダー関数
export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// カスタムrenderHook関数
export function renderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options: any = {}
) {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createTestQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider supabaseClient={mockSupabase}>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    );
  };
  
  return rtlRenderHook(hook, { wrapper: TestWrapper, ...options });
}

// テストのセットアップヘルパー
export function setupAuthTest() {
  vi.clearAllMocks();
  
  // モックの動作を設定
  mockSupabase.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });

  mockSupabase.auth.signInWithPassword.mockResolvedValue({
    data: { session: mockSession, user: mockUser },
    error: null,
  });

  mockSupabase.auth.signUp.mockResolvedValue({
    data: { session: mockSession, user: mockUser },
    error: null,
  });

  mockSupabase.auth.signOut.mockResolvedValue({ error: null });
  
  mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
    data: {},
    error: null,
  });
  
  mockSupabase.auth.refreshSession.mockResolvedValue({
    data: { session: mockSession, user: mockUser },
    error: null,
  });

  return { mockSupabase, mockSession, mockUser };
}

// 必要な関数を再エクスポート
export { rtlWaitFor as waitFor, act };
