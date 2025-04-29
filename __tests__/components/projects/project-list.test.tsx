import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectList, Project } from '../../../components/projects/project-list';

// テスト用モックデータ
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'テストプロジェクト1',
    description: 'テスト用のプロジェクト説明1',
    status: 'active',
    progress: 50,
    members: 3,
    tasks: 10,
    dueDate: '2025-05-15',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z',
    tags: ['テスト', 'React'],
    isFavorite: true
  },
  {
    id: '2',
    name: 'テストプロジェクト2',
    description: 'テスト用のプロジェクト説明2',
    status: 'completed',
    progress: 100,
    members: 2,
    tasks: 5,
    dueDate: '2025-04-10',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-04-10T00:00:00Z',
    tags: ['テスト', 'API'],
    isFavorite: false
  }
];

// モック関数
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnView = jest.fn();
const mockOnFavorite = jest.fn();
const mockOnCreate = jest.fn();

describe('ProjectListコンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('プロジェクトリストが正しく表示される', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
        onFavorite={mockOnFavorite}
        onCreate={mockOnCreate}
      />
    );

    // ヘッダーが表示される
    expect(screen.getByText('プロジェクト一覧')).toBeInTheDocument();
    expect(screen.getByText('新規プロジェクト')).toBeInTheDocument();

    // プロジェクトが表示される
    expect(screen.getByText('テストプロジェクト1')).toBeInTheDocument();
    expect(screen.getByText('テストプロジェクト2')).toBeInTheDocument();

    // プロジェクトカードが正しく表示される
    const projectCards = screen.getAllByTestId('project-card');
    expect(projectCards).toHaveLength(2);

    // ステータスバッジが表示される
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('完了')).toBeInTheDocument();

    // タグが表示される
    const testTags = screen.getAllByText('テスト');
    expect(testTags).toHaveLength(2);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
  });

  test('空のプロジェクトリストの場合、メッセージが表示される', () => {
    render(
      <ProjectList
        projects={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
        onFavorite={mockOnFavorite}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.getByText('プロジェクトがありません')).toBeInTheDocument();
    expect(screen.getByText('新しいプロジェクトを作成して開発を始めましょう')).toBeInTheDocument();
  });

  test('新規プロジェクトボタンをクリックするとコールバックが呼ばれる', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
        onFavorite={mockOnFavorite}
        onCreate={mockOnCreate}
      />
    );

    const createButton = screen.getAllByText('新規プロジェクト')[0];
    fireEvent.click(createButton);

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  test('プロジェクトカードをクリックするとonViewが呼ばれる', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
        onFavorite={mockOnFavorite}
        onCreate={mockOnCreate}
      />
    );

    const projectCards = screen.getAllByTestId('project-card');
    fireEvent.click(projectCards[0]);

    expect(mockOnView).toHaveBeenCalledTimes(1);
    expect(mockOnView).toHaveBeenCalledWith('1');
  });

  test('編集メニューをクリックするとonEditが呼ばれる', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
        onFavorite={mockOnFavorite}
        onCreate={mockOnCreate}
      />
    );

    // ドロップダウンメニューを開く
    const menuButtons = screen.getAllByRole('button', { name: 'メニューを開く' });
    fireEvent.click(menuButtons[0]);

    // 編集メニューをクリック
    const editMenuItem = screen.getByText('編集する');
    fireEvent.click(editMenuItem);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProjects[0]);
  });

  test('削除メニューをクリックするとonDeleteが呼ばれる', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
        onFavorite={mockOnFavorite}
        onCreate={mockOnCreate}
      />
    );

    // ドロップダウンメニューを開く
    const menuButtons = screen.getAllByRole('button', { name: 'メニューを開く' });
    fireEvent.click(menuButtons[0]);

    // 削除メニューをクリック
    const deleteMenuItem = screen.getByText('削除する');
    fireEvent.click(deleteMenuItem);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  test('お気に入りメニューをクリックするとonFavoriteが呼ばれる', () => {
    render(
      <ProjectList
        projects={mockProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
        onFavorite={mockOnFavorite}
        onCreate={mockOnCreate}
      />
    );

    // ドロップダウンメニューを開く
    const menuButtons = screen.getAllByRole('button', { name: 'メニューを開く' });
    fireEvent.click(menuButtons[0]);

    // お気に入りメニューをクリック
    const favoriteMenuItem = screen.getByText('お気に入りから削除');
    fireEvent.click(favoriteMenuItem);

    expect(mockOnFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnFavorite).toHaveBeenCalledWith('1', false);
  });
}); 