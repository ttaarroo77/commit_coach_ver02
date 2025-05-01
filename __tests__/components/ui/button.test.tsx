import { render, screen, cleanup } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトのボタンが正しくレンダリングされること', () => {
    render(<Button>テスト</Button>);
    const button = screen.getByText('テスト');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'whitespace-nowrap',
      'rounded-md',
      'text-sm',
      'font-medium',
      'ring-offset-background',
      'transition-colors',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50'
    );
  });

  it('各バリアントが正しいスタイルを持つこと', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;

    variants.forEach((variant) => {
      cleanup();
      render(<Button variant={variant}>テスト</Button>);
      const button = screen.getByText('テスト');

      switch (variant) {
        case 'default':
          expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'hover:bg-primary/90');
          break;
        case 'destructive':
          expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/90');
          break;
        case 'outline':
          expect(button).toHaveClass('border', 'border-input', 'bg-background', 'hover:bg-accent', 'hover:text-accent-foreground');
          break;
        case 'secondary':
          expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80');
          break;
        case 'ghost':
          expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
          break;
        case 'link':
          expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline');
          break;
      }
    });
  });

  it('各サイズが正しいスタイルを持つこと', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach((size) => {
      cleanup();
      render(<Button size={size}>テスト</Button>);
      const button = screen.getByText('テスト');

      switch (size) {
        case 'default':
          expect(button).toHaveClass('h-10', 'px-4', 'py-2');
          break;
        case 'sm':
          expect(button).toHaveClass('h-9', 'rounded-md', 'px-3');
          break;
        case 'lg':
          expect(button).toHaveClass('h-11', 'rounded-md', 'px-8');
          break;
        case 'icon':
          expect(button).toHaveClass('h-10', 'w-10');
          break;
      }
    });
  });

  it('asChildプロパティが正しく機能すること', () => {
    render(
      <Button asChild>
        <a href="#">リンク</a>
      </Button>
    );
    const link = screen.getByText('リンク');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#');
  });

  it('カスタムクラス名が適用されること', () => {
    render(<Button className="custom-class">テスト</Button>);
    const button = screen.getByText('テスト');
    expect(button).toHaveClass('custom-class');
  });
}); 