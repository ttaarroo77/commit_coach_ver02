import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not defined');
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY is not defined');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// テーブル名の定数
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  SUBTASKS: 'subtasks',
  AI_MESSAGES: 'ai_messages',
} as const; 