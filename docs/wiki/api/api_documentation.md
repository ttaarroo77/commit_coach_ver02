# APIドキュメント

## 概要
Commit CoachのAPIは、RESTfulな設計に基づいて構築されています。このドキュメントでは、各エンドポイントの詳細な仕様を説明します。

## 認証
すべてのAPIリクエストには、JWTトークンが必要です。トークンは`Authorization`ヘッダーに以下の形式で含める必要があります：

```
Authorization: Bearer <token>
```

## エンドポイント

### ユーザー認証

#### サインアップ
新しいユーザーを登録します。

```http
POST /api/auth/signup
```

リクエストボディ：
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

レスポンス：
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "token": "jwt_token"
}
```

#### ログイン
既存のユーザーとしてログインします。

```http
POST /api/auth/login
```

リクエストボディ：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

レスポンス：
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "token": "jwt_token"
}
```

### プロジェクト管理

#### プロジェクト一覧の取得
ユーザーのプロジェクト一覧を取得します。

```http
GET /api/projects
```

レスポンス：
```json
[
  {
    "id": "uuid",
    "name": "Project Name",
    "description": "Project Description",
    "created_at": "2024-03-20T12:00:00Z",
    "updated_at": "2024-03-20T12:00:00Z"
  }
]
```

#### プロジェクトの作成
新しいプロジェクトを作成します。

```http
POST /api/projects
```

リクエストボディ：
```json
{
  "name": "Project Name",
  "description": "Project Description"
}
```

レスポンス：
```json
{
  "id": "uuid",
  "name": "Project Name",
  "description": "Project Description",
  "created_at": "2024-03-20T12:00:00Z",
  "updated_at": "2024-03-20T12:00:00Z"
}
```

### タスク管理

#### タスク一覧の取得
プロジェクトのタスク一覧を取得します。

```http
GET /api/projects/:projectId/tasks
```

レスポンス：
```json
[
  {
    "id": "uuid",
    "title": "Task Title",
    "description": "Task Description",
    "status": "todo",
    "created_at": "2024-03-20T12:00:00Z",
    "updated_at": "2024-03-20T12:00:00Z"
  }
]
```

#### タスクの作成
新しいタスクを作成します。

```http
POST /api/projects/:projectId/tasks
```

リクエストボディ：
```json
{
  "title": "Task Title",
  "description": "Task Description"
}
```

レスポンス：
```json
{
  "id": "uuid",
  "title": "Task Title",
  "description": "Task Description",
  "status": "todo",
  "created_at": "2024-03-20T12:00:00Z",
  "updated_at": "2024-03-20T12:00:00Z"
}
```

### サブタスク管理

#### サブタスク一覧の取得
タスクのサブタスク一覧を取得します。

```http
GET /api/tasks/:taskId/subtasks
```

レスポンス：
```json
[
  {
    "id": "uuid",
    "title": "Subtask Title",
    "description": "Subtask Description",
    "status": "todo",
    "created_at": "2024-03-20T12:00:00Z",
    "updated_at": "2024-03-20T12:00:00Z"
  }
]
```

#### サブタスクの作成
新しいサブタスクを作成します。

```http
POST /api/tasks/:taskId/subtasks
```

リクエストボディ：
```json
{
  "title": "Subtask Title",
  "description": "Subtask Description"
}
```

レスポンス：
```json
{
  "id": "uuid",
  "title": "Subtask Title",
  "description": "Subtask Description",
  "status": "todo",
  "created_at": "2024-03-20T12:00:00Z",
  "updated_at": "2024-03-20T12:00:00Z"
}
```

## エラーレスポンス
すべてのエラーレスポンスは以下の形式で返されます：

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {
      "field": "error details"
    }
  }
}
```

主なエラーコード：
- `INVALID_CREDENTIALS`: 認証情報が無効
- `UNAUTHORIZED`: 認証が必要
- `NOT_FOUND`: リソースが見つからない
- `VALIDATION_ERROR`: バリデーションエラー
- `INTERNAL_ERROR`: サーバー内部エラー

## レート制限
APIの使用には以下のレート制限が適用されます：
- 認証エンドポイント: 1分間に5回
- その他のエンドポイント: 1分間に60回

レート制限に達した場合、以下のヘッダーがレスポンスに含まれます：
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1616245200
```

## バージョニング
APIのバージョンは、URLのパスに含まれます：
```
/api/v1/...
```

## 結論
このAPIドキュメントは、Commit CoachのバックエンドAPIの仕様を説明しています。各エンドポイントの詳細な使用方法、リクエスト/レスポンスの形式、エラーハンドリング、レート制限などの情報が含まれています。 