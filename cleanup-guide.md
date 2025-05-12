# プロジェクトクリーンアップガイド

このドキュメントはプロジェクト内の不要または重複しているファイル・ディレクトリをリストアップしています。
バックアップがあるため、以下のファイルやディレクトリは安全に削除できます。

## 重複ディレクトリと不要なファイル

### 1. 重複するフロントエンドディレクトリ // 削除ずみ

```
apps/frontend/frontend/
```

`apps/frontend`内に再度`frontend`ディレクトリがあり、READMEファイルのみが含まれています。不要です。

### 2. 重複するフレームワーク設定

`apps/frontend_backend`ディレクトリには多くの重複設定ファイルがあります：

```
apps/frontend_backend/tailwind.config.js と apps/frontend_backend/tailwind.config.ts
apps/frontend_backend/next.config.js と apps/frontend_backend/next.config.mjs
```

これらはどちらか一方だけ必要です。

### 3. 重複するテストディレクトリ // 統合済み

バックエンドに複数のテストディレクトリがありましたが、すべて`tests`ディレクトリに統合しました：

```
apps/backend/__tests__/ -> apps/backend/tests/
apps/backend/test/ -> apps/backend/tests/
```

テストディレクトリ構造を次のように整理しました：
- `tests/unit/` - ユニットテスト
- `tests/e2e/` - E2Eテスト
- `tests/helpers/` - テストヘルパー
- `tests/setup.ts` - テストセットアップファイル
- `tests/jest-e2e.json` - E2Eテスト設定

以下のファイルも更新しました：
- `jest.config.ts` - メインのJest設定
- `package.json` - テスト関連のスクリプト

### 4. ルートレベルの不要なソースディレクトリ //削除ずみ

```
src/
```

ルートの`src`ディレクトリには最小限のコンテンツしかなく、モノレポ構造では各アプリケーションが独自の`src`を持つべきです。

### 5. ビルド成果物とキャッシュディレクトリ // 削除済み・.gitignoreに追加済み

```
apps/frontend/.next/
apps/frontend_backend/.next/
apps/backend/dist/
apps/backend/coverage/
.turbo/
apps/frontend_backend/.turbo/
apps/backend/.turbo/
```

これらのディレクトリは削除し、`.gitignore`に追加しました。これらはビルド時に自動生成されるため、リポジトリに含める必要はありません。

### 6. 重複する依存関係ロックファイル // pnpmに統一済み

```
package-lock.json
apps/frontend_backend/package-lock.json
apps/backend/package-lock.json
```

現在の分析に基づき、**pnpmに統一**しました。理由：

1. ルートの`package.json`で`"packageManager": "pnpm@8.9.0"`が指定されている
2. `pnpm-workspace.yaml`ファイルが存在し、すでにpnpmのワークスペース設定が整っている
3. turborepoはpnpmとの相性が良い

実施したアクション：
- `package-lock.json`ファイルを削除
- 各アプリケーションの`package-lock.json`を削除
- `pnpm install`を実行して依存関係を更新

### 7. 重複する設定ファイル // 一元化済み

```
.eslintrc.js と apps/backend/.eslintrc.json // 一元化済み
.prettierrc と apps/backend/.prettierrc // 一元化済み
vite.config.ts と apps/frontend_backend/vite.config.ts // 一元化済み
vitest.config.ts // 一元化済み
```

実施したアクション：
- ESLint設定をルートに一元化し、バックエンド用の設定をオーバーライドとして追加
- Prettier設定をルートに一元化
- バックエンドの個別設定ファイルを削除
- Vite/Vitestの設定を共通モジュールとして一元化:
  - `vite.config.shared.ts` - Viteの共通設定
  - `vitest.config.shared.ts` - Vitestの共通設定
  - 各アプリケーションの設定ファイルを共通設定を使用するように更新

### 8. 未使用のドキュメントファイル

```
organizing_zip_file.md
refactoring_plan.md
skratchpad.md
apps/frontend/tree.md
apps/frontend/dashboard-requirements.md
```

これらは開発中の一時的なドキュメントと思われ、不要になっている可能性があります。 //

### 9. 重複するデプロイスクリプト // 統合済み・削除済み

```
deploy_unsafe.sh  // 削除済み
deploy_safe.sh    // 削除済み
```

両方のデプロイスクリプトを統合した新しいスクリプト`deploy.sh`を作成しました。

実施したアクション：
- 両方のスクリプトの機能を`deploy.sh`に統合
- 実行権限を付与（`chmod +x deploy.sh`）
- 古いスクリプト（`deploy_unsafe.sh`と`deploy_safe.sh`）を削除
- 以下の機能を統合:
  - GitHubへのプッシュ
  - o3分析（unsafe-analysis）
  - Herokuデプロイオプション（現在は無効）
  - カスタムデプロイコマンドオプション

## 進捗状況

- [x] 重複するフロントエンドディレクトリの削除
- [x] テストディレクトリの統合
- [x] ルートレベルの不要なソースディレクトリを削除
- [x] ビルド成果物とキャッシュディレクトリを削除し、.gitignoreに追加
- [x] 依存関係管理をpnpmに統一
- [x] 設定ファイル（ESLint, Prettier, Vite, Vitest）の一元化
- [x] デプロイスクリプトの統合
- [ ] 不要なドキュメントファイルの削除

## 推奨アクション

1. 上記のファイルやディレクトリを削除前に、現在の開発状況を確認してください
2. モノレポ構成を最適化し、依存関係管理をpnpmで統一しました
3. 設定ファイルをルートレベルに集約し、継承設定を実装しました
4. ビルド成果物は`.gitignore`に追加して、リポジトリから除外しました
5. 必要に応じて、不要なドキュメントファイルを削除してください
