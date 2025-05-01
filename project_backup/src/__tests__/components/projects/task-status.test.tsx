import { render, screen, fireEvent } from '@testing-library/react'
import { TaskStatus } from '../../../components/projects/task-status'

describe('TaskStatus', () => {
  const mockOnUpdateStatus = jest.fn()

  it('完了状態を切り替えることができる', () => {
    render(
      <TaskStatus
        completed={false}
        dueDate={new Date('2025-04-30')}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'タスクの完了状態' }))
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(true)
  })

  it('期限が近いタスクに対して適切なステータスを表示する', () => {
    const nearFutureDate = new Date()
    nearFutureDate.setDate(nearFutureDate.getDate() + 2)

    render(
      <TaskStatus
        completed={false}
        dueDate={nearFutureDate}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    expect(screen.getByText(/期限間近/)).toBeInTheDocument()
  })

  it('完了したタスクに対して適切なステータスを表示する', () => {
    render(
      <TaskStatus
        completed={true}
        dueDate={new Date('2025-04-30')}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    expect(screen.getByText('完了')).toBeInTheDocument()
  })
}) 