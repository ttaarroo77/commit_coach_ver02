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
- **frontend** : 全面的改修が必要（v0の資産は初期ファイルとしてのみ参考。設計・実装ともに再構築）
  - パスエイリアス問題の修正完了（Next.jsの設定でwebpackの解決を追加）
  - Supabaseとのデータ連携の改善完了
  - 認証フローの実装完了（JWT Cookie保存、ログアウト処理、認証ガード）
  - ヘッダーコンポーネントの追加（ログイン/ログアウト状態の表示）
  - 登録ページとパスワードリセットページの実装完了
  - React Hook Form + Zodを使用したバリデーションの実装
  - ローディング状態とエラーメッセージの表示を改善完了（LoadingSpinner、ErrorMessageコンポーネント）
- **backend**  : 微調整でOK（既存API・DB設計は大きな変更不要。細部の改善・テスト強化が中心）

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

# 🎯 現在のタスク

## frontend
- [ ] UI/UX設計の再定義
- [ ] ページ・ルーティング構成の再設計
- [ ] 新規コンポーネント実装（v0資産は参考程度）
- [ ] Tailwind/デザインシステムの再構築
- [x] Next.js 15.3.1のパスエイリアス問題の修正（webpack設定で解決）
- [x] Supabaseとのデータ連携の改善（useProjects、useProjectTasksフック）
- [x] ログインページの実装（Email/PWフォーム）
- [x] useAuthコンテキストの実装（Supabase連携）
- [x] JWTをCookieに保存する機能の実装
- [x] ログアウト処理の実装
- [x] 認証ガード（Next.js middleware）の実装
- [x] 登録・パスワードリセットページの実装
- [x] react-hook-form + zodバリデーションの実装
- [x] ローディングとエラーメッセージの改善
- [x] フロントエンド認証テスト（登録フォーム）実装・完了
- [x] フロントエンド認証テスト（パスワードリセットフォーム）実装・完了
- [x] フロントエンド認証テスト（認証ガードmiddleware）実装・完了
- [x] フロントエンドUIテスト（LoadingSpinnerコンポーネント）実装・完了
- [x] フロントエンドUIテスト（ErrorMessageコンポーネント）実装・完了
- [x] AIチャットプレースホルダコンポーネントのテスト実装・完了
- [x] 今日のタスク / 期限間近カードの実装
- [x] 時計 & ミニカレンダーの実装
- [x] 時計・ミニカレンダーコンポーネントのテスト実装・完了
- [x] タスク概要カードコンポーネントのテスト実装・完了
- [x] プロジェクト詳細ページのテスト実装・完了
- [ ] 切れているリンク・画面の修正
- [ ] テスト環境の再整備
- [ ] E2E/アクセシビリティテスト
- [ ] デプロイ・CI/CD再設定
- [x] プロジェクト作成フォームのバリデーションテスト実装・完了
- [x] ボタン・カードなどの基本UIコンポーネントのテスト実装・完了

## backend
- [ ] API仕様の微調整（必要に応じて）
- [ ] DBスキーマの微修正（必要に応じて）
- [ ] テストカバレッジ向上
- [ ] CI/CD・Secrets管理の見直し
- [ ] パフォーマンス・セキュリティ改善

# 🎯 現在のタスク (JIRA-460: フロントエンド改善)

## 📊 進捗状況

- 開発ロードマップ：Step 60.1、Step 60.3完了、次はStep 60.2（プロジェクト詳細ページの修正）とStep 60.4（切れているリンク・画面の修正）
- 全体進捗：38% (バックエンド80/100タスク完了、フロントエンド48/80タスク)

## ✅ 完了した作業

### 1. Next.js 15.3.1のパスエイリアス問題の修正

- [x] プロジェクト詳細ページ（/projects/[id]）のパスエイリアスを相対パスに変換
- [x] ProjectDetailsコンポーネントのパスエイリアスを相対パスに変換
- [x] useProjectsフックのパスエイリアスを相対パスに変換
- [x] useProjectTasksフックのパスエイリアスを相対パスに変換

### 2. Supabaseとのデータ連携の改善

- [x] useProjectsフックのSupabase連携を実装（モックデータから実データに移行）
- [x] useProjectTasksフックのSupabase連携を改善（エラーハンドリングとトースト通知の追加）
- [x] リアルタイム更新機能の実装（Supabaseのリアルタイムサブスクリプション）
- [x] ローディング状態の改善

### 3. カンバンボードのテスト実装

- [x] レンダリングテスト
- [x] ドラッグ＆ドロップ機能のテスト
- [x] タスク追加・編集・削除のテスト
- [x] スタイルの実装

### 4. タスクカードのテスト実装

- [x] レンダリングテスト
- [x] イベントハンドリングのテスト
- [x] 状態変更のテスト
- [x] スタイルの実装

### 5. プロジェクト一覧のテスト実装

- [x] レンダリングテスト
- [x] フィルタリング機能のテスト
- [x] ページネーションのテスト
- [x] スタイルの実装

## 🚀 次のステップ

### 1. 統合テストの実装

- [ ] コンポーネント間の連携テスト
- [ ] データフローのテスト
- [ ] エラーハンドリングのテスト

### 2. パフォーマンステストの実装

- [ ] レンダリングパフォーマンスのテスト
- [ ] メモリリークのテスト
- [ ] レスポンシブデザインのテスト

### 3. アクセシビリティテストの実装

- [ ] ARIA属性のテスト
- [ ] キーボードナビゲーションのテスト
- [ ] スクリーンリーダーのテスト

## 🔍 APIエンドポイント確認タイミング

統合テストを開始する前に、以下のタイミングでAPIエンドポイントの動作確認を行うことを推奨します：

### 1. テストデータの準備時

```bash
# プロジェクト一覧の取得
curl -X GET http://localhost:3000/api/projects

# タスク一覧の取得
curl -X GET http://localhost:3000/api/tasks
```

### 2. CRUD操作のテスト前

```bash
# プロジェクトの作成
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "テストプロジェクト", "description": "テスト用"}'

# タスクの作成
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "テストタスク", "description": "テスト用", "status": "todo"}'
```

### 3. 認証関連のテスト前

```bash
# ログイン
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'

# トークンの確認
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. エラーハンドリングのテスト前

```bash
# 無効なデータでの作成
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'

# 存在しないリソースへのアクセス
curl -X GET http://localhost:3000/api/projects/999
```

## 💡 確認の効果

- APIの動作を確実に把握できる
- テストケースの設計が効率的になる
- エラーパターンを事前に特定できる
- テストの信頼性が向上する

# 📝 メモ

## 🧪 テスト実装の注意点

- テストはコンポーネントごとに分割して進める
- 各コンポーネントの責務に基づいたテストケースを設計
- テストの独立性を保つため、適切なモックを使用

## 💡 学んだこと

- Supabase 2.x は `signInWithPassword` が非推奨 → `signInWithPasswordless` に移行
- react-beautiful-dndとFramer Motionの併用時は、Draggableコンポーネント内で直接motion.divを使わず、通常のdivでラップする必要がある
- SWRのキャッシュ戦略は適切に設定することでパフォーマンスが向上する

## 🛠️ 技術的負債・暫定対応メモ

- [ ] SupabaseのURL/KEYは現状AuthProvider.tsxにベタ打ち。ポートフォリオ・検証用の暫定対応。
- [ ] 本番・公開前に必ず.env.local（または.env）で `NEXT_PUBLIC_SUPABASE_URL` `NEXT_PUBLIC_SUPABASE_ANON_KEY` として環境変数管理に修正すること。

## ✅ セーブポイント予定（backend開発）

- [x] テスト・モックの order→position 置換＆enum値統一後、「npm run dev」でエラー0（型エラーは残る可能性あり）
- [x] OpenAI SDK content型エラー修正後、「npm run dev」「typecheck」両方エラー0
- [x] テストディレクトリの型・モック修正完了後、「typecheck」「test」両方エラー0
- [x] DB/RPC（order→position）・CI/CD修正後、CI緑化
- [x] 主要ドキュメント・README更新後

---




