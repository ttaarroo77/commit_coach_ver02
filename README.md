# Commit Coach

カンバンボードを中心としたタスク管理アプリケーション

## 機能

- プロジェクト管理
- タスク管理（カンバンボード形式）
- ドラッグ&ドロップによるタスクの移動
- アクセシビリティ対応
- レスポンシブデザイン

## 技術スタック

- React
- TypeScript
- Vite
- Vitest
- Testing Library
- Tailwind CSS

## セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-username/commit-coach.git
cd commit-coach

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

## テスト

```bash
# すべてのテストを実行
pnpm test

# 特定のテストを実行
pnpm test:unit      # 単体テスト
pnpm test:integration  # 統合テスト
pnpm test:performance  # パフォーマンステスト
pnpm test:accessibility  # アクセシビリティテスト

# カバレッジレポートの生成
pnpm test:coverage
```

## コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

MIT