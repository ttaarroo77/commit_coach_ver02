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
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認証プロバイダーの型定義
interface AuthProviderProps {
  children: ReactNode;
}

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 現在のセッション情報を取得
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        
        // セッションの取得
        const { data: { session }, error } = await supabase.auth.getSession();
        
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // サインイン関数
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);
      
      const { error } = await supabase.auth.signInWithPassword({
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
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'アカウント登録に失敗しました';
      setHasError(true);
      setErrorMessage(errorMessage);
      console.error('登録エラー:', errorMessage);
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
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ログアウトに失敗しました';
      setHasError(true);
      setErrorMessage(errorMessage);
      console.error('ログアウトエラー:', errorMessage);
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
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password/update`,
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 認証コンテキストを使用するカスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
