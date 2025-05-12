import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import '@testing-library/jest-dom';

describe('Card UIコンポーネント', () => {
  it('Cardが正しくレンダリングされる', () => {
    render(<Card>テストカード</Card>);
    expect(screen.getByText('テストカード')).toBeInTheDocument();
  });

  it('CardHeader/CardTitle/CardContent/CardFooterが正しくレンダリングされる', () => {
    render(
      <Card>
        <CardHeader>ヘッダー</CardHeader>
        <CardTitle>タイトル</CardTitle>
        <CardContent>内容</CardContent>
        <CardFooter>フッター</CardFooter>
      </Card>
    );
    expect(screen.getByText('ヘッダー')).toBeInTheDocument();
    expect(screen.getByText('タイトル')).toBeInTheDocument();
    expect(screen.getByText('内容')).toBeInTheDocument();
    expect(screen.getByText('フッター')).toBeInTheDocument();
  });

  it('カスタムクラス名が適用される', () => {
    render(<Card className="custom-class">カスタム</Card>);
    expect(screen.getByText('カスタム')).toHaveClass('custom-class');
  });
}); 