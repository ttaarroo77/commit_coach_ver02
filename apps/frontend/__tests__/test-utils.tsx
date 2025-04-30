import { ReactNode } from 'react';
import { render, renderHook, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '../hooks/useAuth';
import { supabase as mockSupabaseClient } from '../__mocks__/lib/supabase';
import { vi } from 'vitest';

// テスト用のプロバイダーラッパー
export const AllProviders = ({ children }: { children: ReactNode }) => (
  <AuthProvider supabaseClient={mockSupabaseClient}>{children}</AuthProvider>
);

// カスタムレンダー関数
export const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// カスタムrenderHook関数
export const customRenderHook: typeof renderHook = (callback, options) => {
  return renderHook(callback, {
    wrapper: AllProviders,
    ...options
  });
};

// テスト用のエクスポート
export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook };
