---
id: scratchpad
title: コミットコーチ - 作業メモ帳
owner: nakazawatarou
stakeholders: [dev_team, ai_assistant]
tasks_note: 必ず、終わったタスクには[x]印をつけて、ここに報連相の記録を残すこと
---

# 📋 プロジェクト概要

## 🎯 目的

- 小規模タスクを進めるための、一時的PDCAメモ
- 粒度：数時間〜数日スパン、現在の作業だけ
- 更新頻度：手が動くたびに随時
- 想定読者：今作業している自分＋AI
- サイズ上限：実務上 500 行程度でローテーション推奨

## 🔍 現状まとめ

- **frontend** :
  - [x] APIエンドポイントの確認（`/projects` `/tasks` など）
  - [x] データ取得用カスタムフック（`useProjects` `useTasks` `useDashboardTasks`）の実装
  - [ ] SWRによるデータキャッシュ最適化
  - [ ] ダッシュボード・プロジェクトページの動的化（SWR/状態管理/フィルタリング）
  - [ ] UI/UX設計の再定義・リスト形式タスク表示への移行
  - [ ] テスト・アクセシビリティ・E2Eの強化
  - [ ] UI/UX改善（追加成功時のフィードバック、ローディング、エラー表示）
- **backend** :
  - development_flow.mdの進捗表に準拠し、API/DB/CI/CD/テストカバレッジの強化を継続

## ⚠️ 進捗表・チェックリストの扱い

- `development_flow.md` の進捗表・チェックリスト（[ ]）は **backend のみ参考**。
- frontendは現状の再構築方針・タスクに従い、独自に進捗・TODOを管理する。

## 🤖 AIアシスタントの役割分担

### cursor（テスト生成担当）

- テストケースの設計と生成
- テストファイルの作成
- テストの構造化
- テストのドキュメント化

### windsurf（テスト実行・修正担当）

- テストの実行と検証
- テストの修正と最適化
- コードの修正提案
- パフォーマンスの改善

## 📚 重要参照ファイル

以下のファイルは本プロジェクト開発において常に参照すべき重要文書です：

- **[📝 skratchpad.md](./skratchpad.md)** - 作業メモ帳（短期記憶）
- **[🏗️ architecture.spec.md](./docs/overview/architecture.spec.md)** - アーキテクチャ仕様
- **[🗺️ development_flow.md](./docs/overview/development_flow.md)** - 作業全体のロードマップ（長期記憶）
- **[👥 roles_and_roadmap.md](./docs/overview/roles_and_roadmap.md)** - AIアクターの役割とロードマップ
- **[📋 overview ディレクトリ](./docs/overview)** - プロジェクト全体の要件定義書
- **[📦 zips ディレクトリ](./zips)** - 実装のための参考となるコードやコンポーネント
- **[🚀 frontend ディレクトリ](./apps/frontend)** - 実際の実装が行われる場所

# 🎯 現在のタスク（優先順位順）
1. **SWR導入によるデータ取得の最適化**
2. **ダッシュボード・プロジェクトの動的表示（API連携・状態管理）**
3. **UI/UX設計の再定義・リスト形式タスク表示**
4. **タスク追加・編集・削除・ステータス変更機能の移行**
5. **テスト（ユニット・統合・E2E）とアクセシビリティ対応**
6. **UI/UX改善（フィードバック・ローディング・エラー）**

# ✅ 完了した作業
- APIエンドポイントの確認
- useProjects/useTasks/useDashboardTasksの実装
- 認証フロー・Supabase連携・パスエイリアス修正
- 基本UIコンポーネントのテスト

# 🔄 次のステップ
- SWR導入
- ダッシュボードの動的化
- UI/UX設計の再定義
- テスト・アクセシビリティ強化

# backend
- development_flow.mdの進捗表に準拠し、API/DB/CI/CD/テストカバレッジの強化を継続

# 🎯 現在のタスク (JIRA-460: フロントエンド改善)


## 🚀 次のステップ
1. 統合テストの実装
2. パフォーマンステストの実装
3. アクセシビリティテストの実装



# 🎯 ダッシュボードへのタスク追加機能の実装手順

## 現状の問題点
- プロジェクト、タスク、サブタスクの各レベルで「ダッシュボードに追加」ボタンが機能していない
- 現在は`localStorage`に単一の`dashboardTask`として保存しているため、複数のタスクを追加できない
- タスクの状態管理が適切に行われていない

## 実装手順

### 1. データ構造の設計
- [ ] `DashboardTask`インターフェースの定義
  ```typescript
  interface DashboardTask {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    project: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
  }
  ```

### 2. 状態管理の実装
- [ ] `useDashboardTasks`カスタムフックの作成
  - タスクの追加、更新、削除機能
  - ローカルストレージとの同期
  - タスクの並び替え機能

### 3. APIエンドポイントの実装
- [ ] バックエンドAPIの作成
  - `POST /api/dashboard/tasks` - タスクの追加
  - `GET /api/dashboard/tasks` - タスク一覧の取得
  - `PUT /api/dashboard/tasks/:id` - タスクの更新
  - `DELETE /api/dashboard/tasks/:id` - タスクの削除

### 4. フロントエンドの実装
- [ ] `project-template.tsx`の修正
  - `addToSchedule`関数の実装
  - `addSubtaskToSchedule`関数の実装
  - `addProjectToSchedule`関数の実装
  - `addTaskGroupToSchedule`関数の実装

### 5. エラーハンドリング
- [ ] エラー処理の実装
  - APIリクエスト失敗時のエラーハンドリング
  - バリデーションエラーの処理
  - ユーザーへのフィードバック表示

### 6. テストの実装
- [ ] ユニットテストの作成
  - `useDashboardTasks`フックのテスト
  - 各スケジュール追加関数のテスト
- [ ] 統合テストの作成
  - APIエンドポイントのテスト
  - エンドツーエンドのフロー確認

### 7. UI/UX改善
- [ ] 追加成功時のフィードバック表示
- [ ] ローディング状態の表示
- [ ] エラーメッセージの表示

## 実装の優先順位
1. データ構造の設計
2. 状態管理の実装
3. フロントエンドの実装
4. APIエンドポイントの実装
5. エラーハンドリング
6. テストの実装
7. UI/UX改善
