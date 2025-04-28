import { ChatMessage } from '@/components/chat/chat-sidebar';
import { ChatMode } from '@/components/chat/chat-context';

// チャット履歴の最大長
const MAX_HISTORY_LENGTH = 20;

// システムプロンプトの生成
export function generateSystemPrompt(mode: ChatMode): string {
  switch (mode) {
    case 'coach':
      return `あなたはCommit Coachというプログラミング支援AIアシスタントです。
ユーザーのコーディングスキル向上を支援し、ベストプラクティスやパフォーマンス最適化のアドバイスを提供します。
回答は簡潔かつ具体的に、日本語で行ってください。`;
    
    case 'code':
      return `あなたはCommit Coachというプログラミング支援AIアシスタントです。
コードレビューと改善提案を専門とし、TypeScriptやReactのベストプラクティスに詳しいです。
コード例を提示する際は、TypeScriptの型安全性を重視し、パフォーマンスを考慮した実装を心がけてください。
回答は簡潔かつ具体的に、日本語で行ってください。`;
    
    case 'commit':
      return `あなたはCommit Coachというプログラミング支援AIアシスタントです。
Conventional Commitsに準拠した高品質なコミットメッセージの作成を支援します。
ユーザーの変更内容を分析し、適切なタイプ（feat, fix, docs, style, refactor, test, chore）を選択し、
スコープ、簡潔な説明、および詳細な変更点を含むコミットメッセージを提案してください。
回答は簡潔かつ具体的に、日本語で行ってください。`;
    
    default:
      return 'あなたはCommit Coachというプログラミング支援AIアシスタントです。ユーザーのコーディング作業を支援します。';
  }
}

// チャット履歴の整理（古いメッセージを削除して履歴を適切なサイズに保つ）
export function trimChatHistory(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length <= MAX_HISTORY_LENGTH) {
    return messages;
  }
  
  // システムメッセージを保持
  const systemMessages = messages.filter(msg => msg.role === 'system');
  
  // ユーザーとアシスタントのメッセージを取得
  const conversationMessages = messages.filter(msg => msg.role !== 'system');
  
  // 最新のMAX_HISTORY_LENGTH - systemMessages.lengthメッセージを保持
  const recentMessages = conversationMessages.slice(-(MAX_HISTORY_LENGTH - systemMessages.length));
  
  // システムメッセージと最新のメッセージを結合
  return [...systemMessages, ...recentMessages];
}

// AIリクエスト用のメッセージ形式に変換
export function formatMessagesForAI(messages: ChatMessage[]): { role: string; content: string }[] {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

// 現在のコンテキストに基づいてシステムメッセージを更新
export function updateSystemMessage(messages: ChatMessage[], mode: ChatMode): ChatMessage[] {
  const systemPrompt = generateSystemPrompt(mode);
  
  // 既存のシステムメッセージを探す
  const systemMessageIndex = messages.findIndex(msg => msg.role === 'system');
  
  if (systemMessageIndex !== -1) {
    // 既存のシステムメッセージを更新
    const updatedMessages = [...messages];
    updatedMessages[systemMessageIndex] = {
      ...updatedMessages[systemMessageIndex],
      content: systemPrompt
    };
    return updatedMessages;
  } else {
    // 新しいシステムメッセージを追加
    const systemMessage: ChatMessage = {
      id: 'system-' + Date.now().toString(),
      role: 'system',
      content: systemPrompt,
      timestamp: new Date().toISOString()
    };
    return [systemMessage, ...messages];
  }
}

// モックレスポンスを生成（後で実際のAI APIに置き換え）
export function getMockResponse(userMessage: string, mode: ChatMode): string {
  switch (mode) {
    case 'coach':
      return `コーチモードでのご質問ありがとうございます。「${userMessage}」について、以下のアドバイスが参考になるかもしれません。

1. コードの構造を見直す
   - 関連する機能をモジュールにまとめる
   - 単一責任の原則を適用する

2. テストカバレッジを増やす
   - ユニットテストを追加
   - エッジケースのテストを実装

3. ドキュメントを充実させる
   - 関数にJSDocコメントを追加
   - READMEを更新`;
    
    case 'code':
      return `コードレビューモードでのご質問ありがとうございます。「${userMessage}」に関するコード改善案です：

\`\`\`typescript
// Before
function getData(id) {
  return fetch('/api/data/' + id)
    .then(res => res.json())
    .then(data => {
      return data;
    });
}

// After
async function getData(id: string): Promise<Data> {
  try {
    const response = await fetch(\`/api/data/\${id}\`);
    if (!response.ok) {
      throw new Error(\`API error: \${response.status}\`);
    }
    return await response.json() as Data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}
\`\`\`

改善ポイント:
1. 型安全性の向上（TypeScriptの型付け）
2. async/awaitによる可読性向上
3. エラーハンドリングの追加
4. テンプレートリテラルの使用`;
    
    case 'commit':
      return `コミットモードでのご質問ありがとうございます。「${userMessage}」に基づくコミットメッセージの提案：

\`\`\`
feat(frontend): カンバンボードのドラッグ&ドロップ機能を実装

- dnd-kitライブラリを使用したドラッグ&ドロップ機能
- React.memoによるパフォーマンス最適化
- タスクと列の移動アニメーションを追加
- アクセシビリティ対応（キーボード操作サポート）

関連チケット: #42
\`\`\`

このコミットメッセージは以下の要素を含んでいます：
1. タイプ: feat（新機能）
2. スコープ: frontend
3. 簡潔な説明
4. 詳細な変更点（箇条書き）
5. 関連チケット番号`;
    
    default:
      return 'ご質問ありがとうございます。どのようにお手伝いできますか？';
  }
}
