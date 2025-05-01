import { render, screen } from '@testing-library/react'
import { TaskStatus } from '@/components/projects/task-status'

describe('TaskStatus', () => {
  it('バックログのステータスが正しく表示される', () => {
    render(<TaskStatus status="backlog" />)

    const status = screen.getByText('バックログ')
    expect(status).toBeInTheDocument()
    expect(status).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('進行中のステータスが正しく表示される', () => {
    render(<TaskStatus status="in_progress" />)

    const status = screen.getByText('進行中')
    expect(status).toBeInTheDocument()
    expect(status).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('完了のステータスが正しく表示される', () => {
    render(<TaskStatus status="done" />)

    const status = screen.getByText('完了')
    expect(status).toBeInTheDocument()
    expect(status).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('追加のクラス名が適用される', () => {
    render(<TaskStatus status="backlog" className="custom-class" />)

    const status = screen.getByText('バックログ')
    expect(status).toHaveClass('custom-class')
  })
})