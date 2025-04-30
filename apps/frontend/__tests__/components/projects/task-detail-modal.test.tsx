import { render, screen, fireEvent } from '@testing-library/react'
import { TaskDetailModal } from '@/components/projects/task-detail-modal'

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate: string | null
  completed: boolean
  assignee?: {
    id: string
    name: string
  }
  subtasks?: {
    id: string
    title: string
    completed: boolean
  }[]
}

describe('TaskDetailModal', () => {
  const mockTask: Task = {
    id: '1',
    title: 'テストタスク',
    description: 'テストの説明',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-05-01',
    completed: false,
    assignee: {
      id: '1',
      name: 'テストユーザー'
    },
    subtasks: [
      { id: '1', title: 'サブタスク1', completed: false },
      { id: '2', title: 'サブタスク2', completed: true }
    ]
  }

  const mockOnClose = jest.fn()
  const mockOnUpdate = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タスクの詳細が正しく表示される', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.getByText('テストの説明')).toBeInTheDocument()
    expect(screen.getByText('2025年5月1日')).toBeInTheDocument()
    expect(screen.getByText('サブタスク1')).toBeInTheDocument()
    expect(screen.getByText('サブタスク2')).toBeInTheDocument()
  })

  it('編集モードでタスクを更新できる', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    // 編集モードに切り替え
    const editButton = screen.getByRole('button', { name: /編集/i })
    fireEvent.click(editButton)

    // タイトルを編集
    const titleInput = screen.getByPlaceholderText('タスクのタイトル')
    fireEvent.change(titleInput, { target: { value: '更新されたタスク' } })

    // 説明を編集
    const descriptionInput = screen.getByPlaceholderText('タスクの説明')
    fireEvent.change(descriptionInput, { target: { value: '更新された説明' } })

    // 保存
    const saveButton = screen.getByRole('button', { name: /保存/i })
    fireEvent.click(saveButton)

    expect(mockOnUpdate).toHaveBeenCalledWith('1', {
      title: '更新されたタスク',
      description: '更新された説明'
    })
  })

  it('編集をキャンセルすると元の値に戻る', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    // 編集モードに切り替え
    const editButton = screen.getByRole('button', { name: /編集/i })
    fireEvent.click(editButton)

    // タイトルを編集
    const titleInput = screen.getByPlaceholderText('タスクのタイトル')
    fireEvent.change(titleInput, { target: { value: '更新されたタスク' } })

    // キャンセル
    const cancelButton = screen.getByRole('button', { name: /キャンセル/i })
    fireEvent.click(cancelButton)

    // 元の値が表示されていることを確認
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.getByText('テストの説明')).toBeInTheDocument()
  })

  it('タスクを削除できる', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    // 削除ボタンをクリック
    const deleteButton = screen.getByRole('button', { name: /削除/i })
    fireEvent.click(deleteButton)

    // 確認ダイアログの削除ボタンをクリック
    const confirmDeleteButton = screen.getByRole('button', { name: /^削除$/i })
    fireEvent.click(confirmDeleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith('1')
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('削除をキャンセルできる', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    // 削除ボタンをクリック
    const deleteButton = screen.getByRole('button', { name: /削除/i })
    fireEvent.click(deleteButton)

    // キャンセルボタンをクリック
    const cancelButton = screen.getByRole('button', { name: /^キャンセル$/i })
    fireEvent.click(cancelButton)

    expect(mockOnDelete).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('完了状態を切り替えることができる', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox', { name: 'タスクの完了状態' })
    fireEvent.click(checkbox)

    expect(mockOnUpdate).toHaveBeenCalledWith('1', { completed: true })
  })

  it('サブタスクを追加できる', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const input = screen.getByPlaceholderText('新しいサブタスク')
    fireEvent.change(input, { target: { value: '新しいサブタスク' } })

    const addButton = screen.getByRole('button', { name: 'サブタスクを追加' })
    fireEvent.click(addButton)

    expect(mockOnUpdate).toHaveBeenCalled()
  })
})