import { render, screen } from '@testing-library/react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

describe('DashboardHeader', () => {
  // 日時をモック（テストの一貫性のため）
  const mockDate = new Date('2025-04-24T12:30:00')

  it('renders dashboard title correctly', () => {
    render(<DashboardHeader currentTime={mockDate} />)
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
  })

  it('displays formatted date correctly', () => {
    render(<DashboardHeader currentTime={mockDate} />)
    // 日本語ロケールでフォーマットされた日付 (2025年4月24日木曜日) が表示されること
    expect(screen.getByText(/2025年4月24日/)).toBeInTheDocument()
  })

  it('displays formatted time correctly', () => {
    render(<DashboardHeader currentTime={mockDate} />)
    // 12:30 のような時刻が表示されること
    expect(screen.getByText('12:30')).toBeInTheDocument()
  })

  it('renders the clock icon', () => {
    render(<DashboardHeader currentTime={mockDate} />)
    // 「現在時刻」ラベルが表示されること
    expect(screen.getByText('現在時刻')).toBeInTheDocument()
    // Clock アイコンのコンテナが存在すること
    const clockIcon = document.querySelector('.rounded-full.bg-\\[\\#31A9B8\\]')
    expect(clockIcon).toBeInTheDocument()
  })
})
