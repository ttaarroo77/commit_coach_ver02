import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// OpenAI APIのURLとモデル設定
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-3.5-turbo';

// APIキーを環境変数から取得
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// リクエストのタイプ定義
interface AIRequestBody {
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  mode: 'coach' | 'code' | 'commit';
}

/**
 * AIチャットAPIのルートハンドラ
 * @param request リクエストオブジェクト
 * @returns AIからのレスポンス
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body: AIRequestBody = await request.json();
    const { messages, mode } = body;

    // APIキーが設定されていない場合はモックレスポンスを返す
    if (!OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY is not set. Using mock response.');
      return NextResponse.json(
        { content: getMockResponse(messages[messages.length - 1].content, mode) },
        { status: 200 }
      );
    }

    // OpenAI APIにリクエストを送信
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    // レスポンスが正常でない場合はエラーを投げる
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    // レスポンスを解析
    const data = await response.json();
    const content = data.choices[0].message.content;

    // クライアントに結果を返す
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Error in AI API route:', error);
    return NextResponse.json(
      { error: 'AIサービスとの通信中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}

/**
 * モックレスポンスを生成（APIキーが設定されていない場合に使用）
 * @param userMessage ユーザーメッセージ
 * @param mode チャットモード
 * @returns モックレスポンス
 */
function getMockResponse(userMessage: string, mode: AIRequestBody['mode']): string {
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
