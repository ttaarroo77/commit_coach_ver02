import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AICoach } from '../../../components/dashboard/ai-coach';

// AIサービスのモック
jest.mock('../../../lib/ai-service', () => ({
  getAIResponse: jest.fn().mockResolvedValue({
    message: 'これはAIからの応答です。',
    timestamp: '2025-04-29T10:00:00Z'
  })
}));

describe('AICoachコンポーネント', () => {
  beforeEach(() => {
    // ローカルストレージのモック
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // localStorageのgetItemをモック
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'ai_chat_history') {
        return JSON.stringify([
          {
            role: 'system',
            content: 'こんにちは、AIコーチです。',
            timestamp: '2025-04-29T09:50:00Z'
          },
          {
            role: 'user',
            content: 'タスク管理について教えてください。',
            timestamp: '2025-04-29T09:55:00Z'
          },
          {
            role: 'assistant',
            content: 'タスク管理は優先順位付けが重要です。',
            timestamp: '2025-04-29T09:56:00Z'
          }
        ]);
      }
      return null;
    });
  });

  test('コンポーネントが正しくレンダリングされる', () => {
    render(<AICoach />);

    // ヘッダーが表示される
    expect(screen.getByText('AIコーチ')).toBeInTheDocument();

    // 入力フォームが表示される
    expect(screen.getByPlaceholderText('AIコーチに質問する...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
  });

  test('チャット履歴が表示される', () => {
    render(<AICoach />);

    // 初期チャット履歴の内容が表示される
    expect(screen.getByText('こんにちは、AIコーチです。')).toBeInTheDocument();
    expect(screen.getByText('タスク管理について教えてください。')).toBeInTheDocument();
    expect(screen.getByText('タスク管理は優先順位付けが重要です。')).toBeInTheDocument();
  });

  test('新しいメッセージを送信できる', async () => {
    const { getAIResponse } = require('../../../lib/ai-service');

    render(<AICoach />);

    // メッセージを入力
    const input = screen.getByPlaceholderText('AIコーチに質問する...');
    fireEvent.change(input, { target: { value: '新しい質問です' } });

    // 送信ボタンをクリック
    const submitButton = screen.getByRole('button', { name: '送信' });
    fireEvent.click(submitButton);

    // ユーザーのメッセージが表示される
    expect(screen.getByText('新しい質問です')).toBeInTheDocument();

    // AIからの応答を待機
    await waitFor(() => {
      expect(getAIResponse).toHaveBeenCalledWith('新しい質問です');
      expect(screen.getByText('これはAIからの応答です。')).toBeInTheDocument();
    });

    // 入力フィールドがクリアされる
    expect(input).toHaveValue('');
  });

  test('入力が空の場合は送信できない', () => {
    const { getAIResponse } = require('../../../lib/ai-service');

    render(<AICoach />);

    // 送信ボタンをクリック（入力なし）
    const submitButton = screen.getByRole('button', { name: '送信' });
    fireEvent.click(submitButton);

    // AIサービスが呼ばれない
    expect(getAIResponse).not.toHaveBeenCalled();
  });
}); 