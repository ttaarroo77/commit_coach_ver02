# AIサービス仕様書

## 概要
AIサービス（`AIService`）は、OpenAIのAPIを使用してタスク分解、タスク分析、プロジェクト分析などの機能を提供します。ユーザー設定の管理やAIメッセージの履歴保存も行います。

## 依存関係
- OpenAI API
- Supabase
- 環境変数：`OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

## 主要機能

### 1. ユーザー設定管理
```typescript
async getUserConfig(userId: string): Promise<AIConfig>
async saveUserConfig(userId: string, config: AIConfig): Promise<void>
```

ユーザーごとのAI設定（使用モデル、温度、最大トークン数など）を取得・保存します。

### 2. AIメッセージ履歴
```typescript
async saveMessage(userId: string, message: AIMessage): Promise<void>
async getMessages(userId: string, limit = 10): Promise<AIMessage[]>
```

ユーザーとAIのメッセージ履歴を保存・取得します。

### 3. タスク分解
```typescript
async breakDownTask(task: any): Promise<TaskBreakdown>
```

タスクを複数のサブタスクに分解し、各サブタスクの見積もり時間と優先度を設定します。

### 4. タスク分析
```typescript
async analyzeTask(task: any): Promise<string>
```

タスクの内容を分析し、実装のポイントや注意点を提案します。

### 5. プロジェクト分析
```typescript
async analyzeProject(project: Project): Promise<string>
```

プロジェクトの状況を分析し、改善点や次のステップを提案します。

### 6. コミット提案
```typescript
async suggestCommits(taskId: string, description: string): Promise<string[]>
```

タスクの説明からConventional Commitsに従ったコミットメッセージを提案します。

## エラーハンドリング

AIサービスは以下のエラーハンドリングメカニズムを実装しています：

1. **リトライロジック**: OpenAI APIのレート制限やタイムアウトエラーに対して、指数バックオフでリトライします（最大3回）。
2. **フォールバックメカニズム**: APIキーが設定されていない場合や、すべてのリトライが失敗した場合は、モックデータを返します。
3. **ロギング**: エラー発生時には詳細なログを出力します。

## 使用例

### タスク分解
```typescript
const aiService = new AIService();
const task = await taskService.getTaskById(userId, taskId);
const breakdown = await aiService.breakDownTask(task);
```

### プロジェクト分析
```typescript
const aiService = new AIService();
const project = await dbService.select('projects', { filters: { id: projectId, user_id: userId } });
const analysis = await aiService.analyzeProject(project[0]);
```

## 注意事項

1. OpenAI APIキーが設定されていない場合、サービスは制限付きで動作し、モックデータを返します。
2. 現在、タスクとプロジェクトの型定義は`any`型を使用しているため、将来的に型安全性を高める必要があります。
3. プロジェクト分析機能は、TaskServiceに`getProjectById`メソッドがないため、直接データベースアクセスを行っています。
