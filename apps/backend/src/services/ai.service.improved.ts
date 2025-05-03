import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { AIConfig, AIMessage, TaskBreakdown, SubTask } from '../types/ai.types';
import { Task } from '../types/task.types';
import { Project } from '../types/project.types';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// 環境変数の存在確認
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 環境変数チェック
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  logger.error('Supabase環境変数が設定されていません');
}

if (!OPENAI_API_KEY) {
  logger.warn('OpenAI APIキーが設定されていません。AIサービスは制限付きで動作します。');
}

// Supabaseクライアントの初期化
const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || ''
);

// OpenAIクライアントの初期化（APIキーがある場合のみ）
const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
      maxRetries: 3,
      timeout: 30000,
    })
  : null;

// ユーティリティ関数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class AIService {
  /**
   * ユーザーのAI設定を取得する
   */
  async getUserConfig(userId: string): Promise<AIConfig> {
    try {
      const { data, error } = await supabase
        .from('ai_configs')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error) {
        logger.info(`ユーザー${userId}のAI設定が見つからないため、デフォルト設定を使用します`);
        // デフォルト設定を返す
        return {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 1000,
        };
      }

      return data;
    } catch (error) {
      logger.error('AI設定の取得中にエラーが発生しました', { error, userId });
      throw new ApiError(500, 'AI設定の取得に失敗しました');
    }
  }

  /**
   * ユーザーのAI設定を保存する
   */
  async saveUserConfig(userId: string, config: AIConfig): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_configs')
        .upsert({ userId, ...config });

      if (error) {
        logger.error('AI設定の保存中にエラーが発生しました', { error, userId });
        throw new ApiError(500, 'AI設定の保存に失敗しました');
      }
    } catch (error) {
      logger.error('AI設定の保存中にエラーが発生しました', { error, userId });
      throw new ApiError(500, 'AI設定の保存に失敗しました');
    }
  }

  /**
   * AIメッセージを保存する
   */
  async saveMessage(userId: string, message: AIMessage): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_messages')
        .insert({ userId, ...message });

      if (error) {
        logger.error('AIメッセージの保存中にエラーが発生しました', { error, userId });
        throw new ApiError(500, 'AIメッセージの保存に失敗しました');
      }
    } catch (error) {
      logger.error('AIメッセージの保存中にエラーが発生しました', { error, userId });
      throw new ApiError(500, 'AIメッセージの保存に失敗しました');
    }
  }

  /**
   * ユーザーのAIメッセージ履歴を取得する
   */
  async getMessages(userId: string, limit = 10): Promise<AIMessage[]> {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('userId', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('AIメッセージの取得中にエラーが発生しました', { error, userId });
        throw new ApiError(500, 'AIメッセージの取得に失敗しました');
      }

      return data || [];
    } catch (error) {
      logger.error('AIメッセージの取得中にエラーが発生しました', { error, userId });
      throw new ApiError(500, 'AIメッセージの取得に失敗しました');
    }
  }

  /**
   * タスクを分解する
   */
  async breakDownTask(task: Task): Promise<TaskBreakdown> {
    // OpenAI APIキーがない場合はモックデータを返す
    if (!openai) {
      return this.getMockTaskBreakdown(task);
    }

    const maxRetries = 3;
    let lastError: Error | undefined = undefined;

    // タスクIDの確認
    const taskId = task.id || 'unknown';

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'あなたはタスクを効率的に分解するAIアシスタントです。タスクを小さなサブタスクに分解し、各サブタスクの見積もり時間と優先度を設定してください。',
            },
            {
              role: 'user',
              content: `以下のタスクを分解してください：\nタイトル: ${task.title}\n説明: ${task.description || '説明なし'}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('AIからの応答が空です');
        }

        const breakdown = this.parseBreakdown(content);
        return {
          taskId,
          breakdown,
        };
      } catch (error: unknown) {
        // エラーをError型として扱う
        lastError = error instanceof Error ? error : new Error(String(error));

        // OpenAI APIエラーの場合の特別処理
        if (
          lastError.message.includes('rate limit') ||
          lastError.message.includes('timeout')
        ) {
          // 指数バックオフでリトライ
          const waitTime = Math.pow(2, i) * 1000;
          logger.warn(`OpenAI APIエラー、${waitTime}ms後にリトライします`, {
            error: lastError,
            retry: i + 1,
            maxRetries,
          });
          await delay(waitTime);
          continue;
        }

        logger.error('タスク分解中にエラーが発生しました', { error: lastError, taskId });
        break;
      }
    }

    // すべてのリトライが失敗した場合
    logger.error('タスク分解の最大リトライ回数に達しました', { taskId, error: lastError });
    
    // フォールバック: モックデータを返す
    return this.getMockTaskBreakdown(task);
  }

  /**
   * プロジェクト分析を行う
   */
  async analyzeProject(project: Project): Promise<string> {
    // OpenAI APIキーがない場合はモックデータを返す
    if (!openai) {
      return this.getMockProjectAnalysis(project);
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'あなたはプロジェクト分析を行うAIアシスタントです。プロジェクトの状況を分析し、改善点や次のステップを提案してください。',
          },
          {
            role: 'user',
            content: `以下のプロジェクトを分析してください：\nタイトル: ${project.title}\n説明: ${project.description || '説明なし'}\n進捗状況: ${project.status || '不明'}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('AIからの応答が空です');
      }

      return content;
    } catch (error) {
      logger.error('プロジェクト分析中にエラーが発生しました', {
        error,
        projectId: project.id,
      });
      
      // フォールバック: モックデータを返す
      return this.getMockProjectAnalysis(project);
    }
  }

  /**
   * コミット提案を生成する
   */
  async suggestCommits(taskId: string, description: string): Promise<string[]> {
    // OpenAI APIキーがない場合はモックデータを返す
    if (!openai) {
      return [
        'feat: タスク管理機能の実装',
        'fix: バグ修正',
        'docs: ドキュメント更新',
      ];
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'あなたはConventional Commitsに従ったコミットメッセージを提案するAIアシスタントです。タスクの説明から適切なコミットメッセージを3つ提案してください。',
          },
          {
            role: 'user',
            content: `以下のタスクに関するコミットメッセージを提案してください：\n${description}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('AIからの応答が空です');
      }

      // 応答からコミットメッセージを抽出
      const commits = content
        .split('\n')
        .filter((line) => line.trim().startsWith('- ') || line.trim().match(/^\d+\./))
        .map((line) => line.replace(/^- |\d+\.\s*/, '').trim())
        .filter((line) => line.length > 0);

      return commits.length > 0
        ? commits
        : [
            'feat: タスク管理機能の実装',
            'fix: バグ修正',
            'docs: ドキュメント更新',
          ];
    } catch (error) {
      logger.error('コミット提案中にエラーが発生しました', { error, taskId });
      
      // フォールバック: モックデータを返す
      return [
        'feat: タスク管理機能の実装',
        'fix: バグ修正',
        'docs: ドキュメント更新',
      ];
    }
  }

  /**
   * AIの応答からタスク分解を解析する
   */
  private parseBreakdown(content: string): SubTask[] {
    try {
      // 正規表現を使用してサブタスクを抽出
      const subtasks: SubTask[] = [];
      const lines = content.split('\n');

      let currentSubtask: Partial<SubTask> | null = null;

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // サブタスクのタイトル行を検出
        const titleMatch = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
        if (titleMatch) {
          // 前のサブタスクがあれば保存
          if (currentSubtask && currentSubtask.title) {
            subtasks.push(currentSubtask as SubTask);
          }
          
          // 新しいサブタスクを開始
          currentSubtask = {
            title: titleMatch[2],
            description: '',
            estimatedHours: 1, // デフォルト値
            priority: 'medium', // デフォルト値
          };
          continue;
        }

        // 現在のサブタスクがない場合はスキップ
        if (!currentSubtask) continue;

        // 見積もり時間を検出
        const estimateMatch = trimmedLine.match(/見積もり時間:?\s*(\d+(?:\.\d+)?)\s*時間/);
        if (estimateMatch) {
          currentSubtask.estimatedHours = parseFloat(estimateMatch[1]);
          continue;
        }

        // 優先度を検出
        const priorityMatch = trimmedLine.match(/優先度:?\s*(高|中|低)/);
        if (priorityMatch) {
          const priority = priorityMatch[1];
          currentSubtask.priority = 
            priority === '高' ? 'high' :
            priority === '低' ? 'low' : 'medium';
          continue;
        }

        // それ以外の行は説明として追加
        if (trimmedLine && !trimmedLine.startsWith('-') && currentSubtask.description !== undefined) {
          currentSubtask.description += (currentSubtask.description ? '\n' : '') + trimmedLine;
        }
      }

      // 最後のサブタスクを追加
      if (currentSubtask && currentSubtask.title) {
        subtasks.push(currentSubtask as SubTask);
      }

      // サブタスクが見つからない場合はデフォルトのサブタスクを返す
      if (subtasks.length === 0) {
        return [
          {
            title: '分析',
            description: 'タスクの要件を分析する',
            estimatedHours: 1,
            priority: 'high',
          },
          {
            title: '実装',
            description: 'コードを実装する',
            estimatedHours: 2,
            priority: 'medium',
          },
          {
            title: 'テスト',
            description: 'テストを作成して実行する',
            estimatedHours: 1,
            priority: 'medium',
          },
          {
            title: 'ドキュメント',
            description: 'ドキュメントを更新する',
            estimatedHours: 0.5,
            priority: 'low',
          },
        ];
      }

      return subtasks;
    } catch (error) {
      logger.error('タスク分解の解析中にエラーが発生しました', { error, content });
      
      // エラー時はデフォルトのサブタスクを返す
      return [
        {
          title: '分析',
          description: 'タスクの要件を分析する',
          estimatedHours: 1,
          priority: 'high',
        },
        {
          title: '実装',
          description: 'コードを実装する',
          estimatedHours: 2,
          priority: 'medium',
        },
        {
          title: 'テスト',
          description: 'テストを作成して実行する',
          estimatedHours: 1,
          priority: 'medium',
        },
        {
          title: 'ドキュメント',
          description: 'ドキュメントを更新する',
          estimatedHours: 0.5,
          priority: 'low',
        },
      ];
    }
  }

  /**
   * モックのタスク分解を取得する（APIキーがない場合のフォールバック）
   */
  private getMockTaskBreakdown(task: Task): TaskBreakdown {
    logger.info('モックのタスク分解を使用します', { taskId: task.id });
    
    return {
      taskId: task.id || 'unknown',
      breakdown: [
        {
          title: '要件分析',
          description: `「${task.title}」の要件を詳細に分析し、必要な機能を洗い出す`,
          estimatedHours: 1,
          priority: 'high',
        },
        {
          title: '設計',
          description: 'コンポーネント設計とデータフロー設計を行う',
          estimatedHours: 1.5,
          priority: 'high',
        },
        {
          title: '実装',
          description: '機能を実装する',
          estimatedHours: 3,
          priority: 'medium',
        },
        {
          title: 'テスト',
          description: 'ユニットテストと統合テストを作成して実行する',
          estimatedHours: 2,
          priority: 'medium',
        },
        {
          title: 'ドキュメント',
          description: '実装した機能のドキュメントを作成する',
          estimatedHours: 1,
          priority: 'low',
        },
      ],
    };
  }

  /**
   * モックのプロジェクト分析を取得する（APIキーがない場合のフォールバック）
   */
  private getMockProjectAnalysis(project: Project): string {
    logger.info('モックのプロジェクト分析を使用します', { projectId: project.id });
    
    return `
# ${project.title} プロジェクト分析

## 現状
- プロジェクトは${project.status || '進行中'}の状態です
- 現在のタスク完了率は約60%と推定されます

## 強み
- プロジェクト構造が明確に定義されています
- タスクの優先順位付けが適切に行われています

## 改善点
- テストカバレッジを向上させる必要があります
- ドキュメントの更新が遅れています

## 次のステップ
1. 残りのタスクの優先順位を再確認する
2. テスト自動化を強化する
3. ドキュメントを最新の状態に更新する
4. パフォーマンス最適化を行う

## リスク
- スケジュールの遅延リスクがあります
- 技術的負債の蓄積に注意が必要です

このプロジェクトは全体的に良好に進行していますが、上記の改善点に取り組むことで、より効率的に完了させることができるでしょう。
    `;
  }
}
