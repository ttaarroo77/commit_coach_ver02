import { supabaseAdmin } from '../config/supabase';

/**
 * Supabaseへの接続テストを行う関数
 * @returns 接続成功時はtrue、失敗時はエラー内容をスロー
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    // 接続テスト用に簡単なクエリを実行
    const { data, error } = await supabaseAdmin.rpc('version');

    if (error) {
      throw new Error(`Supabase connection error: ${error.message}`);
    }

    console.log('Supabase connection successful');
    console.log('PostgreSQL version:', data);

    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw error;
  }
}

/**
 * テーブル存在チェックを行う関数
 * @returns 接続＋テーブル確認成功時はtrue、失敗時はエラー内容をスロー
 */
export async function verifyDatabaseSchema(): Promise<boolean> {
  try {
    // 必要なテーブルの存在確認
    const requiredTables = [
      'users',
      'projects',
      'project_members',
      'task_groups',
      'tasks',
      'subtasks',
      'ai_messages'
    ];

    const { data: tables, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', requiredTables);

    if (error) {
      throw new Error(`Failed to query tables: ${error.message}`);
    }

    const existingTables = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      throw new Error(`Missing required tables: ${missingTables.join(', ')}`);
    }

    console.log('Database schema verification successful');
    console.log('All required tables exist:', existingTables.join(', '));

    return true;
  } catch (error) {
    console.error('Database schema verification failed:', error);
    throw error;
  }
}

// このファイルが直接実行された場合に接続テストを実行
if (require.main === module) {
  (async () => {
    try {
      await testSupabaseConnection();
      await verifyDatabaseSchema();
      console.log('All Supabase tests passed!');
      process.exit(0);
    } catch (error) {
      console.error('Supabase tests failed:', error);
      process.exit(1);
    }
  })();
} 