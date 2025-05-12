# commit-coach – v0 Frontend

> **TL;DR**: このフォルダは **shadcn/ui + Next.js App Router** で生成した“新 UI”の雛形です。既存リポジトリ (`commit_coach_ver02`) へ合流する際は ➊ UI キット導入 → ➋ `components/ui` と `app/` をコピー → ➌ Tailwind 設定をマージ の 3 ステップ。下記ガイドを読めば LLM でも即座に移行作業を開始できます。

---

## 1. ざっくり全体像

| 層                       | 主なフォルダ                                  | 役割                                           |
| ----------------------- | --------------------------------------- | -------------------------------------------- |
| **Pages**               | `app/`                                  | ルーティングとページ UI。App Router 構成。                 |
| **Reusable Components** | `components/`                           | ドメイン特化コンポーネント（AI Chat, Task UI など）。          |
| **UI Kit**              | `components/ui/`                        | **shadcn/ui** 自動生成コンポ。Tailwind Utility Only。 |
| **Hooks / Lib**         | `hooks/`, `lib/`                        | カスタムフック・ユーティリティ。API 呼び出しはここ。                 |
| **Config**              | `tailwind.config.ts`, `next.config.mjs` | ビルド / スタイル設定。                                |

![](public/placeholder.jpg) <!-- イメージの例 -->

---

## 2. 主要ページ

| ルート              | ファイル                         | 説明                       |
| ---------------- | ---------------------------- | ------------------------ |
| `/dashboard`     | `app/dashboard/page.tsx`     | 今日／未定タスクのカンバン＋ドラッグ＆ドロップ。 |
| `/projects`      | `app/projects/page.tsx`      | プロジェクト一覧。タスクグループ折りたたみ可能。 |
| `/projects/[id]` | `app/projects/[id]/page.tsx` | 個別プロジェクト詳細（AI チャット併設）。   |

> **NOTE**: どのページも **Server Components = 0**。全てクライアントコンポーネントなので既存 Supabase Hooks をそのまま移植できます。

---

## 3. セットアップ & 動作確認

```bash
pnpm install      # 依存解決
pnpm dev          # http://localhost:3000
```

* **バックエンド無し**で動くモックデータを `lib/*-utils.ts` に内蔵。
* 実際の Supabase テーブルに繋ぐ場合は `lib/supabase.ts` を上書き。

---

## 4. 既存リポジトリへのマージ手順

1. **ブランチ作成**: `git checkout -b feat/v0-frontend`
2. **shadcn Init**: `npx shadcn@latest init`（既存リポで未実行の場合）
3. **ファイルコピー**

   ```bash
   cp -r app components styles tailwind.config.ts <既存リポ>
   cp -r public/* <既存リポ>/public/
   ```
4. **依存追加**

   ```bash
   pnpm add lucide-react sonner clsx zod react-beautiful-dnd
   ```
5. **Tailwind Merge** – 既存 `tailwind.config.ts` に `plugins: [require("tailwindcss-animate")]` を追記。
6. `pnpm dev` → コンソールエラーを潰せば移行完了。

---

## 5. よくハマるポイント

| 罠                             | 症状                                      | 回避策                                       |
| ----------------------------- | --------------------------------------- | ----------------------------------------- |
| **shadcn plugin 無し**          | `@tailwind base` の CSS 変数が解決しない → 画面真っ白 | globals.css の `:root` 変数を必ずコピー            |
| **`react-beautiful-dnd` SSR** | `window is not defined`                 | `dynamic(import(...), { ssr:false })` ラップ |
| **Tailwind Purge**            | クラスが適用されずレイアウト崩壊                        | `content` パスに `./app/**/**` を含める          |
| **動的ルート競合**                   | 旧 `pages/` 世代コードと衝突                     | 旧ページを削除 or `_bak` 退避                      |

---

## 6. スクリプト集

| コマンド                             | 目的                     |
| -------------------------------- | ---------------------- |
| `pnpm dlx @shadcn/ui add button` | 追加 UI コンポ生成            |
| `pnpm lint`                      | ESLint + Tailwind 並べ替え |
| `pnpm test`                      | Vitest (未設定なら追加推奨)     |

---

## 7. ファイル構成早見表

```text
app/            ページルーティング
components/     ドメイン固有コンポ
 └─ ui/         shadcn 生成 UI
hooks/          再利用フック
lib/            Supabase & Utility
styles/         globals.css
public/         画像・アイコン
```

---

### 8. 継続タスク（TODO）

* [ ] Storybook (または Ladle) で UI カタログ公開
* [ ] `Playwright` E2E（ダッシュボード / プロジェクト CRUD）
* [ ] ESLint config に `plugin:tailwindcss/recommended` を追加

---

## Contact

* **メンテナ**: @nakazawatarou (Slack: #commit-coach)
* **最終更新**: 2025-05-11
