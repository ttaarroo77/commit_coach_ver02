import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

// 環境変数がない場合のデフォルト値
const supabaseUrl = process.env.SUPABASE_URL || 'https://iwyztimustunsapozimt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.servicekey';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

// 開発環境では警告を表示するだけにし、プロセスは終了しない
if (process.env.NODE_ENV !== 'production' && (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SUPABASE_ANON_KEY)) {
  console.warn('警告: Supabase環境変数が設定されていません。デフォルト値を使用します。');
}

// 管理者権限を持つクライアント（バックエンド用）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// 匿名クライアント（認証前のフロントエンド用）
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// テスト用にデフォルトエクスポート
export default supabaseAdmin;

// テーブル名の定数
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  SUBTASKS: 'subtasks',
  AI_MESSAGES: 'ai_messages',
} as const;
