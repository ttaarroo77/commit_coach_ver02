import { render, screen, waitFor } from '@testing-library/react';
import { ProjectListPage } from '@/app/projects/page';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useProjects');
jest.mock('@/hooks/useAuth');

describe('ProjectListPage', () => {
  const mockProjects = [
    {
      id: '1',
      name: 'プロジェクト1',
      description: 'プロジェクト1の説明',
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'プロジェクト2',
      description: 'プロジェクト2の説明',
      status: 'archived',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
  ];

  const mockUser = {
    id: '123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
    });

    (useProjects as jest.Mock).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      createProject: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
    });
  });

  it('プロジェクト一覧が正しく表示されること', async () => {
    render(<ProjectListPage />);

    await waitFor(() => {
      expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
      expect(screen.getByText('プロジェクト2')).toBeInTheDocument();
    });
  });

  it('ローディング中はローディングインジケータが表示されること', () => {
    (useProjects as jest.Mock).mockReturnValue({
      projects: [],
      loading: true,
      error: null,
    });

    render(<ProjectListPage />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('エラーが発生した場合、エラーメッセージが表示されること', () => {
    const errorMessage = 'プロジェクトの取得に失敗しました';
    (useProjects as jest.Mock).mockReturnValue({
      projects: [],
      loading: false,
      error: errorMessage,
    });

    render(<ProjectListPage />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('未認証ユーザーはログインページにリダイレクトされること', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    render(<ProjectListPage />);

    expect(screen.getByText('ログインが必要です')).toBeInTheDocument();
  });

  it('新しいプロジェクトの作成が正しく動作すること', async () => {
    const mockCreateProject = jest.fn();
    (useProjects as jest.Mock).mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
      createProject: mockCreateProject,
    });

    render(<ProjectListPage />);

    const addButton = screen.getByRole('button', { name: 'プロジェクトを追加' });
    fireEvent.click(addButton);

    const nameInput = screen.getByLabelText('プロジェクト名');
    const descriptionInput = screen.getByLabelText('説明');

    fireEvent.change(nameInput, { target: { value: '新しいプロジェクト' } });
    fireEvent.change(descriptionInput, { target: { value: '新しいプロジェクトの説明' } });

    const saveButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveButton);

    expect(mockCreateProject).toHaveBeenCalledWith({
      name: '新しいプロジェクト',
      description: '新しいプロジェクトの説明',
      status: 'active',
    });
  });

  it('プロジェクトの検索が正しく動作すること', async () => {
    render(<ProjectListPage />);

    const searchInput = screen.getByPlaceholderText('プロジェクトを検索...');
    fireEvent.change(searchInput, { target: { value: 'プロジェクト1' } });

    await waitFor(() => {
      expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
      expect(screen.queryByText('プロジェクト2')).not.toBeInTheDocument();
    });
  });

  it('プロジェクトのフィルタリングが正しく動作すること', async () => {
    render(<ProjectListPage />);

    const statusSelect = screen.getByLabelText('ステータス');
    fireEvent.change(statusSelect, { target: { value: 'active' } });

    await waitFor(() => {
      expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
      expect(screen.queryByText('プロジェクト2')).not.toBeInTheDocument();
    });
  });
}); 