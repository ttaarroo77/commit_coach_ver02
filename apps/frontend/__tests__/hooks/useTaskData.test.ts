import { renderHook, waitFor } from '@testing-library/react';
import { useTaskData } from '@/hooks/useTaskData';
import { SWRConfig } from 'swr';
import { ReactNode, ReactElement, createElement } from 'react';

// SWRのキャッシュをリセットするためのラッパー
const wrapper = ({ children }: { children: ReactNode }): ReactElement => {
  return createElement(
    SWRConfig,
    { value: { provider: () => new Map() } },
    children
  );
};

describe('useTaskData Hook', () => {
  it('初期状態では空の配列とローディング状態を返す', async () => {
    const { result } = renderHook(() => useTaskData(), { wrapper });
    
    // 初期状態ではローディング中
    expect(result.current.isLoading).toBe(true);
    expect(result.current.taskGroups).toEqual([]);
    
    // データが読み込まれるまで待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('データが正常に読み込まれる', async () => {
    const { result } = renderHook(() => useTaskData(), { wrapper });
    
    // データが読み込まれるまで待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // データが読み込まれたことを確認
    expect(result.current.taskGroups.length).toBeGreaterThan(0);
    
    // データ構造を確認
    const firstGroup = result.current.taskGroups[0];
    expect(firstGroup).toHaveProperty('id');
    expect(firstGroup).toHaveProperty('title');
    expect(firstGroup).toHaveProperty('tasks');
    expect(Array.isArray(firstGroup.tasks)).toBe(true);
    
    if (firstGroup.tasks.length > 0) {
      const firstTask = firstGroup.tasks[0];
      expect(firstTask).toHaveProperty('id');
      expect(firstTask).toHaveProperty('title');
      expect(firstTask).toHaveProperty('status');
      expect(firstTask).toHaveProperty('progress');
      expect(firstTask).toHaveProperty('subtasks');
      expect(Array.isArray(firstTask.subtasks)).toBe(true);
    }
  });

  it('mutate関数が提供される', async () => {
    const { result } = renderHook(() => useTaskData(), { wrapper });
    
    // mutate関数が存在することを確認
    expect(typeof result.current.mutate).toBe('function');
  });
});
