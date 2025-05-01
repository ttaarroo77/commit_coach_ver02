'use client';

import { Task } from '@/components/dashboard/task-group';

// AIレスポンスの型定義
export interface AIResponse {
  content: string;
  suggestions?: string[];
}

// コミット提案のための型定義
export interface CommitSuggestion {
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore';
  scope?: string;
  message: string;
  description?: string;
}

/**
 * AIコーチサービス - AIとの対話を管理するサービス
 */
export class AIService {
  private static apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || '/api/ai';
  private static mockMode = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_USE_REAL_AI;

  /**
   * ユーザーのメッセージに対するAIの応答を取得する
   * @param message ユーザーのメッセージ
   * @param history 会話履歴
   * @returns AIの応答
   */
  static async getResponse(
    message: string, 
    history: { role: 'user' | 'assistant', content: string }[]
  ): Promise<AIResponse> {
    if (this.mockMode) {
      return this.getMockResponse(message);
    }

    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI API error:', error);
      return {
        content: 'すみません、エラーが発生しました。しばらくしてからもう一度お試しください。',
      };
    }
  }

  /**
   * タスクリストに基づいてコミット提案を生成する
   * @param tasks 完了したタスクのリスト
   * @returns コミット提案
   */
  static async generateCommitSuggestion(tasks: Task[]): Promise<CommitSuggestion> {
    if (this.mockMode) {
      return this.getMockCommitSuggestion(tasks);
    }

    try {
      const completedTasks = tasks.filter(task => task.status === 'completed');
      
      const response = await fetch(`${this.apiUrl}/commit-suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: completedTasks,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI API error:', error);
      return {
        type: 'chore',
        message: 'update tasks',
        description: 'タスクの更新',
      };
    }
  }

  /**
   * コードに対する分析と提案を生成する
   * @param code 分析対象のコード
   * @param language プログラミング言語
   * @returns AIの分析結果
   */
  static async analyzeCode(code: string, language: string): Promise<AIResponse> {
    if (this.mockMode) {
      return this.getMockCodeAnalysis(code, language);
    }

    try {
      const response = await fetch(`${this.apiUrl}/code-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI API error:', error);
      return {
        content: 'コード分析中にエラーが発生しました。',
      };
    }
  }

  /**
   * モックレスポンスを生成する（開発用）
   * @param message ユーザーのメッセージ
   * @returns モックAIレスポンス
   */
  private static getMockResponse(message: string): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase();
    let response: AIResponse;

    if (lowerMessage.includes('コミット') || lowerMessage.includes('commit')) {
      response = {
        content: 'コミットメッセージの作成をお手伝いしましょう。最近完了したタスクに基づいて、以下のようなコミットメッセージはいかがでしょうか？',
        suggestions: [
          'feat(frontend): add drag and drop functionality for tasks',
          'fix(ui): resolve hydration error in dashboard component',
          'refactor(tasks): improve task filtering performance'
        ]
      };
    } else if (lowerMessage.includes('タスク') || lowerMessage.includes('task')) {
      response = {
        content: '現在のタスク状況を分析しました。優先度の高いタスクから取り組むことをお勧めします。また、「ドラッグ＆ドロップ機能の実装」は他のタスクの依存関係になっているため、先に完了させると良いでしょう。',
      };
    } else if (lowerMessage.includes('ヘルプ') || lowerMessage.includes('help')) {
      response = {
        content: '私はあなたのコーディング作業をサポートするAIコーチです。以下のことができます：\n\n1. タスク管理のアドバイス\n2. コミットメッセージの提案\n3. コードレビューと改善提案\n4. 技術的な質問への回答\n\n何かお手伝いできることはありますか？',
      };
    } else {
      response = {
        content: 'お手伝いできることがあれば、お気軽にお知らせください。タスク管理やコミットメッセージの提案、コードレビューなどのサポートが可能です。',
      };
    }

    // 非同期処理をシミュレート
    return new Promise(resolve => {
      setTimeout(() => resolve(response), 1000);
    });
  }

  /**
   * モックコミット提案を生成する（開発用）
   * @param tasks タスクリスト
   * @returns モックコミット提案
   */
  private static getMockCommitSuggestion(tasks: Task[]): Promise<CommitSuggestion> {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    let suggestion: CommitSuggestion;

    if (completedTasks.some(task => task.title.toLowerCase().includes('drag') || task.title.toLowerCase().includes('ドラッグ'))) {
      suggestion = {
        type: 'feat',
        scope: 'frontend',
        message: 'implement drag and drop for tasks',
        description: 'タスクのドラッグ＆ドロップ機能を実装し、タスクの並べ替えとグループ間移動を可能にしました。',
      };
    } else if (completedTasks.some(task => task.title.toLowerCase().includes('fix') || task.title.toLowerCase().includes('修正'))) {
      suggestion = {
        type: 'fix',
        scope: 'ui',
        message: 'resolve UI issues in dashboard',
        description: 'ダッシュボードのUI問題を修正し、レスポンシブデザインを改善しました。',
      };
    } else {
      suggestion = {
        type: 'chore',
        scope: 'tasks',
        message: 'update task management features',
        description: 'タスク管理機能を更新し、ユーザーエクスペリエンスを向上させました。',
      };
    }

    // 非同期処理をシミュレート
    return new Promise(resolve => {
      setTimeout(() => resolve(suggestion), 800);
    });
  }

  /**
   * モックコード分析を生成する（開発用）
   * @param code コード
   * @param language 言語
   * @returns モックコード分析
   */
  private static getMockCodeAnalysis(code: string, language: string): Promise<AIResponse> {
    const response: AIResponse = {
      content: `${language}コードを分析しました。以下のような改善点が考えられます：\n\n1. パフォーマンス: メモ化を活用して不要な再計算を防ぐ\n2. 可読性: 長い関数を小さな関数に分割する\n3. 保守性: 共通ロジックを抽出してユーティリティ関数化する`,
    };

    // 非同期処理をシミュレート
    return new Promise(resolve => {
      setTimeout(() => resolve(response), 1200);
    });
  }
}
