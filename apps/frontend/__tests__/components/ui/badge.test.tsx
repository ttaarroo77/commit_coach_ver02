import { render, screen, cleanup } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  afterEach(() => {
    cleanup()
  })

  it('デフォルトのバッジが正しくレンダリングされること', () => {
    render(<Badge>テストバッジ</Badge>)

    const badge = screen.getByText('テストバッジ')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('各バリアントが正しいスタイルを持つこと', () => {
    const variants = [
      'secondary',
      'destructive',
      'outline',
      'success',
      'warning',
      'info',
      'muted'
    ]

    variants.forEach(variant => {
      render(<Badge variant={variant as any}>テストバッジ</Badge>)
      const badge = screen.getByText('テストバッジ')

      switch (variant) {
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
          expect(badge).toHaveClass('bg-amber-500/15', 'text-amber-700')
          break
        case 'info':
          expect(badge).toHaveClass('bg-sky-500/15', 'text-sky-700')
          break
        case 'muted':
          expect(badge).toHaveClass('bg-muted', 'text-muted-foreground')
          break
      }
      cleanup()
    })
  })

  it('各サイズが正しいスタイルを持つこと', () => {
    const sizes = ['default', 'sm', 'lg']

    sizes.forEach(size => {
      render(<Badge size={size as any}>テストバッジ {size}</Badge>)
      const badge = screen.getByText(`テストバッジ ${size}`)

      switch (size) {
        case 'default':
          expect(badge).toHaveClass('px-2.5', 'py-0.5', 'text-xs')
          break
        case 'sm':
          expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs')
          break
        case 'lg':
          expect(badge).toHaveClass('px-3', 'py-1', 'text-sm')
          break
      }
      cleanup()
    })
  })

  it('カスタムクラス名が適用されること', () => {
    render(<Badge className="custom-class">テストバッジ</Badge>)

    const badge = screen.getByText('テストバッジ')
    expect(badge).toHaveClass('custom-class')
  })
})