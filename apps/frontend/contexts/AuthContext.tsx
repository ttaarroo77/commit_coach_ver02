import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

// 認証コンテキストの型定義
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getSession: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認証プロバイダーの型定義
interface AuthProviderProps {
  children: ReactNode;
  supabaseClient?: any;
}

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children, supabaseClient }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // テスト環境では環境変数が設定されていない場合があるため、
  // supabaseClientが提供されている場合はそれを使用し、
  // 提供されていない場合のみ新しいクライアントを作成する
  let client = supabaseClient;
  
  if (!client) {
    try {
      // 環境変数が設定されている場合のみ新しいクライアントを作成
      if (typeof process !== 'undefined' && 
          process.env && 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        client = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
      } else {
        console.warn('Supabase環境変数が設定されていません。テスト環境では問題ありません。');
        // テスト環境用のダミークライアント
        client = { 
          auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            signInWithPassword: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
            signUp: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
            signOut: () => Promise.resolve({ error: null }),
            resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
            refreshSession: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
            onAuthStateChange: (callback: any) => {
              return { data: { subscription: { unsubscribe: () => {} } } };
            },
          } 
        } as any;
      }
    } catch (error) {
      console.error('Supabaseクライアントの作成に失敗しました:', error);
      // エラーが発生した場合もダミークライアントを使用
      client = { 
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          signInWithPassword: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
          signUp: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
          signOut: () => Promise.resolve({ error: null }),
          resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
          refreshSession: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
          onAuthStateChange: (callback: any) => {
            return { data: { subscription: { unsubscribe: () => {} } } };
          },
        } 
      } as any;
    }
  }

  // 認証状態の変更を監視
  useEffect(() => {
    try {
      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (event: string, session: Session | null) => {
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
            case 'INITIAL_SESSION':
              setSession(session);
              setUser(session?.user ?? null);
              setHasError(false);
              setIsLoading(false);
              break;
            case 'SIGNED_OUT':
              setSession(null);
              setUser(null);
              setIsLoading(false);
              break;
            default:
            // no-op
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('認証状態監視エラー:', error);
      setIsLoading(false);
      return () => {};
    }
  }, [client]);

  // セッションの初期取得
  useEffect(() => {
    try {
      client.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('セッション初期取得エラー:', error);
      setIsLoading(false);
    }
  }, [client]);

  // トークンの自動更新
  useEffect(() => {
    const refreshToken = async () => {
      if (!session?.refresh_token) return;

      try {
        if (isRefreshing) return;
        setIsRefreshing(true);

        const { data, error } = await client.auth.refreshSession();
        if (error) throw error;

        setSession(data.session);
        setUser(data.session?.user ?? null);
        setHasError(false);
      } catch (error) {
        setHasError(true);
        setErrorMessage('トークンの更新に失敗しました');
      } finally {
        setIsRefreshing(false);
      }
    };

    const interval = setInterval(refreshToken, 1000 * 60 * 4); // 4分ごとに更新
    return () => clearInterval(interval);
  }, [session?.refresh_token, isRefreshing, client]);

  // サインイン関数
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // 成功時のみユーザーを設定
      setUser(data?.user ?? null);
    } catch (error) {
      // エラー時はユーザーをnullに設定
      setUser(null);
      const errorMessage = error instanceof Error ? error.message : 'ログインに失敗しました';
      setHasError(true);
      setErrorMessage(errorMessage);
      console.error('ログインエラー:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // サインアップ関数
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const { data, error } = await client.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // 成功時のみユーザーを設定
      setUser(data?.user ?? null);
    } catch (error) {
      // エラー時はユーザーをnullに設定
      setUser(null);
      const errorMessage = error instanceof Error ? error.message : 'アカウント登録に失敗しました';
      setHasError(true);
      setErrorMessage(errorMessage);
      console.error('サインアップエラー:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // サインアウト関数
  const signOut = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const { error } = await client.auth.signOut();

      if (error) {
        throw error;
      }

      // サインアウト成功時は必ずセッションとユーザーをnullに設定
      setSession(null);
      setUser(null);
    } catch (error) {
      // エラー時もユーザーとセッションをクリア
      setSession(null);
      setUser(null);
      const errorMessage = error instanceof Error ? error.message : 'サインアウトに失敗しました';
      setHasError(true);
      setErrorMessage(errorMessage);
      console.error('サインアウトエラー:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // パスワードリセット関数
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'パスワードリセットに失敗しました';
      setHasError(true);
      setErrorMessage(errorMessage);
      console.error('パスワードリセットエラー:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // セッション取得関数
  const getSession = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const { data: { session }, error } = await client.auth.getSession();

      if (error) {
        throw error;
      }

      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'セッションの取得に失敗しました';
      setHasError(true);
      setErrorMessage(errorMessage);
      console.error('セッション取得エラー:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // トークン更新用のミューテックス参照
  const refreshMutex = useRef<Promise<void> | null>(null);

  // トークン更新関数
  const refreshSession = async () => {
    // 既に更新中の場合は、その処理の完了を待つ
    if (refreshMutex.current) {
      return refreshMutex.current;
    }

    // 新しい更新処理を開始し、ミューテックスに設定
    refreshMutex.current = (async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage(null);

        const { data, error } = await client.auth.refreshSession();

        if (error) {
          throw error;
        }

        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        // エラーメッセージを固定文言に統一
        setHasError(true);
        setErrorMessage('トークンの更新に失敗しました');
        console.error('トークン更新エラー:', error instanceof Error ? error.message : error);
      } finally {
        setIsLoading(false);
      }
    })();

    // 処理完了後にミューテックスをクリア
    refreshMutex.current.finally(() => {
      refreshMutex.current = null;
    });

    return refreshMutex.current;
  };

  const value = {
    session,
    user,
    isLoading,
    hasError,
    errorMessage,
    signIn,
    signUp,
    signOut,
    resetPassword,
    getSession,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 認証フック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 