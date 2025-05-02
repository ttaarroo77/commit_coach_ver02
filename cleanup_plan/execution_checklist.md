# プロジェクト整理実行チェックリスト

## フロントエンド整理

- [ ] 重複ディレクトリの削除確認
  - [x] `apps/frontend/apps` ディレクトリのバックアップと削除
  - [x] `apps/frontend/src/src` ディレクトリのバックアップと削除
  - [ ] `apps/frontend/src/app/app` ディレクトリの内容を確認

- [ ] パスエイリアスの修正
  - [x] `apps/frontend/src/hooks/useProjects.ts`
  - [x] `apps/frontend/src/types/project.ts`
  - [x] `apps/frontend/src/types/task.ts`
  - [x] `apps/frontend/src/app/components/ui/command.tsx`
  - [x] `apps/frontend/src/app/components/ui/badge.tsx`
  - [x] `apps/frontend/src/app/components/ui/button.tsx`
  - [x] `apps/frontend/src/app/components/ui/input.tsx`
  - [x] `apps/frontend/src/components/LinkValidator.tsx`
  - [x] `apps/frontend/src/app/layout.tsx`
  - [ ] その他のパスエイリアスを使用しているファイル

- [ ] ディレクトリ構造の整理
  - [ ] `apps/frontend/src/app/app` → `apps/frontend/src/app`
  - [x] `apps/frontend/src/app/components` → バックアップ済み
  - [x] `apps/frontend/src/app/contexts` → バックアップ済み
  - [x] `apps/frontend/src/app/hooks` → バックアップ済み
  - [x] `apps/frontend/src/app/lib` → バックアップ済み
  - [x] `apps/frontend/src/app/types` → バックアップ済み

## バックエンド整理

- [x] 動作確認済み（ポート3002でサーバー起動）
- [ ] 不要ファイルの削除
- [ ] 設定ファイルの確認

## プロジェクト全体の整理

- [ ] バックアップディレクトリの整理
  - [ ] `project_backup` - 必要なファイルを確認後削除
  - [ ] `babel_backup` - 不要なら削除
  - [ ] `backup` - 不要なら削除
  - [ ] `zips` - 不要なら削除

- [ ] 設定ファイルの整理
  - [ ] 重複するJest設定ファイル
  - [ ] 重複するVite設定ファイル
  - [ ] 古いバックアップファイル

- [ ] ドキュメントの整理
  - [ ] 古いバックアッププラン
  - [ ] 重複するドキュメント

## 最終確認

- [ ] バックエンドの起動確認
- [ ] フロントエンドの起動確認
- [ ] フロントエンド・バックエンド連携確認
- [ ] ビルド確認
