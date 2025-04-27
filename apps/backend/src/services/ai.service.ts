import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { AIConfig, AIMessage, TaskBreakdown } from '../types/ai.types';
import { Task } from '../types/task.types';
import { ApiError } from '../middleware/errorHandler';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000,
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AIService {
  async getUserConfig(userId: string): Promise<AIConfig> {
    const { data, error } = await supabase
      .from('ai_configs')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      // デフォルト設定を返す
      return {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
      };
    }

    return data;
  }

  async saveUserConfig(userId: string, config: AIConfig) {
    const { error } = await supabase
      .from('ai_configs')
      .upsert({ userId, ...config });

    if (error) throw error;
  }

  async saveMessage(userId: string, message: AIMessage) {
    const { error } = await supabase
      .from('ai_messages')
      .insert({ userId, ...message });

    if (error) throw error;
  }

  async getMessages(userId: string, limit = 10): Promise<AIMessage[]> {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async breakDownTask(task: Task): Promise<TaskBreakdown> {
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
              content: 'あなたはタスクを効率的に分解するAIアシスタントです。タスクを小さなサブタスクに分解し、各サブタスクの見積もり時間と優先度を設定してください。'
            },
            {
              role: 'user',
              content: `以下のタスクを分解してください：\nタイトル: ${task.title}\n説明: ${task.description || '説明なし'}`
            }
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
        if (error instanceof OpenAI.APIError) {
          if ('status' in error && error.status === 429) {
            // レート制限エラーの場合、指数バックオフで待機
            await delay(Math.pow(2, i) * 1000);
            continue;
          }
        }

        // リトライ可能なエラーの場合のみリトライ
        if (i < maxRetries - 1) {
          await delay(1000);
          continue;
        }
      }
    }

    throw new ApiError(500, 'タスクの分解に失敗しました', lastError);
  }

  private parseBreakdown(content: string) {
    // ここでAIの応答をパースして、タスク分解の配列を返す
    // 実際の実装では、より堅牢なパースロジックが必要
    const lines = content.split('\n');
    const breakdown = [];
    let currentTask = null;

    for (const line of lines) {
      if (line.match(/^\d+\./)) {
        if (currentTask) {
          breakdown.push(currentTask);
        }
        currentTask = {
          title: line.replace(/^\d+\.\s*/, ''),
          description: '',
          estimatedTime: 0,
          priority: 'medium',
        };
      } else if (currentTask) {
        if (line.includes('説明:')) {
          currentTask.description = line.replace('説明:', '').trim();
        } else if (line.includes('時間:')) {
          const time = parseInt(line.replace('時間:', '').trim());
          currentTask.estimatedTime = isNaN(time) ? 0 : time;
        } else if (line.includes('優先度:')) {
          const priority = line.replace('優先度:', '').trim().toLowerCase();
          if (['low', 'medium', 'high'].includes(priority)) {
            currentTask.priority = priority as 'low' | 'medium' | 'high';
          }
        }
      }
    }

    if (currentTask) {
      breakdown.push(currentTask);
    }

    return breakdown;
  }
} 