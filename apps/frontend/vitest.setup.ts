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

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: () => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }),
  }),
}));
