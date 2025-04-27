# Commit Coach

AIを活用したタスク管理アプリケーション

## ドキュメント

- [開発フロー](docs/overview/development_flow.md)
- [プロジェクト構造](docs/overview/project-structure.md)
- [型定義](docs/overview/types.md)
- [コンポーネント](docs/overview/components.md)
- [データベース設計](docs/overview/database.md)
- [APIルート](docs/overview/api-routes.md)
- [製品概要](docs/overview/product-brief.md)

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone https://github.com/your-username/commit-coach.git
cd commit-coach
```

2. 依存関係のインストール
```bash
pnpm install
```

3. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集
```

4. 開発サーバーの起動
```bash
pnpm dev
```

## 技術スタック

- フロントエンド: Next.js, React, TypeScript, Tailwind CSS, dnd-kit
- バックエンド: Express.js, TypeScript, Supabase
- データベース: PostgreSQL
- 開発ツール: pnpm, ESLint, Prettier, Husky, GitHub Actions

## ライセンス

MIT