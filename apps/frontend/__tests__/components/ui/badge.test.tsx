import { render, screen, cleanup } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  afterEach(() => {
    cleanup()
  })

  it('デフォルトのバッジが正しくレンダリングされること', () => {
    render(<Badge>テスト</Badge>)
    const badge = screen.getByText('テスト')
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5', 'text-xs', 'font-semibold', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2')
  })

  it('各バリアントが正しいスタイルを持つこと', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const

    variants.forEach((variant) => {
      cleanup()
      render(<Badge variant={variant}>テスト</Badge>)
      const badge = screen.getByText('テスト')

      switch (variant) {
        case 'default':
          expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground', 'hover:bg-primary/80')
          break
        case 'secondary':
          expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80')
          break
        case 'destructive':
          expect(badge).toHaveClass('border-transparent', 'bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/80')
          break
        case 'outline':
          expect(badge).toHaveClass('text-foreground')
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