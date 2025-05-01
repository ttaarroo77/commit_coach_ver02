import { render, screen, fireEvent } from '@testing-library/react'
import { TaskFilters } from '@/components/projects/task-filters'

describe('TaskFilters', () => {
  const mockOnFilterChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('検索フィールドに入力すると、フィルターが更新される', () => {
    render(<TaskFilters onFilterChange={mockOnFilterChange} />)

    const searchInput = screen.getByPlaceholderText('タスクを検索...')
    fireEvent.change(searchInput, { target: { value: 'テスト' } })

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: 'テスト',
      status: 'all',
      priority: 'all'
    })
  })

  it('ステータスを選択すると、フィルターが更新される', () => {
    render(<TaskFilters onFilterChange={mockOnFilterChange} />)

    // ステータスのドロップダウンを開く
    const statusButton = screen.getByRole('combobox', { name: /すべて/i })
    fireEvent.click(statusButton)

    // 「進行中」を選択
    const inProgressOption = screen.getByRole('option', { name: /進行中/i })
    fireEvent.click(inProgressOption)

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      status: 'in-progress',
      priority: 'all'
    })

    // 選択したステータスがバッジとして表示される
    expect(screen.getByText('進行中')).toBeInTheDocument()
  })

  it('優先度を選択すると、フィルターが更新される', () => {
    render(<TaskFilters onFilterChange={mockOnFilterChange} />)

    // 優先度のドロップダウンを開く
    const priorityButton = screen.getByRole('combobox', { name: /すべて/i })
    fireEvent.click(priorityButton)

    // 「高」を選択
    const highPriorityOption = screen.getByRole('option', { name: /高/i })
    fireEvent.click(highPriorityOption)

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      status: 'all',
      priority: 'high'
    })

    // 選択した優先度がバッジとして表示される
    expect(screen.getByText('優先度: 高')).toBeInTheDocument()
  })

  it('複数のフィルターを組み合わせることができる', () => {
    render(<TaskFilters onFilterChange={mockOnFilterChange} />)

    // 検索ワードを入力
    const searchInput = screen.getByPlaceholderText('タスクを検索...')
    fireEvent.change(searchInput, { target: { value: 'テスト' } })

    // ステータスを選択
    const statusButton = screen.getByRole('combobox', { name: /すべて/i })
    fireEvent.click(statusButton)
    const todoOption = screen.getByRole('option', { name: /未着手/i })
    fireEvent.click(todoOption)

    // 優先度を選択
    const priorityButton = screen.getByRole('combobox', { name: /すべて/i })
    fireEvent.click(priorityButton)
    const mediumPriorityOption = screen.getByRole('option', { name: /中/i })
    fireEvent.click(mediumPriorityOption)

    // 最後の呼び出しで全てのフィルターが適用されていることを確認
    expect(mockOnFilterChange).toHaveBeenLastCalledWith({
      search: 'テスト',
      status: 'todo',
      priority: 'medium'
    })

    // フィルターバッジが表示されている
    expect(screen.getByText('未着手')).toBeInTheDocument()
    expect(screen.getByText('優先度: 中')).toBeInTheDocument()
  })
}) 