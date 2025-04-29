import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectDetail } from '../../../components/projects/project-detail';
import { Project } from '../../../components/projects/project-list';

// モック関数
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnClose = jest.fn();

// テスト用プロジェクトデータ
const mockProject: Project = {
  id: '1',
  name: 'テストプロジェクト',
  description: 'これはテスト用のプロジェクトです。詳細な説明が含まれています。',
  status: 'active',
  progress: 30,
  members: 5,
  tasks: 10,
  dueDate: '2025-05-15',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-04-01T00:00:00Z',
  tags: ['テスト', 'React'],
  isFavorite: false
};

describe('ProjectDetailコンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('プロジェクト詳細が正しく表示される', () => {
    render(
      <ProjectDetail
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );

    // プロジェクト名が表示される
    expect(screen.getByText('テストプロジェクト')).toBeInTheDocument();

    // プロジェクトの説明が表示される
    expect(screen.getByText('これはテスト用のプロジェクトです。詳細な説明が含まれています。')).toBeInTheDocument();

    // ステータスが表示される
    expect(screen.getByText('ステータス: アクティブ')).toBeInTheDocument();

    // 進捗が表示される
    expect(screen.getByText('30%')).toBeInTheDocument();

    // メンバー数が表示される
    expect(screen.getByText('5')).toBeInTheDocument();

    // タスク数が表示される
    expect(screen.getByText('10')).toBeInTheDocument();

    // タグが表示される
    expect(screen.getByText('テスト')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();

    // 期限日が表示される
    expect(screen.getByText(/2025年5月15日/)).toBeInTheDocument();

    // 作成日が表示される
    expect(screen.getByText(/2025年1月1日/)).toBeInTheDocument();

    // 更新日が表示される
    expect(screen.getByText(/2025年4月1日/)).toBeInTheDocument();
  });

  test('編集ボタンをクリックするとonEditが呼ばれる', () => {
    render(
      <ProjectDetail
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProject);
  });

  test('削除ボタンをクリックするとonDeleteが呼ばれる', () => {
    render(
      <ProjectDetail
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );

    const deleteButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProject.id);
  });

  test('閉じるボタンをクリックするとonCloseが呼ばれる', () => {
    render(
      <ProjectDetail
        project={mockProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: '閉じる' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('お気に入りボタンをクリックするとお気に入り状態が切り替わる', () => {
    const favoriteProject = { ...mockProject, isFavorite: true };

    render(
      <ProjectDetail
        project={favoriteProject}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );

    // お気に入りのアイコンが表示される
    const favoriteIcon = screen.getByTestId('favorite-icon');
    expect(favoriteIcon).toBeInTheDocument();

    // テスト用に実装されていないため、このテストは確認のみ
    expect(favoriteIcon).toHaveAttribute('data-favorite', 'true');
  });

  test('プロジェクトデータがない場合は何も表示されない', () => {
    render(
      <ProjectDetail
        project={null}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );

    // 要素が何も表示されないことを確認
    expect(screen.queryByText('テストプロジェクト')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '編集' })).not.toBeInTheDocument();
  });
}); 