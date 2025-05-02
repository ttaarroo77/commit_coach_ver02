# プロジェクト構造整理手順

## 1. ルートディレクトリの整理

### 残すべきディレクトリ
- `apps` - バックエンドとフロントエンドのコード
- `docs` - プロジェクトドキュメント
- `supabase` - Supabase設定
- `.github` - GitHub関連設定
- `.husky` - Git hooks設定
- `.vscode` - VSCode設定

### 整理すべきディレクトリ
- `__mocks__` - モックファイル（必要に応じて残す）
- `__tests__` - テストファイル（必要に応じて残す）
- `babel_backup` - 不要なら削除
- `backup` - 不要なら削除
- `project_backup` - 不要なら削除
- `zips` - 不要なら削除
- `logs` - 不要なら削除
- `cursorrules` - 不要なら削除（`.windsurfrules`があれば十分）

## 2. 設定ファイルの整理

### 残すべき設定ファイル
- `package.json` - プロジェクト依存関係
- `pnpm-workspace.yaml` - ワークスペース設定
- `turbo.json` - Turborepo設定
- `.gitignore` - Git除外設定
- `.editorconfig` - エディタ設定
- `commitlint.config.js` - コミットリント設定
- `README.md` - プロジェクト説明

### 整理すべき設定ファイル
- 重複するJest設定ファイル
- 重複するVite設定ファイル
- 古いバックアップファイル
- 一時ファイル

## 3. ドキュメントの整理

### 残すべきドキュメント
- `docs/overview/architecture.spec.md` - アーキテクチャ仕様
- `docs/overview/development_flow.md` - 開発フロー
- `cleanup_plan` - 整理計画（作業完了後に削除可）

### 整理すべきドキュメント
- 古いバックアッププラン
- 重複するドキュメント
- 不要なメモ

## 4. デプロイスクリプトの整理

- `deploy_safe.sh`
- `deploy_unsafe.sh`

## 5. 環境変数の整理

- `.env.example` ファイルの作成（フロントエンド用）
- `.env.example` ファイルの作成（バックエンド用）

## 6. 最終確認

整理後に以下を確認：

1. バックエンドが正常に起動するか
2. フロントエンドが正常に起動するか
3. フロントエンドとバックエンドが連携できるか
4. ビルドが成功するか
5. テストが通るか（必要に応じて）
