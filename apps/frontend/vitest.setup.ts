import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Jest → Vitest 互換
globalThis.jest = vi as unknown as typeof jest;

// モックの設定
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
}));
