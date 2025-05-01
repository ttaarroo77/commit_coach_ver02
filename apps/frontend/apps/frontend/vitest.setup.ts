import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { ReactNode } from 'react';

// window.matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// jestのグローバル関数をvitestの関数にマッピング
const globalJest = {
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  spyOn: vi.spyOn,
  mock: vi.fn,
  fn: vi.fn,
};

Object.defineProperty(globalThis, 'jest', {
  get: () => globalJest,
  configurable: true,
});

// テスト前後のクリーンアップ
beforeEach(() => {
  vi.clearAllMocks();
});

// モックのセットアップ
vi.mock('@/providers/auth-provider', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@/hooks/useProjectTasks', () => ({
  useProjectTasks: vi.fn(),
}));

vi.mock('@/hooks/useTask', () => ({
  useTask: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@dnd-kit/core', () => ({
  DndProvider: ({ children }: { children: ReactNode }) => children,
}));
