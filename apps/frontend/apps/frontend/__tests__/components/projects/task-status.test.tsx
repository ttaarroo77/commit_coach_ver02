import { render, screen, fireEvent } from '@testing-library/react'
import { TaskStatus } from '@/components/projects/task-status'
import { addDays, subDays } from 'date-fns'

describe('TaskStatus', () => {
  const mockOnUpdateDueDate = jest.fn()
  const mockOnUpdateStatus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('期限が設定されていない場合、デフォルトのテキストを表示する', () => {
    render(
      <TaskStatus
        dueDate={null}
        completed={false}
        onUpdateDueDate={mockOnUpdateDueDate}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    expect(screen.getByText('期限を設定')).toBeInTheDocument()
    expect(screen.getByText('未設定')).toBeInTheDocument()
  })

  it('期限が設定されている場合、正しくフォーマットされた日付を表示する', () => {
    const date = new Date('2024-03-20').toISOString()
    render(
      <TaskStatus
        dueDate={date}
        completed={false}
        onUpdateDueDate={mockOnUpdateDueDate}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    expect(screen.getByText('2024年3月20日')).toBeInTheDocument()
  })

  it('完了状態を切り替えることができる', () => {
    render(
      <TaskStatus
        dueDate={null}
        completed={false}
        onUpdateDueDate={mockOnUpdateDueDate}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /完了状態を切り替え/i }))
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(true)
  })

  it('期限切れのタスクに対して適切なステータスを表示する', () => {
    const overdueDueDate = subDays(new Date(), 1).toISOString()
    render(
      <TaskStatus
        dueDate={overdueDueDate}
        completed={false}
        onUpdateDueDate={mockOnUpdateDueDate}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    expect(screen.getByText('期限超過')).toBeInTheDocument()
  })

  it('期限が近いタスクに対して適切なステータスを表示する', () => {
    const dueSoonDate = new Date().toISOString()
    render(
      <TaskStatus
        dueDate={dueSoonDate}
        completed={false}
        onUpdateDueDate={mockOnUpdateDueDate}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    expect(screen.getByText('期限間近')).toBeInTheDocument()
  })

  it('完了したタスクに対して適切なステータスを表示する', () => {
    render(
      <TaskStatus
        dueDate={new Date().toISOString()}
        completed={true}
        onUpdateDueDate={mockOnUpdateDueDate}
        onUpdateStatus={mockOnUpdateStatus}
      />
    )

    expect(screen.getByText('完了')).toBeInTheDocument()
  })

  it('バックログのステータスが正しく表示される', () => {
    render(<TaskStatus status="backlog" />)
    expect(screen.getByText('バックログ')).toBeInTheDocument()
    expect(screen.getByTestId('task-status')).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('進行中のステータスが正しく表示される', () => {
    render(<TaskStatus status="in_progress" />)
    expect(screen.getByText('進行中')).toBeInTheDocument()
    expect(screen.getByTestId('task-status')).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('完了のステータスが正しく表示される', () => {
    render(<TaskStatus status="done" />)
    expect(screen.getByText('完了')).toBeInTheDocument()
    expect(screen.getByTestId('task-status')).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('追加のクラス名が適用される', () => {
    const customClass = 'custom-class'
    render(<TaskStatus status="backlog" className={customClass} />)
    expect(screen.getByTestId('task-status')).toHaveClass(customClass)
  })

  it('アクセシビリティ属性が正しく設定される', () => {
    render(<TaskStatus status="backlog" />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-label', 'バックログ')
  })
})