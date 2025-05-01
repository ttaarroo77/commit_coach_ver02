import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// 環境変数からSupabase URLとAnon Keyを取得
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// テスト環境の場合はダミー値を使用
if (process.env.NODE_ENV === 'test') {
  supabaseUrl = 'https://example.supabase.co';
  supabaseAnonKey = 'dummy-anon-key';
} else if (!supabaseUrl || !supabaseAnonKey) {
  // テスト環境でない場合は環境変数の存在をチェック
  console.error('環境変数エラー:', { supabaseUrl, supabaseAnonKey });
  throw new Error('Supabase URLまたはAnon Keyが設定されていません。');
}

console.log('Supabase設定:', { supabaseUrl });

// Supabaseクライアントを作成
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development'
    },
    global: {
      headers: {
        'x-application-name': 'commit-coach',
      },
    },
  }
);

// 初期化時にセッション情報をコンソールに出力（デバッグ用）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  supabase.auth.getSession().then(({ data, error }) => {
    console.log('現在のセッション状態:', data);
    if (error) {
      console.error('セッション取得エラー:', error);
    }
  });

  // 認証状態の変化を監視
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('認証状態変化:', event, session);
  });
}
