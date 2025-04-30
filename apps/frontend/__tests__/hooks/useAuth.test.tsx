import { renderHook, act, setupAuthTest } from '../test-utils';
import { useAuth } from '../../hooks/useAuth';
import { createClient } from '@supabase/supabase-js';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';

// Supabaseクライアントのモック
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

// モック用のSupabaseクライアントを取得
import { supabase as mockSupabaseClient, resetSupabaseMock } from '../../__mocks__/lib/supabase';

// モックユーザーとセッション
const mockUser = { id: '123', email: 'test@example.com' };

const mockSession = {
  user: mockUser,
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
};

describe('useAuth', () => {
  beforeEach(() => {
    // 各テスト前に共通の初期化処理を実行
    setupAuthTest();
    (createClient as any).mockReturnValue(mockSupabaseClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態が正しく設定されること', async () => {
    // 初期状態ではセッションがnullであることを確認
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    // 初期状態の検証
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('ログインが成功すること', async () => {
    // ログイン成功のモックを設定
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    // onAuthStateChangeのモックを設定
    let authCallback: (event: string, session: any) => void = () => {};
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useAuth());

    // ログイン処理を実行
    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    // ログイン後に認証状態変更イベントをシミュレート
    await act(async () => {
      authCallback('SIGNED_IN', mockSession);
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // 認証情報が正しく設定されたことを確認
    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('ログインが失敗すること', async () => {
    // ログイン失敗のモックを設定
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'ログインに失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    // ログイン処理を実行
    await act(async () => {
      await result.current.signIn('test@example.com', 'wrong-password');
    });

    // ログイン失敗の検証
    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrong-password',
    });

    expect(result.current.user).toBeNull();
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('ログインに失敗しました');
  });

  it('サインアップが成功すること', async () => {
    // サインアップ成功のモックを設定
    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    // onAuthStateChangeのモックを設定
    let authCallback: (event: string, session: any) => void = () => {};
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useAuth());

    // サインアップ処理を実行
    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    // サインアップ後に認証状態変更イベントをシミュレート
    await act(async () => {
      authCallback('SIGNED_UP', mockSession);
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // サインアップが正しく呼び出されたことを確認
    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('サインアップが失敗すること', async () => {
    // サインアップ失敗のモックを設定
    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'アカウント登録に失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    // サインアップ処理を実行
    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    // サインアップ失敗の検証
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
    // パスワードリセットのモックを設定
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValueOnce({
      data: {},
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    // パスワードリセット前の状態を確認
    expect(result.current.hasError).toBe(false);

    // パスワードリセット処理を実行
    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    // パスワードリセットが正しく呼び出されたことを確認
    expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      { redirectTo: expect.any(String) }
    );

    // エラーが発生していないことを確認
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
    // 認証状態変更のモックを直接設定
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
      // コールバックを即時実行して認証状態を設定
      setTimeout(() => {
        callback('SIGNED_IN', mockSession);
      }, 10);
      
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    
    // 初期セッションを設定
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    // useAuthフックをレンダリング
    const { result } = renderHook(() => useAuth());

    // 非同期処理の完了を待つ
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // 認証状態が正しく設定されていることを確認
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
    // 初期セッションを設定
    const initialSession = {
      user: mockUser,
      access_token: 'initial-token',
      refresh_token: 'initial-refresh-token',
    };

    // セッション取得のモックを設定
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: initialSession },
      error: null,
    });

    // トークン更新失敗のモックを設定
    mockSupabaseClient.auth.refreshSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'トークンの更新に失敗しました' },
    });

    const { result } = renderHook(() => useAuth());

    // 初期状態を待機
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // トークン更新を実行
    await act(async () => {
      await result.current.refreshSession();
    });

    // エラーが正しく設定されていることを確認
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('トークンの更新に失敗しました');
  });

  it('同時実行時のロック制御が正しく動作すること', async () => {
    // 初期セッションを設定
    const initialSession = {
      user: mockUser,
      access_token: 'initial-token',
      refresh_token: 'initial-refresh-token',
    };

    // セッション取得のモックを設定
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: initialSession },
      error: null,
    });

    // useAuthフックをレンダリング
    const { result } = renderHook(() => useAuth());

    // 初期状態を待機
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // ユーザーが設定されていることを確認
    expect(result.current.user).toEqual(initialSession.user);

    // refreshSessionのモックを設定
    // 重要: 同時呼び出しのテストでは、実際のロジックを模倣するために
    // 最初の呼び出しだけが成功し、他は待機状態になるようにする
    let isRefreshing = false;
    let callCount = 0;
    
    mockSupabaseClient.auth.refreshSession.mockImplementation(async () => {
      callCount++;
      
      // すでに更新中の場合は待機
      if (isRefreshing) {
        await new Promise(resolve => setTimeout(resolve, 10));
        return {
          data: { session: initialSession },
          error: null
        };
      }
      
      // 最初の呼び出しで更新中フラグを設定
      isRefreshing = true;
      await new Promise(resolve => setTimeout(resolve, 20));
      isRefreshing = false;
      
      return {
        data: { 
          session: {
            user: mockUser,
            access_token: 'updated-token',
            refresh_token: 'updated-refresh-token',
          }
        },
        error: null
      };
    });

    // useAuthフックの内部実装を考慮して、refreshSessionメソッドにスパイを設定
    const refreshSessionSpy = vi.spyOn(result.current, 'refreshSession');

    // 連続して呼び出し
    await act(async () => {
      // 同時に3回呼び出し
      await Promise.all([
        result.current.refreshSession(),
        result.current.refreshSession(),
        result.current.refreshSession()
      ]);
    });

    // refreshSessionは3回呼ばれるが、実際のSupabase APIは1回だけ呼ばれる
    expect(refreshSessionSpy).toHaveBeenCalledTimes(3);
    expect(mockSupabaseClient.auth.refreshSession).toHaveBeenCalledTimes(1);
  });
});