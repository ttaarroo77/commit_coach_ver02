import { render, screen, cleanup } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  afterEach(() => {
    cleanup()
  })

  it('デフォルトのバッジが正しくレンダリングされること', () => {
    render(<Badge>テスト</Badge>)
    const badge = screen.getByText('テスト')
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5', 'text-xs', 'font-semibold')
  })

  it('各バリアントが正しいスタイルを持つこと', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'] as const

    variants.forEach((variant) => {
      cleanup()
      render(<Badge variant={variant}>テスト</Badge>)
      const badge = screen.getByText('テスト')

      switch (variant) {
        case 'default':
          expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
          break
        case 'secondary':
          expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')
          break
        case 'destructive':
          expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground')
          break
        case 'outline':
          expect(badge).toHaveClass('text-foreground')
          break
        case 'success':
          expect(badge).toHaveClass('bg-emerald-500/15', 'text-emerald-700')
          break
        case 'warning':
          expect(badge).toHaveClass('bg-yellow-500/15', 'text-yellow-700')
          break
      }
    })
  })

  it('各サイズが正しいスタイルを持つこと', () => {
    const sizes = ['sm', 'default', 'lg'] as const

    sizes.forEach((size) => {
      cleanup()
      render(<Badge size={size}>テスト</Badge>)
      const badge = screen.getByText('テスト')

      switch (size) {
        case 'sm':
          expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs')
          break
        case 'default':
          expect(badge).toHaveClass('px-2.5', 'py-0.5', 'text-xs')
          break
        case 'lg':
          expect(badge).toHaveClass('px-3', 'py-1', 'text-sm')
          break
      }
    })
  })

  it('カスタムクラス名が適用されること', () => {
    render(<Badge className="custom-class">テスト</Badge>)
    const badge = screen.getByText('テスト')
    expect(badge).toHaveClass('custom-class')
  })
})