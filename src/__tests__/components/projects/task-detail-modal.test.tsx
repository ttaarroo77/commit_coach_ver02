import { render, screen, fireEvent } from '@testing-library/react'
import { TaskDetailModal } from '../../../components/projects/task-detail-modal'

describe('TaskDetailModal', () => {
  const mockOnClose = jest.fn()
  const mockOnUpdate = jest.fn()
  const mockOnDelete = jest.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onUpdate: mockOnUpdate,
    onDelete: mockOnDelete,
    task: {
      id: '1',
      title: 'テストタスク',
      description: 'タスクの説明',
      completed: false,
      dueDate: new Date('2025-04-30'),
      priority: 'medium',
      projectId: '1'
    }
  }

  it('タスクの詳細を表示する', () => {
    render(<TaskDetailModal {...defaultProps} />)

    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(screen.getByText('タスクの説明')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'タスク完了' })).not.toBeChecked()
  })

  it('タスクの完了状態を切り替えることができる', () => {
    render(<TaskDetailModal {...defaultProps} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'タスク完了' }))
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...defaultProps.task,
      completed: true
    })
  })

  it('タスクを削除することができる', () => {
    render(<TaskDetailModal {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'タスクを削除' }))
    expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.task.id)
  })

  it('モーダルを閉じることができる', () => {
    render(<TaskDetailModal {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'モーダルを閉じる' }))
    expect(mockOnClose).toHaveBeenCalled()
  })
}) 