# Commit Coach Frontend

プロジェクト管理アプリケーションのフロントエンドです。

## 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- shadcn/ui

## 開発環境のセットアップ

1. リポジトリをクローンします：

```bash
git clone https://github.com/your-username/commit-coach.git
cd commit-coach/apps/frontend
```

2. 依存関係をインストールします：

```bash
npm install
```

3. 環境変数を設定します：

`.env.example`ファイルを`.env`にコピーし、必要な値を設定します：

```bash
cp .env.example .env
```

4. 開発サーバーを起動します：

```bash
npm run dev
```

アプリケーションは`http://localhost:3000`で利用できます。

## 機能

- ユーザー認証
- プロジェクト管理
  - プロジェクトの作成、編集、削除
  - タスクの作成、編集、削除
  - タスクのステータス管理

## テスト

テストを実行するには：

```bash
npm run test        # 単体テストの実行
npm run test:watch  # ウォッチモードでテストを実行
```

## ビルド

本番用のビルドを作成するには：

```bash
npm run build
```

## デプロイ

本番環境にデプロイするには：

```bash
npm run build
npm run start
```

## ライセンス

MIT
