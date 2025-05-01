import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
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
