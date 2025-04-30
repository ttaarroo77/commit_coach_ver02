import { renderHook, act } from '../test-utils';
import { useAuth } from '../../hooks/useAuth';
import { createClient } from '@supabase/supabase-js';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Supabaseクライアントのモック
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

// モック用のSupabaseクライアントを取得
import { supabase as mockSupabaseClient, resetSupabaseMock } from '../../__mocks__/lib/supabase';

// モックユーザー
const mockUser = { id: '123', email: 'test@example.com' };

const mockSession = {
  user: mockUser,
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
};

describe('useAuth', () => {
  let authCallback: (event: string, session: any) => void;
  let authCallback2: (event: string, session: any) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    resetSupabaseMock();

    // 認証コールバックの初期化
    authCallback = vi.fn();
    authCallback2 = vi.fn();

    // Supabaseクライアントのモック設定
    Object.assign(mockSupabaseClient, {
      auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        onAuthStateChange: vi.fn((callback) => {
          authCallback = callback;
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
        getSession: vi.fn(),
        refreshSession: vi.fn(),
      },
    });

    (createClient as any).mockReturnValue(mockSupabaseClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態が正しく設定されること', async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.errorMessage).toBeNull();
  });

  it('ログインが成功すること', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('ログインが失敗すること', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'ログインに失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'wrong-password');
    });

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrong-password',
    });

    expect(result.current.user).toBeNull();
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('ログインに失敗しました');
  });

  it('サインアップが成功すること', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('サインアップが失敗すること', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: null,
      error: { message: 'アカウント登録に失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.user).toBeNull();
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('アカウント登録に失敗しました');
  });

  it('サインアウトが成功すること', async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    mockSupabaseClient.auth.signOut.mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });

  it('パスワードリセットが成功すること', async () => {
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      { redirectTo: expect.any(String) }
    );

    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('パスワードリセットが失敗すること', async () => {
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValueOnce({
      error: { message: 'パスワードリセットに失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      { redirectTo: expect.any(String) }
    );

    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('パスワードリセットに失敗しました');
  });

  it('認証状態の変更を監視すること', async () => {
    const authCallback = vi.fn();
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback: any) => {
      callback('SIGNED_IN', mockSession);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
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

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: initialSession },
      error: null,
    });

    mockSupabaseClient.auth.refreshSession.mockResolvedValueOnce({
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

    expect(mockSupabaseClient.auth.refreshSession).toHaveBeenCalled();
    expect(result.current.user).toEqual(updatedSession.user);
  });

  it('トークン更新が失敗した場合のエラーハンドリング', async () => {
    mockSupabaseClient.auth.refreshSession.mockResolvedValueOnce({
      data: null,
      error: { message: 'トークンの更新に失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.refreshSession();
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('トークンの更新に失敗しました');
  });

  it('同時実行時のロック制御が正しく動作すること', async () => {
    const initialSession = {
      user: mockUser,
      access_token: 'initial-token',
      refresh_token: 'initial-refresh-token',
    };

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: initialSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.user).toEqual(initialSession.user);

    const refreshPromises = Array(3).fill(null).map(() =>
      act(async () => {
        await result.current.refreshSession();
      })
    );

    await Promise.all(refreshPromises);

    expect(mockSupabaseClient.auth.refreshSession).toHaveBeenCalledTimes(1);
  });
});