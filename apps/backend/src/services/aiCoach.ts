import { dbService } from './db';
import { ApiError } from '../utils/error';
import { logger } from '../utils/logger';

class AICoachService {
  async chat(userId: string, message: string) {
    try {
      logger.info('AIコーチとの対話を開始します', { userId });

      // ユーザーの会話履歴を取得
      const conversationHistory = await this.getConversationHistory(userId);

      // TODO: AIモデルとの連携を実装
      const response = {
        message: 'これはテスト応答です。AIモデルとの連携が実装されていません。',
        timestamp: new Date().toISOString()
      };

      // 会話履歴を保存
      await this.saveConversation(userId, message, response.message);

      logger.info('AIコーチとの対話が完了しました', { userId });
      return response;
    } catch (error) {
      logger.error('AIコーチとの対話中にエラーが発生しました:', error);
      throw new ApiError(500, 'AIコーチとの対話中にエラーが発生しました');
    }
  }

  private async getConversationHistory(userId: string) {
    try {
      const { data, error } = await dbService.select('conversations', {
        user_id: userId,
      }, {
        order: { created_at: 'desc' },
        limit: 10
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('会話履歴の取得中にエラーが発生しました:', error);
      throw new ApiError(500, '会話履歴の取得中にエラーが発生しました');
    }
  }

  private async saveConversation(userId: string, userMessage: string, aiResponse: string) {
    try {
      const { error } = await dbService.insert('conversations', {
        user_id: userId,
        user_message: userMessage,
        ai_response: aiResponse,
        created_at: new Date().toISOString()
      });

      if (error) throw error;
    } catch (error) {
      logger.error('会話の保存中にエラーが発生しました:', error);
      throw new ApiError(500, '会話の保存中にエラーが発生しました');
    }
  }
}

export const aiCoachService = new AICoachService();