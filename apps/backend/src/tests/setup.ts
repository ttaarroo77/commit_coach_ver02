import { config } from 'dotenv';
import path from 'path';

// テスト環境用の.envファイルを読み込む
config({ path: path.resolve(__dirname, '../../.env.test') });

// グローバルなタイムアウト設定
jest.setTimeout(10000);

// テスト後のクリーンアップ
afterAll(async () => {
  // ここで必要なクリーンアップ処理を追加
});
