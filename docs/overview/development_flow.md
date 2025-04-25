---
name: "docs/overview_0/development_flow.md"
title: "Commit Coach Development Flow – Monorepo (Next.js + Express)"
description: "pnpm workspace で管理するフロント (Next.js + TypeScript) とバック (Express + TypeScript) の開発ロードマップ。本文は概要、付録 A に 200 Step の詳細チェックリストを完全収録。"
version: "3.0"
last_updated: "2025-04-22"
---

# 開発手順書 – 要約＋付録詳細方式 (v3.0)

この文書は **分離型モノレポ (Next.js × Express) 方針の正式版** です。
旧版との差分を完全に吸収し、200 Step チェックリストを再整備しました。

 

---

## 1. 進捗サマリ（毎週更新）
| レイヤ | 完了 | 直近 TODO |
|--------|------|-----------|
| **共通基盤** | Step 0‑20 完了 (除Step 14) | Step 14: DevContainer設定 (任意) |
| **Frontend** | Step 21‑42 完了 | Step 43‑59: タスク管理UI & カンバンボード |
| **Backend** | Step 101‑137 完了 | Step 138‑140: 認証E2Eテスト |
| **品質/CI** | lint ✅ | unit/E2E テスト → CI グリーン化 |
| **デプロイ** | 未着手 | Step 181‑190: Docker & Fly.io |

> **更新方法**: Step を達成した PR で該当行を `[x]` に変更し、末尾に `(#PR番号)` を追記してください。

---

## 2. 作業フェーズ概要
### 2.1 共通基盤 (Step 0‑20)
モノレポ雛形・共有ツール・CI を整える段階。

### 2.2 フロントエンド (Step 21‑100)
認証 → ダッシュボード → Kanban & AI チャット → 品質・デプロイの 4 フェーズ。

### 2.3 バックエンド (Step 101‑200)
初期化 → DB/RLS → ルーティング&認証 → CRUD+AI → テスト → デプロイ → 運用。

---

## 3. 付録 A — **200 Step チェックリスト**
<details><summary>クリックして展開</summary>

```markdown
### 共通基盤 (0‑20)
- [x] **0**  Node.js 20.x & pnpm 9 インストール
- [x] **1**  `pnpm init` – ルート workspace package.json 生成
- [x] **2**  共有ツール (eslint, prettier, husky, lint‑staged) 導入
- [x] **3**  `pnpm dlx create-next-app` → apps/frontend 初期化
- [x] **4**  `pnpm create @express/api` → apps/backend 初期化
- [x] **5**  packages/shared-types で Zod スキーマ & tsup 設定
- [x] **6**  `pnpm-workspace.yaml` に apps/* & packages/* を登録
- [x] **7**  ルート ESLint / Prettier / CursorRules 設定
- [x] **8**  Husky & lint‑staged (`pre-commit`: fmt+lint)
- [x] **9**  GitHub Actions: install → lint → test ワークフロー
- [x] **10** 初回コミット `feat: bootstrap monorepo`
- [x] **11** apps/frontend `tsconfig.json` 調整
- [x] **12** Tailwind `tailwind.config.js` カスタムテーマ
- [x] **13** VSCode workspace 設定
- [ ] **14** DevContainer / Docker 開発環境 (任意)
- [x] **15** Conventional Commits チェック (commitlint)
- [x] **16** Dependabot / Renovate 設定
- [x] **17** `.editorconfig` 追加
- [x] **18** Issue & PR テンプレ作成
- [x] **19** CODEOWNERS 追加
- [x] **20** GitHub Discussions / Wiki 有効化

### フロントエンド (21‑100)
#### 3.1 認証 & ダッシュボード (21‑40)
- [x] **21** `/login` ページ – Email/PW フォーム
- [x] **22** `useAuth` Context (Supabase)
- [x] **23** JWT を Cookie 保存
- [x] **24** `/logout` 処理
- [x] **25** 認証ガード (Next.js middleware)
- [x] **26** `/register` & `/password/reset` ページ
- [x] **27** react-hook‑form + zod バリデーション
- [x] **28** ローディング & エラーメッセージ
- [x] **29** commit `feat(frontend): auth flow`
- [x] **30** RTL ユニットテスト(Auth)
- [x] **31** `/dashboard` 骨格 (de18e57a)
- [x] **32** AIチャットプレースホルダ (de18e57a)
- [x] **33** 今日のタスク / 期限間近カード (de18e57a)
- [x] **34** 時計 & mini‑calendar (de18e57a)
- [x] **35** レスポンシブ調整 (de18e57a)
- [x] **36** モックデータ (SWR) (de18e57a)
- [x] **37** UI アニメーション (de18e57a)
- [x] **38** commit `feat(frontend): dashboard` (de18e57a)
- [x] **39** ダッシュボードユニットテスト (de18e57a)
- [x] **40** コンポーネントユニットテスト (de18e57a)

#### 3.2 Kanban & リファクタ (41‑60)
- [x] **41** ダッシュボードコンポーネント分割 (de18e57a)
- [x] **42** `useTaskManagement` / `useDragAndDrop` hooks (de18e57a)
- [x] **43** 型定義強化 (Task, Project) (#TYPE_PR_ID)
- [x] **44** RTL + Cypress テスト追加
  - 実装完了：
    - EditableText.test.tsxの追加
    - useDragAndDrop.test.tsの修正
    - Cypressテストの自動実行スクリプトの追加
- [ ] **45** commit `refactor(frontend): split dashboard`
- [ ] **46** `/projects` 一覧 UI
- [ ] **47** 検索 & フィルタ
- [ ] **48** ページネーション / 無限スクロール
- [ ] **49** プロジェクト詳細 `/projects/[id]`
- [ ] **50** 詳細画面骨格
- [ ] **51** カンバンコンテナ
- [ ] **52** **dnd‑kit** 実装 (列/カード DnD)
- [ ] **53** タスク詳細モーダル
- [ ] **54** サブタスク折りたたみ
- [ ] **55** 期限・完了 UI
- [ ] **56** AI「タスク分解」ボタン(モック)
- [ ] **57** 期限切れスタイル
- [ ] **58** API モック → 本 API 切替
- [ ] **59** commit `feat(frontend): kanban`
- [ ] **60** レスポンシブ & ユニットテスト最終

#### 3.3 AIチャット & 設定 (61‑80)
- [ ] **61** サイドチャット UI
- [ ] **62** メッセージ送信即時描画
- [ ] **63** システムメッセージ表示
- [ ] **64** OpenAI 応答 (モック→実装)
- [ ] **65** モード切替タブ
- [ ] **66** 音声入力(将来)
- [ ] **67** 仮想リスト
- [ ] **68** `/api/v1/ai/coach` 接続
- [ ] **69** commit `feat(frontend): ai chat`
- [ ] **70** localStorage ログ保存

#### 3.4 品質 & デプロイ (81‑100)
- [ ] **81** Jest 単体テスト >80%
- [ ] **82** スナップショットテスト
- [ ] **83** フォーム異常値テスト
- [ ] **84** Cypress E2E (auth→dashboard)
- [ ] **85** Percy Visual diff
- [ ] **86** モバイルレスポンシブ shot
- [ ] **87** GitHub Actions CI 緑化
- [ ] **88** commit `test(frontend): coverage`
- [ ] **89** Lint/型エラーゼロ
- [ ] **90** Storybook ドキュメント
- [ ] **91** `next build` 確認
- [ ] **92** Vercel プロジェクト作成
- [ ] **93** `.env.production` 整備
- [ ] **94** 初回デプロイ
- [ ] **95** ダークモード最終
- [ ] **96** a11y (aria‑label)
- [ ] **97** Vercel 自動デプロイ GitHub Actions
- [ ] **98** commit `build(frontend): production ready`
- [ ] **99** バグ修正／パフォチューン
- [ ] **100** README / wiki 更新

### バックエンド (101‑200)
#### 4.1 初期化 (101‑110)
- [x] **101** apps/backend 生成
- [x] **102** `npm init -y`
- [x] **103** TypeScript, ESLint, Prettier 設定
- [x] **104** Express & ts-node-dev
- [x] **105** tsconfig
- [x] **106** 開発サーバースクリプト
- [x] **107** commit `feat(backend): init`
- [x] **108** .env.example 追加
- [x] **109** API 方針ドキュメント
- [x] **110** "Hello from Backend" ルート

#### 4.2 DB & マイグレーション (111‑120)
- [x] **111** Supabase プロジェクト作成
- [x] **112** `@supabase/supabase-js` 導入
- [x] **113** Prisma schema → `supabase db push`
- [x] **114** users / projects / tasks 他テーブル
- [x] **115** RLS ポリシー auth.uid() 制限
- [x] **116** 外部キー & Index
- [x] **117** `supabase/migrations` コミット
- [x] **118** 接続テスト
- [x] **119** トランザクション方針
- [x] **120** commit `chore(backend): db schema`

#### 4.3 ルーティング & 認証 (121‑140)
- [x] **121** `src/routes/index.ts` Router
- [x] **122** `/api/v1/users` CRUD
- [x] **123** `/api/v1/projects` CRUD
- [x] **124** Zod バリデーション MW
- [x] **125** GET `/projects` 実装
- [x] **126** POST `/projects` 実装
- [x] **127** GET `/tasks` 実装
- [x] **128** 共通 ErrorHandler JSON
- [ ] **129** commit `feat(backend): basic routes`
- [x] **130** CORS & morgan ログ
- [x] **131** JWT ミドルウェア
- [x] **132** POST `/auth/login`
- [x] **133** POST `/auth/signup`
- [x] **134** `/auth/logout`
- [x] **135** オーナーチェック MW
- [x] **136** 役割ベース guard
- [x] **137** 401/403 共通レスポンス
- [x] **138** 認証 E2E テスト
- [x] **139** commit `feat(backend): auth`
- [x] **140** 認証テスト pass

#### 4.4 CRUD & AI API (141‑170)
- [x] **141** projectController 実装
- [x] **142** taskService 実装
- [x] **143** createProject(userId, data)
- [x] **144** controller ↔ service 分離 (2025-04-25)
- [x] **145** GET `/projects` (owner only) (2025-04-25)
- [x] **146** PUT `/tasks/:id` (2025-04-25)
- [x] **147** try‑catch → ErrorHandler (2025-04-25)
- [x] **148** 所有権チェック (2025-04-25)
- [ ] **149** commit `feat(backend): controllers`
- [ ] **150** Service ユニットテスト
- [x] **151** POST `/ai/coach` (OpenAI)
- [x] **152** ユーザー別モデル設定取得
- [x] **153** OpenAI API 呼び出し
- [x] **154** タスク分解 API
- [x] **155** redis‑rate‑limit
- [x] **156** OpenAI エラーリトライ
- [x] **157** ai_messages テーブル保存
- [x] **158** レスポンスフォーマット確定
- [x] **159** commit `feat(backend): ai endpoints`
- [x] **160** AI API テスト

#### 4.5 テスト・デプロイ・運用 (171‑200)
- [ ] **171** Supertest 統合テスト雛形
- [ ] **172** 認証フロー統合テスト
- [ ] **173** CRUD 正常/異常系テスト
- [ ] **174** AI API モックテスト
- [ ] **175** 共通レスポンス型テスト
- [ ] **176** Jest カバレッジ >85%
- [ ] **177** pino ロガー導入
- [ ] **178** DB 例外 & 未知例外ハンドリング
- [ ] **179** commit `test(backend): coverage`
- [ ] **180** コードリファクタリング
- [ ] **181** Dockerfile (multi‑stage)
- [ ] **182** GitHub Actions: Docker build & push
- [ ] **183** Fly.io app 作成 & Secrets 登録
- [ ] **184** fly deploy
- [ ] **185** Supabase Realtime 設定 (任意)
- [ ] **186** ヘルスチェックエンドポイント
- [ ] **187** CloudWatch / Logtail 等監視
- [ ] **188** UptimeRobot 監視設定
- [ ] **189** commit `build(backend): deploy config`
- [ ] **190** 環境差分 (dev/stg/prod) 設定
- [ ] **191** Datadog/Sentry APM
- [ ] **192** DB バックアップスケジュール
- [ ] **193** npm 依存アップデートフロー
- [ ] **194** SLA / 障害対応手順書
- [ ] **195** 新機能影響調査テンプレ
- [ ] **196** コード & スキーマ定期リファクタ
- [ ] **197** データアーカイブ & レポート
- [ ] **198** レトロスペクティブ実施
- [ ] **199** commit `chore(backend): ops docs`
- [ ] **200** プロジェクト総括 & 次期ロードマップ策定
```

</details>

---

## 4. 改訂履歴
| Ver | 日付 | 変更概要 | 編集者 |
|-----|------|----------|--------|
| 3.0 | 2025‑04‑22 | docs を全面再生成。フロント dnd‑kit & 分離型構成を正式反映、200 Step を完備 | ChatGPT |

