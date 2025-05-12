import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectList } from '@/components/projects/project-list';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types';

// モックの作成
jest.mock('@/hooks/useProjects', () => ({
  useProjects: jest.fn(),
}));

// @dnd-kit/coreのモック
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: jest.fn(),
  useSensors: jest.fn(),
  MouseSensor: jest.fn(),
  TouchSensor: jest.fn(),
}));

// @dnd-kit/sortableのモック
jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: jest.fn(),
  sortableKeyboardCoordinates: jest.fn(),
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  })),
}));

describe('ProjectList', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'プロジェクト1',
      description: 'プロジェクト1の説明',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'プロジェクト2',
      description: 'プロジェクト2の説明',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const mockFetchProjects = jest.fn();
  const mockCreateProject = jest.fn();
  const mockUpdateProject = jest.fn();
  const mockDeleteProject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useProjects as jest.Mock).mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      error: null,
      fetchProjects: mockFetchProjects,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
      hasMore: false,
      fetchNextPage: jest.fn(),
      refreshProjects: jest.fn(),
    });
  });

  it('初期表示時に正しくレンダリングされること', () => {
    render(<ProjectList />);

    expect(screen.getByText('プロジェクト一覧')).toBeInTheDocument();
    expect(screen.getByText('新規プロジェクト')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト2')).toBeInTheDocument();
  });

  it('ローディング状態が正しく表示されること', () => {
    (useProjects as jest.Mock).mockReturnValue({
      projects: [],
      isLoading: true,
      error: null,
      fetchProjects: mockFetchProjects,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
      hasMore: false,
      fetchNextPage: jest.fn(),
      refreshProjects: jest.fn(),
    });

    render(<ProjectList />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('新規プロジェクト作成ボタンをクリックするとモーダルが表示されること', async () => {
    render(<ProjectList />);

    fireEvent.click(screen.getByText('新規プロジェクト'));

    await waitFor(() => {
      expect(screen.getByText('新規プロジェクトの作成')).toBeInTheDocument();
    });
  });

  it('プロジェクトの作成が正しく処理されること', async () => {
    const newProject = {
      name: '新しいプロジェクト',
      description: '新しいプロジェクトの説明',
    };

    render(<ProjectList />);

    fireEvent.click(screen.getByText('新規プロジェクト'));

    await waitFor(() => {
      expect(screen.getByText('新規プロジェクトの作成')).toBeInTheDocument();
    });

    // モーダル内のフォームを埋める
    fireEvent.change(screen.getByLabelText('プロジェクト名'), { target: { value: newProject.name } });
    fireEvent.change(screen.getByLabelText('説明'), { target: { value: newProject.description } });

    // 送信ボタンをクリック
    fireEvent.click(screen.getByText('作成'));

    await waitFor(() => {
      expect(mockCreateProject).toHaveBeenCalledWith(newProject);
    });
  });

  it('プロジェクトの検索が正しく機能すること', async () => {
    render(<ProjectList />);

    const searchInput = screen.getByPlaceholderText('プロジェクトを検索');
    fireEvent.change(searchInput, { target: { value: 'プロジェクト1' } });

    await waitFor(() => {
      expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
      expect(screen.queryByText('プロジェクト2')).not.toBeInTheDocument();
    });
  });

  it('エラーが発生した場合にトーストが表示されること', async () => {
    const errorMessage = 'プロジェクトの作成に失敗しました';
    mockCreateProject.mockRejectedValueOnce(new Error(errorMessage));

    render(<ProjectList />);

    fireEvent.click(screen.getByText('新規プロジェクト'));

    await waitFor(() => {
      expect(screen.getByText('新規プロジェクトの作成')).toBeInTheDocument();
    });

    // モーダル内のフォームを埋める
    fireEvent.change(screen.getByLabelText('プロジェクト名'), { target: { value: '新しいプロジェクト' } });

    // 送信ボタンをクリック
    fireEvent.click(screen.getByText('作成'));

    await waitFor(() => {
      expect(screen.getByText('エラー')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
}); 