import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectForm } from '../../../components/projects/project-form';
import { Project } from '../../../components/projects/project-list';

// モック関数
const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

// テスト用プロジェクトデータ
const mockProject: Project = {
  id: '1',
  name: 'テストプロジェクト',
  description: 'これはテスト用のプロジェクトです',
  status: 'active',
  progress: 30,
  members: 2,
  tasks: 5,
  dueDate: '2025-05-15',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-04-01T00:00:00Z',
  tags: ['テスト', 'React'],
  isFavorite: false
};

describe('ProjectFormコンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('新規作成モードでフォームが正しく表示される', () => {
    render(
      <ProjectForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title="新規プロジェクト"
      />
    );

    // タイトルが表示される
    expect(screen.getByText('新規プロジェクト')).toBeInTheDocument();

    // フォーム要素が表示される
    expect(screen.getByLabelText('プロジェクト名')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('ステータス')).toBeInTheDocument();
    expect(screen.getByLabelText('期限日')).toBeInTheDocument();
    expect(screen.getByLabelText('タグ')).toBeInTheDocument();

    // ボタンが表示される
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  test('編集モードでフォームが初期値で表示される', () => {
    render(
      <ProjectForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={mockProject}
        title="プロジェクトを編集"
      />
    );

    // タイトルが表示される
    expect(screen.getByText('プロジェクトを編集')).toBeInTheDocument();

    // フォーム要素が初期値で表示される
    expect(screen.getByLabelText('プロジェクト名')).toHaveValue('テストプロジェクト');
    expect(screen.getByLabelText('説明')).toHaveValue('これはテスト用のプロジェクトです');

    // タグが表示される
    expect(screen.getByText('テスト')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('キャンセルボタンをクリックするとonCloseが呼ばれる', () => {
    render(
      <ProjectForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('有効なデータでフォームを送信するとonSubmitが呼ばれる', async () => {
    render(
      <ProjectForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // フォームに値を入力
    const nameInput = screen.getByLabelText('プロジェクト名');
    fireEvent.change(nameInput, { target: { value: '新しいプロジェクト' } });

    const descriptionInput = screen.getByLabelText('説明');
    fireEvent.change(descriptionInput, { target: { value: '新しいプロジェクトの説明' } });

    // フォームを送信
    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    // onSubmitが正しい値で呼ばれることを確認
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: '新しいプロジェクト',
          description: '新しいプロジェクトの説明',
          status: 'active',
        })
      );
    });

    // フォームが閉じられることを確認
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('タグを追加できる', async () => {
    render(
      <ProjectForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // タグ入力欄に値を入力
    const tagInput = screen.getByPlaceholderText('タグを入力');
    fireEvent.change(tagInput, { target: { value: '新しいタグ' } });

    // 追加ボタンをクリック
    const addButton = screen.getByRole('button', { name: '' });
    fireEvent.click(addButton);

    // タグが追加されることを確認
    expect(screen.getByText('新しいタグ')).toBeInTheDocument();
  });

  test('タグを削除できる', async () => {
    render(
      <ProjectForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={mockProject}
      />
    );

    // 最初にタグが表示されていることを確認
    expect(screen.getByText('テスト')).toBeInTheDocument();

    // タグの削除ボタンをクリック
    const removeButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(removeButtons[0]); // 最初のタグの削除ボタンをクリック

    // タグが削除されることを確認
    expect(screen.queryByText('テスト')).not.toBeInTheDocument();
  });
}); 