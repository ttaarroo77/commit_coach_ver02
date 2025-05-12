import { renderHook as rtlRenderHook, act, setupAuthTest, mockSupabase, mockUser, mockSession, waitFor } from '../test-utils';
import { useAuth } from '../../contexts/AuthContext';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// カスタムrenderHook関数（AuthProviderを含む）
function renderHook<TResult>(callback: () => TResult) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider supabaseClient={mockSupabase}>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );

  return rtlRenderHook(callback, { wrapper });
}

describe('useAuth', () => {
  beforeEach(() => {
    setupAuthTest();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態が正しく設定されること', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('ログインが成功すること', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('ログインが失敗すること', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'ログインに失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'wrong-password');
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrong-password',
    });

    expect(result.current.user).toBeNull();
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('ログインに失敗しました');
  });

  it('サインアップが成功すること', async () => {
    mockSupabase.auth.signUp.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('サインアップが失敗すること', async () => {
    mockSupabase.auth.signUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'アカウント登録に失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.user).toBeNull();
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('アカウント登録に失敗しました');
  });

  it('サインアウトが成功すること', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    mockSupabase.auth.signOut.mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });

  it('パスワードリセットが成功すること', async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
      data: {},
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.hasError).toBe(false);

    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      { redirectTo: expect.any(String) }
    );

    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('パスワードリセットが失敗すること', async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
      error: { message: 'パスワードリセットに失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      { redirectTo: expect.any(String) }
    );

    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('パスワードリセットに失敗しました');
  });

  describe('認証状態の変更を監視すること', () => {
    it('認証状態の変更を正しく監視できること', async () => {
      // モックの設定を更新
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      const { result } = renderHook(() => useAuth());

      // 初期セッションが設定されるのを待つ
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // 認証状態の変更をトリガー
      await act(async () => {
        mockSupabase.auth.__triggerAuthState('SIGNED_IN', mockSession);
      });

      // 状態が更新されたことを確認
      await waitFor(() => {
        expect(result.current.user).toEqual(mockSession.user);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.hasError).toBe(false);
      }, { timeout: 1000 });
    });
  });

  describe('同時実行時のロック制御が正しく動作すること', () => {
    it('同時に複数のrefreshSession呼び出しがあった場合、1回だけ実行されること', async () => {
      const { result } = renderHook(() => useAuth());

      mockSupabase.auth.refreshSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      await act(async () => {
        await Promise.all([
          result.current.refreshSession(),
          result.current.refreshSession(),
          result.current.refreshSession(),
        ]);
      });

      expect(mockSupabase.auth.refreshSession).toHaveBeenCalledTimes(1);
    });
  });

  it('トークンの自動更新が正しく動作すること', async () => {
    const initialSession = {
      user: mockUser,
      access_token: 'initial-token',
      refresh_token: 'initial-refresh-token',
    };

    const updatedSession = {
      user: mockUser,
      access_token: 'updated-token',
      refresh_token: 'updated-refresh-token',
    };

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: initialSession },
      error: null,
    });

    mockSupabase.auth.refreshSession.mockResolvedValueOnce({
      data: { session: updatedSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.user).toEqual(initialSession.user);

    await act(async () => {
      await result.current.refreshSession();
    });

    expect(mockSupabase.auth.refreshSession).toHaveBeenCalled();
    expect(result.current.user).toEqual(updatedSession.user);
  });

  it('トークン更新が失敗した場合のエラーハンドリング', async () => {
    const initialSession = {
      user: mockUser,
      access_token: 'initial-token',
      refresh_token: 'initial-refresh-token',
    };

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: initialSession },
      error: null,
    });

    mockSupabase.auth.refreshSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'トークンの更新に失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    await act(async () => {
      await result.current.refreshSession();
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('トークンの更新に失敗しました');
  });
});