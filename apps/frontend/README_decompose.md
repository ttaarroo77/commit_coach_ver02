# タスク分解機能 - 設計と使用方法

## 概要

タスク分解機能は、プロジェクトやタスクを階層的に分解するための機能です。ユーザーが「{}」ボタンをクリックすると、選択した項目に応じた子タスクを自動生成します。

- **プロジェクト分解**: プロジェクト → 複数のタスク
- **タスク分解**: タスク → 複数のサブタスク

## アーキテクチャ

この機能は将来的にAIによる分解に置き換えられるよう、以下の設計原則に従っています：

1. **レイヤー分離**: UIとロジックを明確に分離
2. **Strategy Pattern**: 実装の差し替えが容易な設計
3. **非同期処理**: AIの処理時間を考慮した設計

### コンポーネント構成

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   UI Layer  │ ──→ │  Hook Layer │ ──→ │Service Layer │
└─────────────┘      └─────────────┘      └─────────────┘
  TaskItemWithMenu    useDecompose      decompose-service
  TaskGroup                             (モック/AI実装)
  ProjectsPage
```

## 実装ファイル

- **`lib/decompose-service.ts`**: 分解ロジックの実装（現在はモック）
- **`hooks/use-decompose.ts`**: React Hookによるインターフェース
- **`components/task-item-with-menu.tsx`**: 分解ボタンとイベント処理
- **`components/task-group.tsx`**: イベント伝播
- **`app/projects/page.tsx`**: 状態管理と更新ロジック

## 使用方法

### 現在の実装（モック）

現在の実装では、固定のテンプレートを使用してタスクを生成します：

1. プロジェクト分解：6つの定型タスク
2. タスク分解：4つの定型サブタスク（タイトルを反映）

### 将来のAI実装

将来的には、以下の手順でAI実装に置き換えることができます：

1. `lib/decompose-service.ts`に`decomposeAI`関数を実装
2. 環境変数またはフラグに応じて使用する実装を切り替え

```typescript
// 実装例
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const decomposeAI = async (title: string, level: 1 | 2) => {
  const prompt = `「${title}」を${level === 1 ? "タスク" : "サブタスク"}に分解して、
  具体的で実行可能な6つの項目を箇条書きで出力してください。`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "あなたはプロジェクト管理のエキスパートです。" },
      { role: "user", content: prompt }
    ],
  });

  // 応答から箇条書きを抽出する処理
  return parseBulletPoints(response.choices[0].message.content);
};

// 使用する実装を環境に応じて切り替え
export const decompose = process.env.USE_AI === "true"
  ? decomposeAI
  : mockDecompose;
```

## UI/UX仕様

- 分解ボタンクリック時にアニメーションでローディング表示
- 生成完了後、親ノードが自動的に展開
- トースト通知で生成結果を表示
- 生成されたタスクはすぐに編集可能

## 今後の拡張予定

- AIによる高品質なタスク分解
- ユーザーの過去の分解パターンの学習
- プロジェクト種別に応じたテンプレート提案
- タスク間の依存関係の自動検出

---

*注: この機能はチケット`AI-101`でAI実装に置き換える予定です。*
