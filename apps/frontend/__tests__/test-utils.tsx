import React from 'react';
import { render as rtlRender, renderHook as rtlRenderHook, waitFor as rtlWaitFor, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

// テスト用のQueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// カスタムレンダラー
export function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider supabaseClient={mockSupabase as any}>{children}</AuthProvider>
      </QueryClientProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// テスト用のモックデータ
export const mockTasks = [
  {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-03-01',
    project_id: 'project-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'タスク2',
    description: 'タスク2の説明',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-03-02',
    project_id: 'project-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockProject = {
  id: 'project-1',
  name: 'テストプロジェクト',
  description: 'テストプロジェクトの説明',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// テスト用のモック関数

export const mockFunctions = {
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  updateTaskStatus: vi.fn(),
  fetchTasks: vi.fn(),
  fetchProjects: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
};

// テスト用のモックコンテキスト
export const mockContext = {
  tasks: mockTasks,
  projects: [mockProject],
  isLoading: false,
  error: null,
  ...mockFunctions,
};

// Supabaseモック
export const mockUser = {
  id: '123',
  email: 'test@example.com',
};

export const mockSession = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  user: mockUser,
};

// 完全なモックSupabaseクライアント
export const mockSupabase = {
  // 必要なプロパティ
  supabaseUrl: 'https://example.supabase.co',
  supabaseKey: 'mock-key',
  
  // 認証関連のメソッド
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    refreshSession: vi.fn(),
    onAuthStateChange: vi.fn((callback) => {
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }),
    __triggerAuthState: (event: string, session: any) => {
      // モックのイベントトリガー関数
    },
  },
  
  // その他必要なメソッドやプロパティ
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  storage: { from: vi.fn() },
  realtime: { channel: vi.fn() },
  rpc: vi.fn(),
};

// 認証テストのセットアップ
export const setupAuthTest = () => {
  console.log('Supabase設定:', { supabaseUrl: mockSupabase.supabaseUrl });
  
  // デフォルトのモック動作を設定
  mockSupabase.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });

  mockSupabase.auth.signInWithPassword.mockResolvedValue({
    data: { session: mockSession, user: mockUser },
    error: null,
  });

  mockSupabase.auth.signUp.mockResolvedValue({
    data: { session: mockSession, user: mockUser },
    error: null,
  });

  mockSupabase.auth.signOut.mockResolvedValue({ error: null });
  
  mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
    data: {},
    error: null,
  });
  
  mockSupabase.auth.refreshSession.mockResolvedValue({
    data: { session: mockSession, user: mockUser },
    error: null,
  });

  return { mockSupabase, mockSession, mockUser };
};

// renderHookのラッパー
export function renderHook(callback: any, options = {}) {
  const testQueryClient = createTestQueryClient();
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={testQueryClient}>
        <AuthProvider supabaseClient={mockSupabase as any}>{children}</AuthProvider>
      </QueryClientProvider>
    );
  }
  
  return rtlRenderHook(callback, { wrapper: Wrapper, ...options });
};

// 非同期処理の待機
export const waitFor = rtlWaitFor;
