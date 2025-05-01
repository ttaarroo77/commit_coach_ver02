import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-form';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

describe('LoginForm', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockSupabaseClient = {
    auth: {
      signInWithPassword: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      getSession: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createBrowserClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it('フォームが正しくレンダリングされること', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  it('バリデーションエラーが表示されること', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: 'ログイン' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument();
      expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument();
    });
  });

  it('無効なメールアドレスでエラーが表示されること', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    });
  });

  it('ログイン成功時にダッシュボードにリダイレクトされること', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('ログイン失敗時にエラーメッセージが表示されること', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: '認証に失敗しました' },
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('認証に失敗しました')).toBeInTheDocument();
    });
  });

  it('パスワードリセットリンクが正しく動作すること', async () => {
    mockSupabaseClient.auth.resetPasswordForEmail = jest.fn().mockResolvedValueOnce({
      data: null,
      error: null,
    });

    render(<LoginForm />);

    const resetLink = screen.getByText('パスワードを忘れた場合');
    fireEvent.click(resetLink);

    const emailInput = screen.getByLabelText('メールアドレス');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const resetButton = screen.getByRole('button', { name: 'リセットリンクを送信' });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText('パスワードリセットリンクを送信しました')).toBeInTheDocument();
    });
  });

  it('パスワードリセットのエラーハンドリングが正しく動作すること', async () => {
    mockSupabaseClient.auth.resetPasswordForEmail = jest.fn().mockResolvedValueOnce({
      data: null,
      error: { message: 'メールアドレスが見つかりません' },
    });

    render(<LoginForm />);

    const resetLink = screen.getByText('パスワードを忘れた場合');
    fireEvent.click(resetLink);

    const emailInput = screen.getByLabelText('メールアドレス');
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });

    const resetButton = screen.getByRole('button', { name: 'リセットリンクを送信' });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText('メールアドレスが見つかりません')).toBeInTheDocument();
    });
  });

  it('複数回のログイン失敗でアカウントがロックされること', async () => {
    const mockSignIn = jest.fn();
    mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'));
    mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'));
    mockSignIn.mockRejectedValueOnce(new Error('Account locked'));
    mockSupabaseClient.auth.signInWithPassword = mockSignIn;

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const loginButton = screen.getByRole('button', { name: 'ログイン' });

    // 3回連続でログイン失敗
    for (let i = 0; i < 3; i++) {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);
      await waitFor(() => {
        expect(screen.getByText(/ログインに失敗しました/)).toBeInTheDocument();
      });
    }

    // 4回目のログイン試行
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('アカウントがロックされました。しばらく時間をおいてから再度お試しください。')).toBeInTheDocument();
    });
  });
}); 