import { ChatMessage } from '@/components/chat/chat-sidebar';
import { ChatMode } from '@/components/chat/chat-context';
import { getMockResponse, formatMessagesForAI, trimChatHistory, updateSystemMessage } from '@/lib/chat-utils';

// 内部APIエンドポイントのURL
const AI_API_URL = '/api/ai';

// AIチャットサービスのインターフェース
interface AIServiceInterface {
  sendMessage(content: string, chatMode: ChatMode, history: ChatMessage[]): Promise<ChatMessage>;
}

// モックAIサービスの実装
class MockAIService implements AIServiceInterface {
  async sendMessage(content: string, chatMode: ChatMode, history: ChatMessage[]): Promise<ChatMessage> {
    // 実際のAPIリクエストをシミュレート
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = getMockResponse(content, chatMode);
        
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        };
        
        resolve(assistantMessage);
      }, 1000); // 1秒の遅延でレスポンスをシミュレート
    });
  }
}

// 実際のAIサービスの実装
class RealAIService implements AIServiceInterface {
  async sendMessage(content: string, chatMode: ChatMode, history: ChatMessage[]): Promise<ChatMessage> {
    try {
      // システムメッセージを更新
      const updatedHistory = updateSystemMessage(history, chatMode);
      
      // 履歴を整理
      const trimmedHistory = trimChatHistory(updatedHistory);
      
      // AIリクエスト用にメッセージをフォーマット
      const formattedMessages = formatMessagesForAI(trimmedHistory);
      
      // 内部APIエンドポイントにリクエストを送信
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formattedMessages,
          mode: chatMode,
        }),
        // エラーハンドリングを強化
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // レスポンスにエラーが含まれている場合
      if (data.error) {
        throw new Error(data.error);
      }
      
      // レスポンスをChatMessageに変換
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString()
      };
      
      return assistantMessage;
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // エラーメッセージを返す
      return {
        id: Date.now().toString(),
        role: 'system',
        content: `AIサービスとの通信中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}。もう一度お試しください。`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// 実際のサービスを使用
// 開発環境ではモックを使用することも可能（コメントアウトして切り替え）
const aiService: AIServiceInterface = new RealAIService();
// const aiService: AIServiceInterface = process.env.NODE_ENV === 'development' ? new MockAIService() : new RealAIService();

export default aiService;
