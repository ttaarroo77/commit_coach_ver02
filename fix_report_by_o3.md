# fix_middleware_module_error.md
**目的**
- `Error: Cannot find the middleware module` を根本解決し、`apps/frontend` の Next.js サーバーを **正常起動** できるようにする
- ついでに以前出た `next-font-manifest.json` 欠損エラーの再発も防ぐ

---

## 1. 現状と問題点

| 事象 | 影響 | 推定原因 |
| --- | --- | --- |
| **Cannot find the middleware module** | アプリがビルド直後にクラッシュしページ表示不可 | ① monorepo 配下の *ルート外* に `middleware.ts` が存在<br>② `next.config.mjs` に *matcher* だけ残り、ビルド対象ファイルが無い<br>③ `middleware.ts` はあるが **export / config** が不正 |
| **next-font-manifest.json not found**（*過去*） | dev サーバー起動不可 | `.next/` キャッシュと実ファイル不整合 — これは **キャッシュ削除で収束済み** |

> **ブランチ**: [`fix/caret-always-visible`](https://github.com/ttaarroo77/commit_coach_ver02/tree/fix/caret-always-visible)
> `apps/frontend/middleware.ts` の有無／中身を必ず確認すること。

---

## 2. 対処方針

1. **Middleware の配置と export を正す**
   - Next.js は “プロジェクトルート直下” だけを探す
   - monorepo なら *各アプリのルート（`apps/frontend/`）* に置き、`basePath` を加味しない
2. **不要なら middleware を撤去**
   - 当面使わない認証リダイレクトなどならファイルごと削除し `next.config.mjs` の `matcher` を除去
3. **キャッシュを消して再ビルド**
   - `.next/` を削除 → `pnpm dev` で再生成
4. **Font Manifest 再発防止**
   - `next/font` で Google Font を使うと manifest が生成される
   - import ミスや font オプション typo があると発生 → ESLint で static import を強制

---

## 3. チェックリスト ✅

### 3-1. middleware の確認・修正

- [ ] `apps/frontend/middleware.ts` が存在するか確認
- [ ] **使う場合**
  ```ts
  // apps/frontend/middleware.ts
  import { NextResponse } from 'next/server'
  import type { NextRequest } from 'next/server'

  export function middleware(req: NextRequest) {
    // 例: 未ログインなら /login へ
    // if (!req.cookies.get('sb-access-token')) return NextResponse.redirect(new URL('/login', req.url))
    return NextResponse.next()
  }

  // ここを忘れると再びエラー
  export const config = { matcher: ['/((?!_next|favicon.ico).*)'] }
````

* [ ] **不要なら** `middleware.ts` を削除 → `next.config.mjs` から `experimental: { middlewareSourceMaps: … }` 等も消す
* [ ] ESLint に `no-empty-export` ルールがある場合 disable or export 有効化

### 3-2. monorepo 設定

* [ ] `package.json` の `next` スクリプトが `apps/frontend` をカレントに起動しているか確認

  ```json
  "scripts": { "dev": "next --turbo --root apps/frontend" }
  ```
* [ ] ルートに *誤って* `middleware.ts` が居ないか検索

  ```bash
  git ls-files | grep middleware.ts
  ```

### 3-3. キャッシュクリア & 動作確認

* [ ] `rm -rf apps/frontend/.next`
* [ ] `pnpm dev -F frontend`
* [ ] ブラウザで `localhost:3000` → 500 エラーが消えているか
* [ ] `pages/api` が 200 で応答するか (middleware の副作用チェック)

### 3-4. Font Manifest 再チェック

* [ ] `grep -R "next/font" apps/frontend` で font import を一覧
* [ ] すべて `const inter = Inter({ subsets: ['latin'] })` のように **オブジェクト引数**になっているか
* [ ] キャッシュを削除した状態で `pnpm dev` → manifest エラー再発しないことを確認

---

## 4. 事故りそうなポイント & 対策

| リスク                               | 対策                                                                       |
| --------------------------------- | ------------------------------------------------------------------------ |
| **middleware 削除で認証が無効**           | 代替として `route.ts` (Edge Functions) か `@supabase/auth-helpers/nextjs` でガード |
| **config.matcher が多すぎてパフォーマンス低下** | 必要最小限のパスに限定；API ルートを除外 (`/api/(.*)` を否 matcher)                          |
| **monorepo ルートで二重ビルド**            | root `middleware.ts` が残っていると再発 → CI で `pnpm turbo run lint` 時に検知         |

---

## 5. 次のアクション

1. **fix/middleware-module** ブランチを切る
2. チェックリスト実行 → commit (lint/format pass)
3. GitHub PR → Vercel Preview & Playwright smoke test
4. main へマージ後 **タグ `v0.3.1`** としてリリース

---

> **メモ**
> 以前の `next-font-manifest.json` エラーは「古い .next キャッシュ＋ font import typo」の複合。<br>
> 今回の再ビルドで manifest も再生成されるため同時にクリーンアップされる。
