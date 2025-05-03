# CI/CDパイプライン設定ガイド

## 概要

このドキュメントでは、Commit Coachプロジェクトで使用するCI/CDパイプラインの設定方法について説明します。CI/CDパイプラインは、コードの品質保証、テスト自動化、デプロイの自動化を実現するために重要な役割を果たします。

## 設定済みワークフロー

以下のGitHub Actionsワークフローが設定されています：

1. **CI** (`ci.yml`)
   - リントとタイプチェック
   - ビルドテスト
   - セキュリティスキャン

2. **テストスイート** (`test-suite.yml`)
   - ユニットテスト
   - 統合テスト
   - E2Eテスト
   - カバレッジレポート

3. **バックエンドデプロイ** (`backend-deploy.yml`)
   - テスト実行
   - Fly.ioへのデプロイ

4. **フロントエンドデプロイ** (`frontend-deploy.yml`)
   - テスト実行
   - プレビューデプロイ（PR時）
   - 本番デプロイ（mainブランチへのマージ時）

## 必要なシークレット設定

GitHub Actionsワークフローを正常に実行するためには、以下のシークレットをGitHubリポジトリに設定する必要があります：

### Codecov連携用

- `CODECOV_TOKEN`: Codecovからのトークン（テストカバレッジレポート用）

### Vercel連携用（フロントエンド）

- `VERCEL_TOKEN`: Vercel CLIのトークン
- `VERCEL_ORG_ID`: VercelのOrganization ID
- `VERCEL_PROJECT_ID`: VercelのProject ID

### Fly.io連携用（バックエンド）

- `FLY_API_TOKEN`: Fly.io APIトークン

## シークレットの設定方法

1. GitHubリポジトリの「Settings」タブに移動
2. 左側のメニューから「Secrets and variables」→「Actions」を選択
3. 「New repository secret」ボタンをクリック
4. 名前（例：`VERCEL_TOKEN`）と値を入力して保存

## デプロイ設定

### Vercel（フロントエンド）

1. Vercelアカウントにログイン
2. 新しいプロジェクトを作成
3. 以下の設定を行う：
   - Framework Preset: Next.js
   - Root Directory: apps/frontend
   - Build Command: pnpm build
   - Output Directory: .next

### Fly.io（バックエンド）

1. Fly.ioアカウントにログイン
2. 新しいアプリケーションを作成
3. 以下の設定を行う：
   - Dockerfile: apps/backend/Dockerfile
   - Configuration: apps/backend/fly.toml

## ローカル開発での使用方法

Turborepoを使用して、以下のコマンドでローカル開発を行うことができます：

```bash
# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# テスト実行
pnpm test

# リント実行
pnpm lint

# タイプチェック
pnpm typecheck

# クリーンアップ
pnpm clean
```

## CI/CDパイプラインの拡張

新しいワークフローを追加する場合は、`.github/workflows/`ディレクトリに新しいYAMLファイルを作成します。既存のワークフローをテンプレートとして使用することができます。

## トラブルシューティング

### よくある問題と解決策

1. **ビルドエラー**
   - package.jsonの依存関係が最新かどうか確認
   - node_modulesを削除して再インストール

2. **テスト失敗**
   - テストが最新のコードと一致しているか確認
   - モックの設定を確認

3. **デプロイ失敗**
   - シークレットが正しく設定されているか確認
   - デプロイ設定（Vercel/Fly.io）を確認

## 参考リンク

- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)
- [Vercel デプロイドキュメント](https://vercel.com/docs/deployments/overview)
- [Fly.io デプロイドキュメント](https://fly.io/docs/hands-on/install-flyctl/)
- [Turborepo ドキュメント](https://turbo.build/repo/docs)
