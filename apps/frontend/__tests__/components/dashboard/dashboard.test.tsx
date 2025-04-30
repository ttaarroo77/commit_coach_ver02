import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { TaskGroup as DashboardMain } from '../../../components/dashboard/task-group';

// モックの設定
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams()
}));

// テストラッパー
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {ui}
    </ThemeProvider>
  );
};

describe('DashboardMain (ダッシュボード画面)', () => {
  beforeEach(() => {
    // DOMをクリーンアップ
    document.body.innerHTML = '';
  });

  it('主要なUI要素が表示される', async () => {
    renderWithProviders(
      <DashboardMain
        id="test-group"
        title="タスクグループ"
        expanded={true}
        tasks={[]}
        completed={false}
        onToggleExpand={() => {}}
        onToggleTask={() => {}}
        onUpdateTaskTitle={() => {}}
        onUpdateSubtaskTitle={() => {}}
        onToggleTaskStatus={() => {}}
        onToggleSubtaskCompleted={() => {}}
        onAddTask={() => {}}
        onAddSubtask={() => {}}
        onDeleteTask={() => {}}
        onDeleteSubtask={() => {}}
      />
    );

    // タスクグループのヘッダー
    expect(await screen.findByText(/タスク/i)).toBeInTheDocument();

    // タスク追加ボタン
    expect(await screen.findByRole('button', { name: /追加|Add/i })).toBeInTheDocument();
  });

  // 必要に応じて追加テスト
  // it('タスク追加ボタンを押すとフォームが開く', async () => {...})
});
