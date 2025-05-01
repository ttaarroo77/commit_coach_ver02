import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'

// モックの設定
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

describe('Sidebar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard')
  })

  it('正しくレンダリングされること', () => {
    render(<Sidebar />)

    // タイトルの確認
    expect(screen.getByText('Commit Coach')).toBeInTheDocument()

    // メニュー項目の確認
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    expect(screen.getByText('プロジェクト')).toBeInTheDocument()
    expect(screen.getByText('カレンダー')).toBeInTheDocument()
    expect(screen.getByText('タイムトラッキング')).toBeInTheDocument()
    expect(screen.getByText('レポート')).toBeInTheDocument()
  })

  it('現在のパスに対応するメニュー項目がアクティブになること', () => {
    render(<Sidebar />)

    const dashboardLink = screen.getByText('ダッシュボード').closest('a')
    expect(dashboardLink).toHaveClass('bg-accent')
  })

  it('モバイルでメニューボタンをクリックするとサイドバーが表示されること', () => {
    render(<Sidebar />)

    // メニューボタンをクリック
    const menuButton = screen.getByRole('button', { name: 'メニュー' })
    fireEvent.click(menuButton)

    // サイドバーが表示されることを確認
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('translate-x-0')
  })

  it('モバイルでオーバーレイをクリックするとサイドバーが閉じること', () => {
    render(<Sidebar />)

    // メニューボタンをクリック
    const menuButton = screen.getByRole('button', { name: 'メニュー' })
    fireEvent.click(menuButton)

    // オーバーレイをクリック
    const overlay = screen.getByTestId('sidebar-overlay')
    fireEvent.click(overlay)

    // サイドバーが非表示になることを確認
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('-translate-x-full')
  })

  it('デスクトップでは常にサイドバーが表示されること', () => {
    // ビューポートをデスクトップサイズに設定
    global.innerWidth = 1024
    global.dispatchEvent(new Event('resize'))

    render(<Sidebar />)

    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('lg:translate-x-0')
  })

  it('ナビゲーションリンクが正しく表示されること', () => {
    render(<Sidebar />)

    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    expect(screen.getByText('プロジェクト')).toBeInTheDocument()
    expect(screen.getByText('カレンダー')).toBeInTheDocument()
    expect(screen.getByText('タイムトラッキング')).toBeInTheDocument()
    expect(screen.getByText('レポート')).toBeInTheDocument()
    expect(screen.getByText('設定')).toBeInTheDocument()
  })
}) 