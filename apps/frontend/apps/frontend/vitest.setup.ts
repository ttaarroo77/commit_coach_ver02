import { vi } from 'vitest';

// Jest API のポリフィル
globalThis.jest = vi as any;

// その他のグローバル設定
beforeEach(() => {
  // テストごとのクリーンアップ
  vi.clearAllMocks();
});

afterEach(() => {
  // テスト後のクリーンアップ
  vi.resetAllMocks();
});
