import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

async function runMigration() {
  try {
    // Supabase CLIがインストールされているか確認
    await execAsync('supabase --version');

    // マイグレーションファイルのパス
    const migrationPath = path.join(
      __dirname,
      '../supabase/migrations/20240422_initial_schema.sql'
    );

    // マイグレーションを実行
    const { stdout, stderr } = await execAsync(
      `supabase db push --db-url ${process.env.SUPABASE_DB_URL} --file ${migrationPath}`
    );

    console.log('Migration output:', stdout);
    if (stderr) {
      console.error('Migration warnings:', stderr);
    }

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
