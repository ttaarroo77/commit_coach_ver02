# フロントエンド整理手順

## 1. 重複ディレクトリの削除

既に実施済みの作業：
- `apps/frontend/apps` ディレクトリをバックアップ（`project_backup/apps_frontend_apps_backup`）
- `apps/frontend/apps` ディレクトリを削除
- `apps/frontend/src/src` ディレクトリをバックアップ（`project_backup/src_src_backup`）
- `apps/frontend/src/src` ディレクトリを削除

## 2. パスエイリアスの修正

既に修正済みのファイル：
- `apps/frontend/src/hooks/useProjects.ts`
- `apps/frontend/src/types/project.ts`
- `apps/frontend/src/types/task.ts`
- `apps/frontend/src/app/components/ui/command.tsx`
- `apps/frontend/src/app/components/ui/badge.tsx`
- `apps/frontend/src/app/components/ui/button.tsx`
- `apps/frontend/src/app/components/ui/input.tsx`
- `apps/frontend/src/components/LinkValidator.tsx`
- `apps/frontend/src/app/layout.tsx`

残りの修正が必要なファイル：
- `apps/frontend/src/app/(app)/dashboard/page.tsx`
- `apps/frontend/src/app/(app)/layout.tsx`
- `apps/frontend/src/app/app/projects/[id]/page.tsx`
- その他のパスエイリアスを使用しているファイル

## 3. ディレクトリ構造の整理

- `apps/frontend/src/app/app` ディレクトリの内容を `apps/frontend/src/app` に統合
- `apps/frontend/src/app/components` ディレクトリの内容を `apps/frontend/src/components` に統合
- `apps/frontend/src/app/contexts` ディレクトリの内容を `apps/frontend/src/contexts` に統合
- `apps/frontend/src/app/hooks` ディレクトリの内容を `apps/frontend/src/hooks` に統合
- `apps/frontend/src/app/lib` ディレクトリの内容を `apps/frontend/src/lib` に統合
- `apps/frontend/src/app/types` ディレクトリの内容を `apps/frontend/src/types` に統合

## 4. 設定ファイルの整理

- `apps/frontend/next.config.mjs` の確認と最適化
- `apps/frontend/tsconfig.json` の確認と最適化
- `apps/frontend/jest.config.js` の確認と最適化
- `apps/frontend/vite.config.ts` の確認と最適化

## 5. 環境変数の設定

- `.env.example` ファイルの作成または更新
- 必要な環境変数の整理

## 6. 動作確認

- フロントエンドのビルド
- フロントエンドの起動
- バックエンドとの連携確認
