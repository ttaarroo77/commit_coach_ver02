import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../components/login-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Supabaseのモック
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  it('フォームのレンダリング', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByText('ログイン')).toBeInTheDocument();
  });

  it('バリデーションエラーの表示', async () => {
    render(<LoginForm />);

    // フォームを送信
    fireEvent.click(screen.getByText('ログイン'));

    // エラーメッセージの表示を確認
    await waitFor(() => {
      expect(screen.getByText('メールアドレスは必須です')).toBeInTheDocument();
      expect(screen.getByText('パスワードは8文字以上必要です')).toBeInTheDocument();
    });
  });

  it('ログイン成功時の処理', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ error: null });
    (createClientComponentClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    });

    render(<LoginForm />);

    // フォームに入力
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password123' },
    });

    // フォームを送信
    fireEvent.click(screen.getByText('ログイン'));

    // ログイン成功時の表示を確認
    await waitFor(() => {
      expect(screen.getByText('ログイン成功')).toBeInTheDocument();
    });
  });

  it('ログイン失敗時のエラー表示', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({
      error: new Error('Invalid credentials'),
    });
    (createClientComponentClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    });

    render(<LoginForm />);

    // フォームに入力
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password123' },
    });

    // フォームを送信
    fireEvent.click(screen.getByText('ログイン'));

    // エラーメッセージの表示を確認
    await waitFor(() => {
      expect(screen.getByText('メールアドレスまたはパスワードが正しくありません')).toBeInTheDocument();
    });
  });
}); 