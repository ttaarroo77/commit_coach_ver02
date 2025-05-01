import { render, screen } from '@testing-library/react'
import { TaskStatus } from '@/components/projects/task-status'

describe('TaskStatus', () => {
  it('バックログステータスを正しく表示する', () => {
    render(<TaskStatus status="backlog" />)
    const status = screen.getByTestId('task-status')
    expect(status).toHaveTextContent('バックログ')
    expect(status.className).toContain('bg-gray-100')
    expect(status.className).toContain('text-gray-800')
  })

  it('進行中ステータスを正しく表示する', () => {
    render(<TaskStatus status="in_progress" />)
    const status = screen.getByTestId('task-status')
    expect(status).toHaveTextContent('進行中')
    expect(status.className).toContain('bg-blue-100')
    expect(status.className).toContain('text-blue-800')
  })

  it('完了ステータスを正しく表示する', () => {
    render(<TaskStatus status="done" />)
    const status = screen.getByTestId('task-status')
    expect(status).toHaveTextContent('完了')
    expect(status.className).toContain('bg-green-100')
    expect(status.className).toContain('text-green-800')
  })

  it('カスタムクラス名を正しく適用する', () => {
    render(<TaskStatus status="backlog" className="custom-class" />)
    const status = screen.getByTestId('task-status')
    expect(status.className).toContain('custom-class')
    expect(status.className).toContain('bg-gray-100')
  })

  it('アクセシビリティ属性が正しく設定されている', () => {
    render(<TaskStatus status="backlog" />)
    const status = screen.getByTestId('task-status')
    expect(status).toHaveAttribute('role', 'status')
    expect(status).toHaveAttribute('aria-label', 'バックログ')
  })

  it('無効なステータス値に対してデフォルトのバックログを表示する', () => {
    // @ts-expect-error 無効なステータス値をテストするため
    render(<TaskStatus status="invalid" />)
    const status = screen.getByTestId('task-status')
    expect(status).toHaveTextContent('バックログ')
    expect(status.className).toContain('bg-gray-100')
  })
})