import { render, screen, fireEvent } from '@testing-library/react'
import { TaskFormModal } from '@/components/projects/task-form-modal'

describe('TaskFormModal', () => {
  const mockOnSubmit = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('モーダルが正しく表示される', () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText('新規タスクの作成')).toBeInTheDocument()
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument()
    expect(screen.getByLabelText('説明')).toBeInTheDocument()
    expect(screen.getByLabelText('ステータス')).toBeInTheDocument()
    expect(screen.getByLabelText('優先度')).toBeInTheDocument()
    expect(screen.getByLabelText('期限')).toBeInTheDocument()
  })

  it('フォームの入力と送信が正しく動作する', () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    // タイトルを入力
    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: 'テストタスク' } })

    // 説明を入力
    const descriptionInput = screen.getByLabelText('説明')
    fireEvent.change(descriptionInput, { target: { value: 'テストの説明' } })

    // ステータスを選択
    const statusSelect = screen.getByLabelText('ステータス')
    fireEvent.click(statusSelect)
    fireEvent.click(screen.getByText('進行中'))

    // 優先度を選択
    const prioritySelect = screen.getByLabelText('優先度')
    fireEvent.click(prioritySelect)
    fireEvent.click(screen.getByText('高'))

    // フォームを送信
    const submitButton = screen.getByRole('button', { name: '作成' })
    fireEvent.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'テストタスク',
      description: 'テストの説明',
      status: 'in-progress',
      priority: 'high',
      dueDate: null,
    })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('キャンセルボタンが正しく動作する', () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('必須フィールドが空の場合、フォームは送信されない', () => {
    render(
      <TaskFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    const submitButton = screen.getByRole('button', { name: '作成' })
    fireEvent.click(submitButton)

    expect(mockOnSubmit).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })
}) 