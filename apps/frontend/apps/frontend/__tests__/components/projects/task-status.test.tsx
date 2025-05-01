import { render, screen } from '@testing-library/react'
import { TaskStatus } from '@/components/projects/task-status'

describe('TaskStatus', () => {
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