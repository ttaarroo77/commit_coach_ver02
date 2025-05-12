import { createVitestConfig } from './vitest.config.shared';
import path from 'path';
import { fileURLToPath } from 'url';

// ルートディレクトリのパスを取得
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 共通設定を使用して設定を作成
export default createVitestConfig(__dirname);
