import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// カスタムマッチャーの追加
expect.extend(matchers);

// 各テストの後にクリーンアップ
afterEach(() => {
  cleanup();
});

// グローバルなエラーハンドリング
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// テスト環境の設定
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ドラッグ＆ドロップのモック
Object.defineProperty(window, 'DragEvent', {
  value: class DragEvent extends Event {
    dataTransfer = {
      setData: vi.fn(),
      getData: vi.fn(),
      clearData: vi.fn(),
      setDragImage: vi.fn(),
    };
  },
}); 