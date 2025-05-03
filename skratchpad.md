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

# 🎯 現在のタスク (JIRA-459: 認証E2Eテスト実装)

## 📊 進捗状況
- 開発ロードマップ：Step 39完了、次はStep 40（コンポーネントのテスト実装）
- 全体進捗：36% (バックエンド80/100タスク完了、フロントエンド46/80タスク)

## ✅ 完了した作業

### 1. カンバンボードのテスト実装
- [x] レンダリングテスト
- [x] ドラッグ＆ドロップ機能のテスト
- [x] タスク追加・編集・削除のテスト
- [x] スタイルの実装

### 2. タスクカードのテスト実装
- [x] レンダリングテスト
- [x] イベントハンドリングのテスト
- [x] 状態変更のテスト
- [x] スタイルの実装

### 3. プロジェクト一覧のテスト実装
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
