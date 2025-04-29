import { render, screen, fireEvent } from '@testing-library/react'
import { TaskDetailModal } from '@/components/projects/task-detail-modal'
import { Task } from '@/types'

describe('TaskDetailModal', () => {
  const mockTask: Task = {
    id: '1',
    title: 'テストタスク',
    description: 'テストの説明',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-05-01',
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

  it('タスクの詳細が正しく表示されること', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.getByText('テストの説明')).toBeInTheDocument()
    expect(screen.getByText('2025年5月1日')).toBeInTheDocument()
    expect(screen.getByText('テストユーザー')).toBeInTheDocument()
    expect(screen.getByText('サブタスク1')).toBeInTheDocument()
    expect(screen.getByText('サブタスク2')).toBeInTheDocument()
  })

  it('編集モードで正しく動作すること', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    // 編集モードに切り替え
    fireEvent.click(screen.getByText('編集'))

    // タイトルを編集
    const titleInput = screen.getByDisplayValue('テストタスク')
    fireEvent.change(titleInput, { target: { value: '更新されたタスク' } })

    // 説明を編集
    const descriptionInput = screen.getByDisplayValue('テストの説明')
    fireEvent.change(descriptionInput, { target: { value: '更新された説明' } })

    // 保存
    fireEvent.click(screen.getByText('保存'))

    expect(mockOnUpdate).toHaveBeenCalledWith('1', {
      ...mockTask,
      title: '更新されたタスク',
      description: '更新された説明'
    })
  })

  it('サブタスクの完了状態を切り替えられること', () => {
    render(
      <TaskDetailModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const checkbox = screen.getByRole('checkbox', { name: 'サブタスク1' })
    fireEvent.click(checkbox)

    expect(mockOnUpdate).toHaveBeenCalledWith('1', {
      subtasks: [
        { id: '1', title: 'サブタスク1', completed: true },
        { id: '2', title: 'サブタスク2', completed: true }
      ]
    })
  })
}) 