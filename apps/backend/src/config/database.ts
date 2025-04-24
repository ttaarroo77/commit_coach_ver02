import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are not set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// テスト用のデータベースクライアント
export const createTestClient = () => {
  const testSupabaseUrl = process.env.TEST_SUPABASE_URL || supabaseUrl;
  const testSupabaseKey = process.env.TEST_SUPABASE_KEY || supabaseKey;

  return createClient(testSupabaseUrl, testSupabaseKey);
}; 