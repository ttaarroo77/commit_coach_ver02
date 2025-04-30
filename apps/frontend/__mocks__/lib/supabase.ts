import { createClient } from '@supabase/supabase-js';
import { vi } from 'vitest';

type MockFunction = ReturnType<typeof vi.fn>;

interface AuthMethods {
  signInWithPassword: MockFunction;
  signUp: MockFunction;
  signOut: MockFunction;
  resetPasswordForEmail: MockFunction;
  getSession: MockFunction;
  refreshSession: MockFunction;
  onAuthStateChange: MockFunction;
}

interface StorageMethods {
  get: MockFunction;
  set: MockFunction;
  remove: MockFunction;
}

interface MockSupabase {
  auth: AuthMethods;
  storage: {
    local: StorageMethods;
  };
  from: () => {
    select: MockFunction;
    insert: MockFunction;
    update: MockFunction;
    delete: MockFunction;
    eq: MockFunction;
    single: MockFunction;
  };
}

// モック用のSupabaseクライアント
export const supabase: MockSupabase = {
  auth: {
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' }, session: { access_token: 'token' } },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' }, session: { access_token: 'token' } },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({
      error: null
    }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({
      data: {},
      error: null
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { 
        session: {
          user: { id: '123', email: 'test@example.com' },
          access_token: 'token',
          refresh_token: 'refresh_token'
        }
      },
      error: null
    }),
    refreshSession: vi.fn().mockResolvedValue({
      data: { 
        session: {
          user: { id: '123', email: 'test@example.com' },
          access_token: 'new_token',
          refresh_token: 'new_refresh_token'
        }
      },
      error: null
    }),
    onAuthStateChange: vi.fn().mockImplementation((callback) => {
      // コールバックを即時実行して認証状態を設定
      setTimeout(() => {
        callback('SIGNED_IN', { 
          user: { id: '123', email: 'test@example.com' } 
        });
      }, 0);
      
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    }),
  },
  storage: {
    // ローカルストレージのモック
    local: {
      get: vi.fn().mockReturnValue(null),
      set: vi.fn(),
      remove: vi.fn(),
    },
  },
  from: () => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  }),
};

// テスト用にモックをリセットする関数
export const resetSupabaseMock = (): void => {
  // auth メソッドのリセット
  (Object.keys(supabase.auth) as Array<keyof AuthMethods>).forEach((key) => {
    supabase.auth[key].mockReset();
  });
  
  // storage.local メソッドのリセット
  (Object.keys(supabase.storage.local) as Array<keyof StorageMethods>).forEach((key) => {
    supabase.storage.local[key].mockReset();
  });
};
