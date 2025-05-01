import { render, screen, fireEvent } from '@testing-library/react'
import { TaskFilters } from '@/components/projects/task-filters'

describe('TaskFilters', () => {
  const mockOnSearchChange = vi.fn()
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('検索フィールドに入力すると、onSearchChangeが呼ばれる', () => {
    render(
      <TaskFilters
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
      />
    )

    const searchInput = screen.getByPlaceholderText('タスクを検索...')
    fireEvent.change(searchInput, { target: { value: 'テスト' } })

    expect(mockOnSearchChange).toHaveBeenCalledWith('テスト')
  })

  it('検索ボタンをクリックすると、onSearchが呼ばれる', () => {
    render(
      <TaskFilters
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
      />
    )

    const searchButton = screen.getByRole('button')
    fireEvent.click(searchButton)

    expect(mockOnSearch).toHaveBeenCalled()
  })

  it('searchQueryの値が入力フィールドに反映される', () => {
    render(
      <TaskFilters
        searchQuery="既存の検索"
        onSearchChange={mockOnSearchChange}
        onSearch={mockOnSearch}
      />
    )

    const searchInput = screen.getByPlaceholderText('タスクを検索...')
    expect(searchInput).toHaveValue('既存の検索')
  })
}) 