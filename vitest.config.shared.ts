import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';

/**
 * 共通のVitest設定を返す関数
 * @param dirname - 呼び出し元のディレクトリパス
 * @param additionalConfig - 追加の設定（オプション）
 */
export function createVitestConfig(dirname: string, additionalConfig = {}) {
  return defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
    resolve: {
      alias: {
        '@': path.resolve(dirname, '.'),
        '@tests': path.resolve(dirname, 'tests'),
      },
    },
    ...additionalConfig
  });
}
