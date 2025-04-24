const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // next.config.jsとテスト環境用の.envファイルが配置されたディレクトリのパスを指定
  dir: './',
});

// Jestのカスタム設定を設定する
const customJestConfig = {
  // テストが実行される前にインポートされるファイルを追加
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // jsdomテスト環境を使用
  testEnvironment: 'jest-environment-jsdom',
  // テストマッチパターン
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx)',
    '**/?(*.)+(spec|test).(ts|tsx)',
  ],
  // モックするパス
  moduleNameMapper: {
    // aliasの設定
    '^@/(.*)$': '<rootDir>/$1',
    // 画像などのアセットをモック
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // カバレッジの設定
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!next.config.js',
  ],
  // テスト対象から除外するディレクトリ
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
};

// createJestConfigを使用することによって、next/jestが提供する設定がすべて含まれる
module.exports = createJestConfig(customJestConfig);
