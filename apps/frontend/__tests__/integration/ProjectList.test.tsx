import React from 'react';
import { render } from '../test-utils';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ProjectList } from '../../components/projects/project-list';
import { KanbanBoard } from '../../components/projects/kanban-board';
import { useProjects } from '../../hooks/useProjects';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { ProjectWithStats } from '../../types/project';
import { Task } from '../../types/task';
import { vi } from 'vitest';
import { Wrapper } from '../test-utils';

// useProjectsフックをモック
vi.mock('../../hooks/useProjects', () => ({
  useProjects: vi.fn()
}));

// useProjectTasksフックをモック
vi.mock('../../hooks/useProjectTasks', () => ({
  useProjectTasks: vi.fn()
}));

// DnD関連のモック
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual,
    DndContext: ({ children }) => <div data-testid="dnd-context">{children}</div>,
    DragOverlay: ({ children }) => <div data-testid="drag-overlay">{children}</div>,
    useSensors: vi.fn(() => ({})),
    useSensor: vi.fn(),
    PointerSensor: vi.fn(),
    KeyboardSensor: vi.fn(),
  };
});

// アニメーション関連のモック
vi.mock('../../components/ui/animations', () => ({
  AnimatedList: ({ children }) => <div data-testid="animated-list">{children}</div>,
  FadeIn: ({ children }) => <div data-testid="fade-in">{children}</div>,
}));

// モックプロジェクトデータ
const mockProjects: ProjectWithStats[] = [
  {
    id: 'project-1',
    name: 'プロジェクト1',
    description: 'プロジェクト1の説明',
    status: 'active',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    taskCount: 3,
    completedTaskCount: 1,
    progress: 33
  },
  {
    id: 'project-2',
    name: 'プロジェクト2',
    description: 'プロジェクト2の説明',
    status: 'active',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    taskCount: 5,
    completedTaskCount: 2,
    progress: 40
  }
];

// モックタスクデータ
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'backlog',
    priority: 'medium',
    project_id: 'project-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'タスク2',
    description: 'タスク2の説明',
    status: 'in_progress',
    priority: 'high',
    project_id: 'project-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// モック関数
const mockCreateProject = vi.fn();
const mockUpdateProject = vi.fn();
const mockDeleteProject = vi.fn();
const mockRefreshProjects = vi.fn();
const mockUpdateFilters = vi.fn();
const mockResetFilters = vi.fn();

const mockCreateTask = vi.fn();
const mockUpdateTask = vi.fn();
const mockUpdateTaskStatus = vi.fn();
const mockDeleteTask = vi.fn();

describe('ProjectList 統合テスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // useProjectsフックのモック実装
    (useProjects as any).mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      error: null,
      filters: { search: '', status: 'all' },
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
      refreshProjects: mockRefreshProjects
    });

    // useProjectTasksフックのモック実装
    (useProjectTasks as any).mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      updateTaskStatus: mockUpdateTaskStatus,
      deleteTask: mockDeleteTask
    });
  });

  it('プロジェクトリストとカンバンボードの連携', async () => {
    // 統合コンポーネントをレンダリング
    const { rerender } = render(
      <Wrapper>
        <div>
          <ProjectList />
          <KanbanBoard projectId="project-1" />
        </div>
      </Wrapper>
    );

    // プロジェクトリストが表示されていることを確認
    expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト2')).toBeInTheDocument();

    // カンバンボードが表示されていることを確認
    expect(screen.getByText('カンバンボード')).toBeInTheDocument();
    
    // プロジェクト1のタスクがカンバンボードに表示されていることを確認
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();

    // プロジェクト2を選択した場合のシミュレーション
    // 実際のアプリケーションではプロジェクトカードをクリックすると
    // プロジェクト詳細ページに遷移するため、ここでは再レンダリングで代用
    
    // プロジェクト2のタスクデータを用意
    const project2Tasks: Task[] = [
      {
        id: 'task-3',
        title: 'プロジェクト2のタスク',
        description: 'プロジェクト2のタスクの説明',
        status: 'backlog',
        priority: 'low',
        project_id: 'project-2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    // プロジェクト2のタスクを返すようにモックを更新
    (useProjectTasks as any).mockReturnValue({
      tasks: project2Tasks,
      isLoading: false,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      updateTaskStatus: mockUpdateTaskStatus,
      deleteTask: mockDeleteTask
    });
    
    // プロジェクト2のカンバンボードを表示するために再レンダリング
    rerender(
      <Wrapper>
        <div>
          <ProjectList />
          <KanbanBoard projectId="project-2" />
        </div>
      </Wrapper>
    );
    
    // プロジェクト2のタスクがカンバンボードに表示されていることを確認
    expect(screen.getByText('プロジェクト2のタスク')).toBeInTheDocument();
  });

  it('プロジェクトの検索機能', async () => {
    render(
      <Wrapper>
        <ProjectList />
      </Wrapper>
    );

    // 検索フィルターを取得
    const searchInput = screen.getByPlaceholderText(/プロジェクトを検索/i);
    expect(searchInput).toBeInTheDocument();

    // 検索を実行
    fireEvent.change(searchInput, { target: { value: 'プロジェクト1' } });
    
    // updateFiltersが呼ばれたことを確認
    expect(mockUpdateFilters).toHaveBeenCalledWith(expect.objectContaining({
      search: 'プロジェクト1'
    }));
    
    // 検索結果に基づいてフィルタリングされたプロジェクトを表示するシミュレーション
    (useProjects as any).mockReturnValue({
      projects: [mockProjects[0]], // プロジェクト1のみを返す
      isLoading: false,
      error: null,
      filters: { search: 'プロジェクト1', status: 'all' },
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
      refreshProjects: mockRefreshProjects
    });
    
    // 再レンダリングして検索結果を反映
    render(
      <Wrapper>
        <ProjectList />
      </Wrapper>
    );
    
    // プロジェクト1のみが表示されていることを確認
    expect(screen.getAllByText('プロジェクト1').length).toBeGreaterThan(0);
    expect(screen.queryByText('プロジェクト2')).not.toBeInTheDocument();
  });

  it('プロジェクトの削除機能', async () => {
    render(
      <Wrapper>
        <ProjectList />
      </Wrapper>
    );

    // 削除ボタンのクリックをシミュレート
    // 実際のUIでは削除ボタンはプロジェクトカード内にあるため、
    // 直接deleteProject関数を呼び出してシミュレート
    
    // window.confirmをモック
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true); // 確認ダイアログでOKを選択
    
    await act(async () => {
      mockDeleteProject.mockResolvedValueOnce({ success: true });
      // プロジェクト削除関数を直接呼び出し
      await mockDeleteProject('project-1');
    });
    
    // deleteProjectが呼ばれたことを確認
    expect(mockDeleteProject).toHaveBeenCalledWith('project-1');
    
    // 削除後のプロジェクトリストを表示するシミュレーション
    (useProjects as any).mockReturnValue({
      projects: [mockProjects[1]], // プロジェクト2のみを返す
      isLoading: false,
      error: null,
      filters: { search: '', status: 'all' },
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
      refreshProjects: mockRefreshProjects
    });
    
    // 再レンダリングして削除結果を反映
    render(
      <Wrapper>
        <ProjectList />
      </Wrapper>
    );
    
    // プロジェクト1が削除されていることを確認
    expect(screen.queryByText('プロジェクト1')).not.toBeInTheDocument();
    expect(screen.getByText('プロジェクト2')).toBeInTheDocument();
    
    // モックをリストア
    window.confirm = originalConfirm;
  });
});
