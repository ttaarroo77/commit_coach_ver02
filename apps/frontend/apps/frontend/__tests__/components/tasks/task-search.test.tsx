import { render, screen, fireEvent } from '@testing-library/react';
import { TaskSearch } from '@/components/projects/task-search';

describe('TaskSearch', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('検索コンポーネントが正しくレンダリングされること', () => {
    render(<TaskSearch onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('タスクを検索...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });

  it('検索入力が正しく動作すること', () => {
    render(<TaskSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText('タスクを検索...');
    fireEvent.change(searchInput, { target: { value: 'テストタスク' } });

    expect(searchInput).toHaveValue('テストタスク');
  });

  it('検索ボタンクリックで検索が実行されること', () => {
    render(<TaskSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText('タスクを検索...');
    const searchButton = screen.getByRole('button', { name: '検索' });

    fireEvent.change(searchInput, { target: { value: 'テストタスク' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('テストタスク');
  });

  it('Enterキーで検索が実行されること', () => {
    render(<TaskSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText('タスクを検索...');
    fireEvent.change(searchInput, { target: { value: 'テストタスク' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('テストタスク');
  });

  it('検索クリアボタンが正しく動作すること', () => {
    render(<TaskSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText('タスクを検索...');
    const clearButton = screen.getByRole('button', { name: 'クリア' });

    fireEvent.change(searchInput, { target: { value: 'テストタスク' } });
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('検索履歴が正しく表示されること', () => {
    const searchHistory = ['タスク1', 'タスク2', 'タスク3'];
    render(<TaskSearch onSearch={mockOnSearch} searchHistory={searchHistory} />);

    searchHistory.forEach((history) => {
      expect(screen.getByText(history)).toBeInTheDocument();
    });
  });

  it('検索履歴のクリックで検索が実行されること', () => {
    const searchHistory = ['タスク1', 'タスク2', 'タスク3'];
    render(<TaskSearch onSearch={mockOnSearch} searchHistory={searchHistory} />);

    const historyItem = screen.getByText('タスク1');
    fireEvent.click(historyItem);

    expect(mockOnSearch).toHaveBeenCalledWith('タスク1');
  });
}); 