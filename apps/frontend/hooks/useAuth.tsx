import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

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

  const client = supabaseClient || supabase;

  useEffect(() => {
    // 現在のセッション情報を取得
    const fetchSession = async () => {
      try {
        setIsLoading(true);

        // セッションの取得
        const { data: { session }, error } = await client.auth.getSession();

        if (error) {
          throw error;
        }

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '認証情報の取得に失敗しました';
        setHasError(true);
        setErrorMessage(errorMessage);
        console.error('認証エラー:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // セッション変更の監視
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // クリーンアップ関数
    return () => {
      subscription?.unsubscribe();
    };
  }, [client]);

  // サインイン関数
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
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

      const { error } = await client.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
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

      setSession(null);
      setUser(null);
    } catch (error) {
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

  // トークン更新関数
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const { data: { session }, error } = await client.auth.refreshSession();

      if (error) {
        throw error;
      }

      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'トークンの更新に失敗しました';
      setHasError(true);
      setErrorMessage(errorMessage);
      console.error('トークン更新エラー:', errorMessage);
    } finally {
      setIsLoading(false);
    }
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
