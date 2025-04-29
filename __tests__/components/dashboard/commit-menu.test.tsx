import { render, screen, fireEvent } from '@testing-library/react';
import { CommitMenu } from '../../../components/dashboard/commit-menu';

// モックハンドラ
const mockOnSelectChange = jest.fn();
const mockOnSubmit = jest.fn();

// デフォルトプロップ
const defaultProps = {
  menuType: 'commit',
  selectedValue: 'daily',
  onSelectChange: mockOnSelectChange,
  onSubmit: mockOnSubmit,
  isLoading: false,
};

describe('CommitMenuコンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('コミットタイプのメニューが正しくレンダリングされる', () => {
    render(<CommitMenu {...defaultProps} />);

    // タイトルが表示される
    expect(screen.getByText('コミット生成')).toBeInTheDocument();

    // セレクトボックスが表示される
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    // オプションが正しく設定されている
    expect(screen.getByRole('option', { name: '日次コミット' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '週次コミット' })).toBeInTheDocument();

    // ボタンが表示される
    expect(screen.getByRole('button', { name: 'コミット生成' })).toBeInTheDocument();
  });

  test('メッセージタイプのメニューが正しくレンダリングされる', () => {
    render(<CommitMenu {...defaultProps} menuType="message" />);

    // タイトルが表示される
    expect(screen.getByText('メッセージ生成')).toBeInTheDocument();

    // ボタンのテキストが変わる
    expect(screen.getByRole('button', { name: 'メッセージ生成' })).toBeInTheDocument();
  });

  test('セレクトボックスの変更が正しく処理される', () => {
    render(<CommitMenu {...defaultProps} />);

    // セレクトボックスの値を変更
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'weekly' } });

    // コールバックが呼ばれることを確認
    expect(mockOnSelectChange).toHaveBeenCalledWith('weekly');
  });

  test('ボタンクリックが正しく処理される', () => {
    render(<CommitMenu {...defaultProps} />);

    // ボタンをクリック
    const button = screen.getByRole('button', { name: 'コミット生成' });
    fireEvent.click(button);

    // コールバックが呼ばれることを確認
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('ローディング中はボタンが無効になる', () => {
    render(<CommitMenu {...defaultProps} isLoading={true} />);

    // ボタンが無効になっていることを確認
    const button = screen.getByRole('button', { name: 'コミット生成' });
    expect(button).toBeDisabled();

    // ローディングインジケータが表示される
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('ボタンクリック時にローディング中だとコールバックが呼ばれない', () => {
    render(<CommitMenu {...defaultProps} isLoading={true} />);

    // ボタンをクリック
    const button = screen.getByRole('button', { name: 'コミット生成' });
    fireEvent.click(button);

    // コールバックが呼ばれないことを確認
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 