# フロントエンド全面置き換えリファクタリング計画

> **目的**
> 既存リポジトリ `commit_coach_ver02` のフロントエンドを、v0 で開発した新 UI（shadcn/ui + App Router 構成）に段階移行し、コード品質・UX・開発体験をすべて底上げする。

---

## 1. 基盤技術の揃え直し

* [x] **Next.js 14 / App Router に統一**
  既存プロジェクトは同バージョン。互換性確認済み。
* [ ] **shadcn/ui の導入** (`npx shadcn@latest init`)
* [ ] **Tailwind 設定のマージ**

  * [ ] `tailwind.config.ts` の `theme.extend` と `plugins` を統合
  * [ ] `globals.css` に CSS 変数と `@layer utilities` を追加

## 2. ディレクトリ構造整備

* [ ] `components/ui/*` : shadcn 生成物を格納
* [ ] `components/` : アプリ固有ロジックに限定
* [ ] `hooks/` と `lib/` の境界をドキュメント化
* [ ] Storybook or Ladle 導入検討（UI カタログ化）

## 3. 段階移行フェーズ

| Phase | スコープ                                          | Exit Criteria                  |
| ----- | --------------------------------------------- | ------------------------------ |
| **0** | Kick‑off & リポジトリ整備                            | `feat/v0-frontend` ブランチ作成・CI 緑 |
| **1** | **UI Kit 移植**                                 | shadcn/ui コンポーネントでビルド成功        |
| **2** | **Page 移植** (`app/dashboard`, `app/projects`) | 旧 UI と同機能が動作・E2E 通過            |
| **3** | **結線** Supabase/Auth/ミドルウェア                   | 認証フローを含む回帰テスト完了                |
| **4** | **Polish & QA**                               | Lighthouse ⩾ 90 / Axe 零エラー     |

## 4. パフォーマンス & UX

* [ ] CSS‑only hover 表示（`group-hover`）で再レンダ回避
* [ ] `react-window` によるリスト仮想化検証
* [ ] Lazy load heavy libs (`react-beautiful-dnd`)

## 5. テスト&品質

* [ ] **Unit**: `vitest` + `@testing-library/react`
* [ ] **Integration**: Supabase stub を使った hooks テスト
* [ ] **E2E**: `Playwright` シナリオ（ログイン→ダッシュボード）
* [ ] **Lint/Format**: eslint‑plugin‑tailwindcss / prettier-tailwind

## 6. DevOps / CI

* [x] GitHub Actions で pnpm cache
* [ ] PR ごとに Vercel Preview
* [ ] Dependabot + Renovate 併用ルール

## 7. ドキュメント

* [ ] `docs/architecture.md` : Flux vs Context, data‑flow 図
* [ ] Swagger/OpenAPI 更新（バックエンドに合わせる）
* [ ] Migrations ガイド (`docs/migration_to_v0.md`)

## 8. コマンド & 自動化

* [ ] `pnpm dlx @shadcn/ui@latest add <component>` スクリプト化
* [ ] VS Code Task: `Generate Component from v0.dev` （社内 CLI）

---

### 進捗トラッキング

* [x] **Kickoff** — 2025‑05‑11
* [ ] Phase‑1 完了
* [ ] Phase‑2 完了
* [ ] Phase‑3 完了
* [ ] Release 🚀

---

> **備考**
> `npx shadcn@2.3.0 add <v0-url>` は URL 内に複数ファイルを含むためエラーとなる。ZIP を手動展開し、足りない UI パーツのみ `shadcn add` で個別追加する。
