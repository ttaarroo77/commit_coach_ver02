# バックエンド整理手順

## 1. 現状確認

- `apps/backend` ディレクトリは正常に動作確認済み
- ポート3002でサーバーが起動している
- APIエンドポイントが正常に機能している

## 2. 不要ファイルの整理

- 一時ファイル（`*.log`, `*.tmp`など）の削除
- 使用していないモジュールやテストファイルの確認

## 3. 設定ファイルの確認

- `.env.example` ファイルの作成または更新
- 必要な環境変数の整理
- `tsconfig.json` の確認と最適化

## 4. 型定義の確認

- `src/types` ディレクトリの内容確認
- フロントエンドとの型定義の整合性確認

## 5. コントローラーの確認

既存のコントローラー：
- `ai.controller.ts` - AI関連機能（現在一部機能が無効化されている）
- `auth.controller.ts` - 認証関連
- `project.controller.ts` - プロジェクト管理
- `task-group.controller.ts` - タスクグループ管理
- `task.controller.ts` - タスク管理

## 6. ルーティングの確認

既存のルーティング：
- `/api/auth` - 認証API
- `/api/projects` - プロジェクト管理API
- `/api/tasks` - タスク管理API
- `/api/task-groups` - タスクグループ管理API
- `/api/ai` - AI機能API（現在メンテナンス中）
- `/api/health` - ヘルスチェックAPI

## 7. データベース接続の確認

- Supabaseとの連携確認
- Prismaスキーマの確認

## 8. 動作確認

- サーバー起動テスト
- 各APIエンドポイントの動作確認
- フロントエンドとの連携確認
