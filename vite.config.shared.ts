import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 共通のVite設定を返す関数
 * @param dirname - 呼び出し元のディレクトリパス
 * @param additionalConfig - 追加の設定（オプション）
 */
export function createViteConfig(dirname: string, additionalConfig = {}) {
  return defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      alias: [
        {
          find: /^@\/(.*)/,
          replacement: path.resolve(dirname, '$1'),
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(dirname, '.'),
      },
    },
    ...additionalConfig
  });
}
