<!-- scratchpad.md : 2025-04-30 更新 -->

開発ロードマップとスクラッチパッドを確認し、同時並行で進められるタスクを洗い出します。

### 同時並行タスク一覧

#### 1. フロントエンド開発（cursor担当）
- [ ] **コンポーネントのテスト実装（Step 40）**
  - [ ] カンバンボードのテスト実装
  - [ ] タスクカードのテスト実装
  - [ ] プロジェクト一覧のテスト実装

#### 2. バックエンド開発（windsurf担当）
- [ ] **Docker & Fly.io セットアップ（Step 181-185）**
  - [ ] Dockerfileの作成
  - [ ] コンテナ化の設定
  - [ ] Fly.ioデプロイ設定
  - [ ] 環境変数の管理
  - [ ] CI/CDパイプラインの設定

#### 3. フロントエンド開発（windsurf担当）
- [ ] **プロジェクト詳細ページの修正（Step 60.2）**
  - [ ] Timelineコンポーネントの修正
  - [ ] レイアウトとデータ表示の改善
  - [ ] 型エラーの修正

#### 4. フロントエンド開発（windsurf担当）
- [ ] **切れているリンク・画面の修正（Step 60.4）**
  - [ ] ナビゲーションリンクの確認と修正
  - [ ] 404エラーページの特定と修正
  - [ ] ルーティングの最適化

#### 5. フロントエンド開発（windsurf担当）
- [ ] **パスエイリアス問題の修正（全ファイル）**
  - [ ] `@/`パスエイリアスの相対パスへの変換
  - [ ] 特に`useProjects.ts`の修正
  - [ ] 型定義ファイルのパス修正

### タスクの優先順位と担当者

1. **最優先タスク**
   - [ ] cursor: コンポーネントのテスト実装（Step 40）
   - [ ] windsurf: Docker & Fly.io セットアップ（Step 181-185）

2. **次優先タスク**
   - [ ] windsurf: プロジェクト詳細ページの修正（Step 60.2）
   - [ ] windsurf: 切れているリンク・画面の修正（Step 60.4）

3. **並行して進めるタスク**
   - [ ] windsurf: パスエイリアス問題の修正

### 進捗管理
- 各タスクの進捗は`skratchpad.md`で管理
- 完了したタスクは[x]でマーク
- 重要な進捗は開発ロードマップにも反映

これらのタスクを同時並行で進めることで、開発効率を向上させることができます。各担当者が自分のタスクに集中しつつ、必要に応じて連携を取りながら進めていきます。







# ChatGPT-o3 が、github のディレクトリを見て分析したレポート： vol.1

### 🐞 いま起きていること — 一行まとめ
`npm run dev` → **Next.js の App Router が 500 (Internal Server Error)**  
原因は **Server Component として解釈された `LinkValidator.tsx` が `document` を触りに行き、`document is not defined` でクラッシュ**。

---

## 1. エラーを再現してログを確認する手順
```bash
cd commit-coach/apps/frontend
pnpm install          # 依存関係をそろえる
pnpm dev              # = turbo run dev
#  ➜ ブラウザで http://localhost:3000 を開くと 500
#  ➜ ターミナルには
#    ReferenceError: document is not defined
#      at getAllLinks …/components/LinkValidator.tsx:11:23
```
詳しく見ると **stack‐trace の先頭が `components/LinkValidator.tsx`** になっています。 ([commit_coach_ver02/apps/frontend/components/LinkValidator.tsx at feat/unsafe-analysis · ttaarroo77/commit_coach_ver02 · GitHub](https://github.com/ttaarroo77/commit_coach_ver02/blob/feat/unsafe-analysis/apps/frontend/components/LinkValidator.tsx))  

---

## 2. 根本原因
| 誤っているポイント | なぜ問題になるか |
|-------------------|----------------|
| `LinkValidator.tsx` の 1 行目に `\'use client\'` が無い | App Router では **“`use client` が無い ⇒ Server Component”** と見なされるため、SSR 中に `document` アクセスで落ちる |
| `lib/utils/linkValidation.ts` でも `document` を直接参照 | こちらは `LinkValidator` の子なので、親が Client 化されれば解決 |
| （副次的）未使用の `NextRouter` import | ビルド警告になるだけだが、この機会に削除推奨 |

> **公式仕様**  
> `use client` を付けると、そのファイルと子孫はクライアント側で実行され、`document` や `window` が使えるようになる。 ([Directives: use client - Next.js](https://nextjs.org/docs/app/api-reference/directives/use-client?utm_source=chatgpt.com), [Rendering: Client Components - Next.js](https://nextjs.org/docs/app/building-your-application/rendering/client-components?utm_source=chatgpt.com))  
> 付け忘れると “`document is not defined`” エラーになる典型例。 ([use client throwing "ReferenceError: document is not defined" when ...](https://github.com/vercel/next.js/issues/44014?utm_source=chatgpt.com))  

---

## 3. 修復ステップ（所要 3 分）

1. **`apps/frontend/components/LinkValidator.tsx`** の先頭に下記 1 行を追加  
   ```ts
   'use client'
   ```
2. **未使用 import を削除**  
   `lib/utils/linkValidation.ts` 先頭の  
   ```ts
   import { NextRouter } from 'next/router'
   ```  
   を削除（App Router では `next/navigation` 系を使う）。
3. **開発サーバを再起動**  
   ```bash
   pnpm dev
   # ✔︎ 500 が消え、トップページが表示される
   ```
4. **ユニットテスト（任意）**  
   ```bash
   pnpm test # = turbo run test (Vitest)
   ```

---

## 4. 追加チェックリスト（ハマりがちなポイント）

| チェック項目 | メモ |
|--------------|------|
| **Supabase の環境変数** | `lib/supabase.ts` は URL / ANON_KEY が無いと throw します。開発時は `.env.local` にダミーでも良いので<br>`NEXT_PUBLIC_SUPABASE_URL=http://localhost`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy` を必ず置く。 ([commit_coach_ver02/apps/frontend/lib/supabase.ts at feat/unsafe-analysis · ttaarroo77/commit_coach_ver02 · GitHub](https://github.com/ttaarroo77/commit_coach_ver02/blob/feat/unsafe-analysis/apps/frontend/lib/supabase.ts)) |
| **Client 専用ロジック** | `window`, `document`, `localStorage` 等を触るコンポーネントは必ず `'use client'` を書くか、`dynamic(() => import('./X'), { ssr: false })` で遅延読込する |
| **Router API** | App Router では `next/router` ではなく `next/navigation` (`useRouter`, `redirect` など) |
| **Turbo / Pnpm** | Node 20 以上 + pnpm 8.9 以上を推奨（`packageManager` フィールドと合わせる） |

---

## 5. まとめ
1. **`LinkValidator.tsx` を Client Component に変更**（ `'use client'` 追加）。  
2. これで `document is not defined` が解消 → **Internal Server Error が消える**。  
3. Supabase 環境変数など、他のクラッシュ要因も `.env.local` で事前に潰しておくと再発防止になる。

以上の対処で **ローカル開発を再開**できます。お疲れさまでした！





# ChatGPT-o3 が、github のディレクトリを見て分析したレポート： vol.2
## 🔍 どのファイルを **cat** で確認すべきか ─ 早見表

| 優先度 | 場所 | 目的 | 代表的な `cat` コマンド例 |
|--------|------|------|---------------------------|
| ★★★ | **リポジトリ直下** | ルートの Babel 設定があれば **Next.js 全体が Babel モードに落ちる** | `cat .babelrc\ncat babel.config.js` |
| ★★★ | **apps/frontend/** | アプリ単体でも Babel 設定があるか確認 | `cat apps/frontend/.babelrc\ncat apps/frontend/babel.config.js` |
| ★★☆ | **packages/** や **config/** | Turborepo で共有 Babel 設定を置くケース | `cat packages/*/babel*.{js,ts,mjs}` |
| ★★☆ | **apps/frontend/next.config.{js,mjs}** | `compiler:` セクション／`swcMinify` の有無確認 | `cat apps/frontend/next.config.mjs` |
| ★☆☆ | **font を import しているコンポーネント** | 誤インポート・旧 API 使用を探す | `grep -R "next/font/google" apps/frontend/src` |

> **ポイント**  
> `next/font/google` は **Next.js の SWC コンパイラ前提**。  
> いずれか 1 つでも Babel 設定ファイルが存在すると **Next.js は自動的に Babel ルートへフォールバック**し、  
> `Syntax error: "next/font" requires SWC although Babel is being used …` が発火します。  ([Resolving "Babel and `next/font` Conflict" in Next.js](https://nextjs.org/docs/messages/babel-font-loader-conflict?utm_source=chatgpt.com), [[NextJS] next/font" requires SWC although Babel is being used due ...](https://github.com/facebook/stylex/issues/190?utm_source=chatgpt.com), ["next/font" requires SWC although Babel is being used due to a ...](https://stackoverflow.com/questions/75959591/next-font-requires-swc-although-babel-is-being-used-due-to-a-custom-babel-conf?utm_source=chatgpt.com), [Styled Components and Babel Using Error : r/nextjs - Reddit](https://www.reddit.com/r/nextjs/comments/101bto2/styled_components_and_babel_using_error/?utm_source=chatgpt.com))  


---

## 🛠️ 推定される修正パターン

### ✅ もっとも確実：**Babel 設定ファイルをプロダクションから無くす**

1. **バックアップを取る**  
   ```bash
   git mv .babelrc .babelrc.backup || true
   git mv babel.config.js babel.config.backup.js || true
   ```
2. **開発サーバ再起動**  
   ```bash
   cd apps/frontend
   pnpm dev
   ```
   *エラーが消えれば根本解決*。  
   Storybook や Jest だけ Babel が要る場合は **環境変数で分岐**するか各ツール固有の Babel 設定に閉じ込めます。

### ⚙️ Babel を残す必要がある場合

| ステップ | 内容 |
|----------|------|
| 1 | **すべての Babel 設定で `presets: ['next/babel']` を最上位に置く**<br/>```js\nmodule.exports = { presets: ['next/babel'], plugins: [/* 必要最低限 */] }\n``` |
| 2 | **Next.js 側で SWC を明示的に有効化**（`next.config.js`）<br/>```js\nmodule.exports = { compiler: { swcMinify: true } }\n``` |
| 3 | **フォントローダーを触る Babel プラグインを外す**<br/>たとえば `babel-plugin-react-native-web` や `module-resolver` が `next/font` import を書き換えていないか確認 |
| 4 | **Storybook／Jest から分離**<br/>`.babelrc` → `.babelrc.test` にリネームし、各ツール側で `--config-file` 指定 |

---

## ✍️ 具体的な差分サンプル（Option: Babel config 削除）

```diff
- // .babelrc
- {
-   "presets": ["next/babel"],
-   "plugins": ["styled-components", "module-resolver"]
- }
+ // ← プロジェクト直下から削除
```

```diff
// next.config.mjs
export default {
-  // 他項目...
+  compiler: {
+    // SWC で styled-components を使いたい場合だけ
+    styledComponents: true
+  }
}
```

---

## 🧪 動作確認チェックリスト

1. `npm run dev` で **font エラーが消えることを確認**  
2. ページでフォントが適用されていれば OK  
3. `next build && next start` でも同様にビルドが通るか確認  
4. Storybook / Jest を使うなら、それぞれコマンドを実行し Babel 設定が機能するか確認  

---

## まとめ

- **cat で観察すべきは Babel 設定ファイル群と `next.config.*`。**  
- `next/font/*` は SWC 前提なので、**Babel を残すと競合**します。  
- 最速解消は **Babel 設定をプロダクションビルドから排除**し SWC に一本化。  
- Babel が必要な場合は **`presets: ['next/babel']` をトップに置き、フォントとかち合うプラグインを外す**。  

これで **Next.js のフォントローダー × Babel 競合問題**は解決できるはずです。頑張ってください！
