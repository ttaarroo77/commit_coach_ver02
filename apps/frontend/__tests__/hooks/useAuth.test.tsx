import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

// supabaseクライアントをモック
jest.mock('../../lib/supabase', () => {
  const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600,
    user: {
      id: 'mock-user-id',
      email: 'test@example.com',
    }
  };

  return {
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } }
        }),
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { session: mockSession, user: mockSession.user },
          error: null
        }),
        signUp: jest.fn().mockResolvedValue({
          data: { session: null, user: null },
          error: null
        }),
        signOut: jest.fn().mockResolvedValue({
          error: null
        }),
        resetPasswordForEmail: jest.fn().mockResolvedValue({
          error: null
        })
      }
    }
  };
});

// テスト実行のためのラッパーコンポーネント
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth フック', () => {
  // 各テスト後にモックをリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('初期状態の確認', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 初期ロード状態の確認
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  test('サインイン機能の確認', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    // サインイン後の状態確認
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  test('サインアウト機能の確認', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    // サインアウト後の状態確認
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  test('サインアップ機能の確認', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123', 'Test User');
    });

    // サインアップ後の状態確認
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          name: 'Test User'
        }
      }
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  test('パスワードリセット機能の確認', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000'
      }
    });

    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    // パスワードリセット後の状態確認
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      {
        redirectTo: 'http://localhost:3000/password/update'
      }
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  test('エラーハンドリングの確認 - サインイン失敗', async () => {
    // サインインがエラーを返すようにモックを上書き
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { session: null, user: null },
      error: new Error('ログイン認証情報が無効です')
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn('test@example.com', 'wrong-password');
    });

    // エラー状態の確認
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('ログイン認証情報が無効です');
  });
});