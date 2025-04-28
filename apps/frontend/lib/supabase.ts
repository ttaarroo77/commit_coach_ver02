import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// 環境変数からSupabase URLとAnon Keyを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('環境変数エラー:', { supabaseUrl, supabaseAnonKey });
  throw new Error('Supabase URLまたはAnon Keyが設定されていません。');
}

console.log('Supabase設定:', { supabaseUrl });

// Supabaseクライアントを作成（直接createClientを使用）
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce', // PKCEフローを使用（より安全）
      debug: true // デバッグモードを有効化
    },
    global: {
      headers: {
        'x-application-name': 'commit-coach',
      },
    },
  }
);

// 初期化時にセッション情報をコンソールに出力（デバッグ用）
if (typeof window !== 'undefined') {
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
