import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from './logger';

// 環境変数の読み込み
dotenv.config();

// Supabase設定
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'dummy-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key';

// 開発環境での警告
if (
  process.env.NODE_ENV !== 'production' &&
  (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY)
) {
  logger.warn(
    'Supabase環境変数が設定されていません。開発用のダミー値を使用します。' +
      '実際のSupabaseプロジェクトに接続するには、.envファイルを設定してください。'
  );
}

/**
 * 匿名キーを使用したSupabaseクライアントを作成
 * フロントエンドからのリクエストや、ユーザー権限でのアクセスに使用
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * サービスロールキーを使用したSupabaseクライアントを作成
 * バックエンドからの管理者権限でのアクセスに使用
 * 注意: このクライアントはRLSを迂回するため、バックエンドでのみ使用すること
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * JWTトークンを使用してユーザーコンテキストでSupabaseクライアントを作成
 * @param token ユーザーのJWTトークン
 * @returns ユーザーコンテキストを持つSupabaseクライアント
 */
export const createSupabaseClientWithToken = (token: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

/**
 * Supabaseの接続テスト
 * @returns 接続が成功したかどうか
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.from('_test_connection').select('*').limit(1);

    if (error) {
      logger.error({ error }, 'Supabase接続テストエラー');
      return false;
    }

    logger.info('Supabase接続テスト成功');
    return true;
  } catch (error) {
    logger.error({ error }, 'Supabase接続テスト例外');
    return false;
  }
};

export default supabaseClient;
