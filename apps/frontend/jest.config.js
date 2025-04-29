import { createJestConfig } from 'next/jest.js';

const jestConfig = createJestConfig({
  // next.config.jsとテスト環境用の.envファイルが配置されたディレクトリのパス
  dir: './',
});

// Jestに渡すカスタム設定
const customJestConfig = {
  // テストが実行される前に実行するセットアップファイル
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // テスト対象から除外するパターン
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  // テスト環境
  testEnvironment: 'jsdom',
  // モジュール名のエイリアス
  moduleNameMapper: {
    // Next.jsのインポートエイリアスをJestで解決するための設定
    '^@/(.*)$': '<rootDir>/$1',
  },
  // カバレッジの設定
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  // テストの対象ディレクトリ
  testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
  transform: {},
};

// createJestConfigを使用することで、next/jestが提供する設定とカスタム設定をマージする
export default jestConfig(customJestConfig);
