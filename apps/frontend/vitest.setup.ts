import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Vitestのexpectにjest-domのmatchersを追加
expect.extend(matchers);

// viをグローバルに設定
global.vi = vi;

// 各テストの後にクリーンアップ
afterEach(() => {
  cleanup();
});
