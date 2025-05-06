---
id: architecture
version: 2025-05-06
title: コミットコーチ – システムアーキテクチャ & DevOps (Dynamic Routing Edition)
owner: commit_coach_team
stakeholders: [dev_team, product_manager]
tasks_note: 必ず、完了したタスクには[x]印をつけ、このドキュメントへ報連相を残すこと
---

# コミットコーチ – ダイナミックルーティング対応モノレポ設計

## 変更概要 ★NEW

| 項目                 | v0 (静的構造)                                                  | v1 (動的構造)                                                                           |
| ------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Next.js ルーティング** | `/projects/design`, `/projects/mobile-app` …<br>それぞれ静的フォルダ | `/projects/[slug]` **動的セグメント**で無限追加可<br>`generateStaticParams()` + ISR で SEO と高速化両立 |
| **Dashboard**      | `/dashboard` Client Only                                   | `/(dashboard)/page.tsx` **Server Component** + `dashboard-client.tsx`               |
| **タスク・プロジェクト ID**  | 画面メモリのみ                                                    | URL パラメータ or Supabase PK                                                            |
| **D\&D ライブラリ**     | react‑beautiful‑dnd (Archive 2025‑04)                      | **@hello‑pangea/dnd** (API互換)                                                       |

> **目的**: 採用ポートフォリオとして「動的ルーティング・Server Actions・型安全」を示しつつ、実装コストを最小化する。

---

## 技術スタック概要

- **フロントエンド**: Next.js 15 App Router + TypeScript + Tailwind CSS + shadcn/ui
  - Server Component + Client Component ハイブリッド
  - Dynamic Route: `/projects/[slug]`, nested routes `/projects/[slug]/tasks/[taskId]`
- **バックエンド**: Express 5 + TypeScript + Supabase SDK
- **共有パッケージ**:
  - shared-types: Zod schemas for task/project data models
  - ai-coach: AI coaching logic and prompts
- **データ永続 (MVP)**: `localStorage` → **将来 Supra**base 移行を前提
- **D\&D**: @hello‑pangea/dnd (同一 API / SSR friendly)
- **デプロイ先**:
  - フロントエンド: Vercel
  - バックエンド: Fly.io

## ディレクトリ構造（Dynamic 最終形）

```plaintext
commit_coach/
├── apps/
│   ├── frontend/                   # Next.js
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx             # Landing
│   │   │   │   ├── (dashboard)/         # Route Group – URL は /dashboard
│   │   │   │   │   └── page.tsx         # SSR Dashboard
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx         # 一覧 & 新規作成
│   │   │   │   │   ├── [slug]/          # **動的プロジェクト**
│   │   │   │   │   │   ├── layout.tsx   # プロジェクト共通レイアウト
│   │   │   │   │   │   ├── page.tsx    # タスクボード (Kanban など)
│   │   │   │   │   │   ├── settings/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── tasks/
│   │   │   │   │   │       ├── [taskId]/page.tsx   # タスク詳細モーダル/ページ
│   │   │   │   │   └── (group)/[slug]/...          # 任意階層 Route Group
│   │   │   │   └── api/                             # Route Handlers / Server Actions
│   │   │   │       └── projects/[slug]/route.ts     # 例: POST 新規タスク
│   │   │   ├── components/
│   │   │   │   ├── providers/drag-provider.tsx      # D&D SSR 対応
│   │   │   │   └── ui/…
│   │   │   ├── hooks/, lib/, context/ …
│   │   └── public/
│   │
│   └── backend/                    # Express (変更なし)
│       └── …
│
├── packages/
│   ├── shared-types/               # Zod schemas – Route ･ DB 共通
│   ├── ui-kit/
│   └── config/
│
├── docs/
│   └── architecture.spec.md        # ← **このドキュメント**
└── … (略)
```

### 主要ファイル差分

| 旧                                                | 新                                                  | 説明                                   |
| ------------------------------------------------ | -------------------------------------------------- | ------------------------------------ |
| `apps/frontend/src/app/projects/design/page.tsx` | `apps/frontend/src/app/projects/[slug]/page.tsx`   | 3 つの静的ページを 1 つに統合し `params.slug` で分岐 |
| ―                                                | `apps/frontend/src/app/projects/[slug]/layout.tsx` | プロジェクト共通サイドバー / ナビを集約                |
| `/dashboard/page.tsx` (ClientOnly)               | `(dashboard)/page.tsx` + `dashboard-client.tsx`    | Server ↔ Client 分離 / CSR fallback    |

---

## 関連ドキュメント

- **docs/overview/**: 公式プロジェクトドキュメント
  - `architecture.spec.md`: アーキテクチャ仕様（本ドキュメント）
  - `development_flow.md`: 開発フロー

- **cleanup_plan/**: プロジェクト整理計画
  - `cleanup_strategy.md`: 全体的な整理方針
  - `frontend_cleanup.md`: フロントエンド整理手順
  - `backend_cleanup.md`: バックエンド整理手順
  - `project_structure_cleanup.md`: プロジェクト構造整理手順
  - `execution_checklist.md`: 実行チェックリスト

**注意**: `www_extra.md`ディレクトリには古いドキュメントが含まれており、参照用として保持されていますが、最新の情報は上記の公式ドキュメントを参照してください。
  - エッジ関数: Supabase Edge Functions

## Server Actions & Data Flow

```mermaid
graph TD
  A[UI 操作] -->|useTransition| B[Server Action]
  B -->|Supabase SDK| C[(Postgres)]
  C --> D[revalidatePath('/dashboard')]
  D --> A
```

* Server Action は `apps/frontend/src/app/(dashboard)/actions.ts` に集約。
* **型安全**: 引数 / 戻り値は `shared-types` の Zod 型を import。

## 非機能要件

- **URL シェア**: `/projects/design` → OK、存在しない slug は 404。
- **パフォーマンス**: 初回表示 200 ms LCP (Vercel Edge Cache + ISR)。レスポンス時間 <=500ms、同時接続 1000
- **アクセシビリティ**: 動的ページでも ARIA ランドマーク維持。
- **セキュリティ**: JWT認証、Supabase RLS、OWASP top-10対策
- **監視**: HTTPログ、Supabaseログ、Sentry、Vercel Analytics

## 開発ガイドライン

- **CI/CD**: GitHub Actions (lint, test, build, deploy)
- **コードスタイル**: eslint + prettier + commitlint
- **ブランチ戦略**: trunk-based with short-lived feature branches
- **UIフレームワーク**: Tailwind CSS + shadcn/ui

## 環境変数

- **グローバル**: NODE_ENV, SUPABASE_URL
- **フロントエンド**: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, OPENAI_API_KEY
- **バックエンド**: SUPABASE_SERVICE_KEY, PORT, OPENAI_API_KEY, JWT_SECRET

## DevOps 追記

* **Supabase プレビュー DB** を Vercel Preview と紐付け (`SUPABASE_REF` 分岐)。
* GitHub Actions ワークフローは旧版を流用。`matrix.app` に `edge` を追加。
* Turborepo `pipeline.build.outputs` へ `.next/app-*/**` を追加し、ISR キャッシュを共有。

## マイグレーション手順

1. **フォルダ移動**

   ```bash
   mv apps/frontend/src/app/projects/design apps/frontend/src/app/projects/[slug]
   ```

   重複する `page.tsx` の内容を統合して `params.slug` で switch。
2. **generateStaticParams() 追加**
   DB 未接続の間はハードコード配列 `["design","mobile-app","web-app"]` を返す。
3. **Dashboard 分割**

   * 既存 `page.tsx` を `dashboard-client.tsx` へコピーし "use client" 行を残す。
   * 親 `page.tsx` (Server) で `import initialGroups from '../sample-data'`。
4. **D\&D 置換**

   ```bash
   pnpm add @hello-pangea/dnd
   ```

   import 行を差し替えるだけで動作。

## 今後の拡張候補

* `/workspace/[workspaceId]/projects/[slug]` にスコープを広げ、多人数コラボを実装。
* Drizzle ORM で DB スキーマ → Zod 型自動生成 (drizzle‑zod)。
* Suspense‐friendly AI コーチング (RSC+Streaming) に刷新。

---

# AIサービス

### 1. サービス概要
- 本プロジェクトではOpenAI GPT-4 APIを利用したAIコーチング機能を提供。
- ユーザーのタスク進捗やプロジェクト管理をAIがサポート。

### 2. システム構成
- バックエンド（Express）からOpenAI APIを呼び出し、フロントエンド（Next.js）経由でユーザーに応答。
- APIキーはサーバー側で安全に管理。
- AI応答はDB（ai_messagesテーブル）に保存し、履歴管理・再利用を実現。

### 3. 主なAPIエンドポイント
- `POST /api/v1/ai/coach` : タスク進捗や質問をAIに投げて応答を取得
- `GET /api/v1/ai/messages` : 過去のAI応答履歴を取得

### 4. プロンプト設計方針
- ユーザーの入力内容・タスク状況・過去のAI応答履歴をもとにプロンプトを動的生成
- プロンプトテンプレートは`packages/shared-prompts`で管理
- ユーザーごとにパーソナライズされた応答を目指す

### 5. 運用・セキュリティ
- OpenAI APIキーは環境変数で管理し、フロントエンドには絶対に露出しない
- レートリミット・エラーハンドリングを徹底
- AI応答の品質・安全性を定期レビュー

### 6. 今後の拡張案
- LLMの切り替え（Anthropic Claude等）やマルチエージェント対応
- ユーザーごとのAIパーソナライズ設定
- AIによる自動リマインド・進捗サマリ生成

---

*Last updated: 2025‑05‑06 (by ChatGPT draft)*