import { render, screen, waitFor } from '@testing-library/react';
import { ProjectDetailPage } from '@/app/projects/[id]/page';
import { useProject } from '@/hooks/useProject';
import { useAuth } from '@/hooks/useAuth';
import { fireEvent } from '@testing-library/react';

// モックの設定
jest.mock('@/hooks/useProject');
jest.mock('@/hooks/useAuth');

describe('ProjectDetailPage', () => {
  const mockProject = {
    id: '1',
    name: 'プロジェクト1',
    description: 'プロジェクト1の説明',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

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

    (useProject as jest.Mock).mockReturnValue({
      project: mockProject,
      loading: false,
      error: null,
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
    });
  });

  it('プロジェクト情報が正しく表示されること', async () => {
    render(<ProjectDetailPage params={{ id: '1' }} />);

    await waitFor(() => {
      expect(screen.getByText('プロジェクト1')).toBeInTheDocument();
      expect(screen.getByText('プロジェクト1の説明')).toBeInTheDocument();
      expect(screen.getByText('ステータス: アクティブ')).toBeInTheDocument();
    });
  });

  it('ローディング中はローディングインジケータが表示されること', () => {
    (useProject as jest.Mock).mockReturnValue({
      project: null,
      loading: true,
      error: null,
    });

    render(<ProjectDetailPage params={{ id: '1' }} />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('エラーが発生した場合、エラーメッセージが表示されること', () => {
    const errorMessage = 'プロジェクトの取得に失敗しました';
    (useProject as jest.Mock).mockReturnValue({
      project: null,
      loading: false,
      error: errorMessage,
    });

    render(<ProjectDetailPage params={{ id: '1' }} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('未認証ユーザーはログインページにリダイレクトされること', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    render(<ProjectDetailPage params={{ id: '1' }} />);

    expect(screen.getByText('ログインが必要です')).toBeInTheDocument();
  });

  it('プロジェクトの更新が正しく動作すること', async () => {
    const mockUpdateProject = jest.fn();
    (useProject as jest.Mock).mockReturnValue({
      project: mockProject,
      loading: false,
      error: null,
      updateProject: mockUpdateProject,
    });

    render(<ProjectDetailPage params={{ id: '1' }} />);

    const editButton = screen.getByRole('button', { name: 'プロジェクトを編集' });
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText('プロジェクト名');
    const descriptionInput = screen.getByLabelText('説明');
    const statusSelect = screen.getByLabelText('ステータス');

    fireEvent.change(nameInput, { target: { value: '更新されたプロジェクト' } });
    fireEvent.change(descriptionInput, { target: { value: '更新された説明' } });
    fireEvent.change(statusSelect, { target: { value: 'archived' } });

    const saveButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveButton);

    expect(mockUpdateProject).toHaveBeenCalledWith('1', {
      name: '更新されたプロジェクト',
      description: '更新された説明',
      status: 'archived',
    });
  });

  it('プロジェクトの削除が正しく動作すること', async () => {
    const mockDeleteProject = jest.fn();
    (useProject as jest.Mock).mockReturnValue({
      project: mockProject,
      loading: false,
      error: null,
      deleteProject: mockDeleteProject,
    });

    render(<ProjectDetailPage params={{ id: '1' }} />);

    const deleteButton = screen.getByRole('button', { name: 'プロジェクトを削除' });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(confirmButton);

    expect(mockDeleteProject).toHaveBeenCalledWith('1');
  });
}); 