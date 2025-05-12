## ⚡️概要 ―「ZIP を展開して `apps/frontend` を動かす」流れ

1. **ZIP を展開**して `repo/apps/frontend/` に丸ごとコピーする
2. **ワークスペース設定**（package.json / pnpm-workspace.yaml / turbo.json）に `apps/frontend` を追加
3. **依存パッケージをインストール**
4. **Tailwind・Next.js の設定ファイルをパス修正**
5. **環境変数 `.env.local`** を `apps/frontend` 内に置く
6. `pnpm dev --filter frontend` で起動 → ブラウザで確認
7. すべて動いたら **コミット ➜ PR**

---

## ✅ 詳細チェックリスト（コピーして Issue に貼れる形式）

### 0. 事前

* [ ] **バックアップブランチ** `git checkout -b backup/pre-frontend-v0`
* [ ] ZIP を `~/Downloads/commit-coach-v0.zip` に解凍

---

### 1. ファイル配置

```bash
# repo ルート
rm -rf apps/frontend            # 古いフロントがある場合
mkdir -p apps
cp -R ~/Downloads/commit-coach-v0 apps/frontend
```

* [ ] `apps/frontend/app/page.tsx` が存在することを確認
* [ ] `apps/frontend/package.json` は **不要**なので削除（トップレベル共有）

---

### 2. モノレポ設定

#### 2-1. `package.json` (root)

```jsonc
{
  "name": "commit-coach",
  "workspaces": [
    "apps/frontend",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev --filter=frontend",   // ← 追加
    "build": "turbo run build --filter=frontend"
  }
}
```

* [ ] workspaces に `apps/frontend` が入っている
* [ ] dev / build script が frontend を指す

#### 2-2. `pnpm-workspace.yaml` がある場合

```yaml
packages:
  - apps/frontend
  - packages/**
```

---

### 3. 依存インストール

```bash
pnpm install
pnpm add lucide-react sonner clsx zod react-beautiful-dnd -w          # 既にあればスキップ
pnpm add -D tailwind-merge prettier-plugin-tailwindcss -w
```

* [ ] `node_modules` がルートに 1 つだけできる

---

### 4. Tailwind / Next.js 設定

#### 4-1. `apps/frontend/tailwind.config.ts`

* [ ] `content` に **相対パス**だけが並んでいるか

  ```ts
  export default {
    content: [
      "./app/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}"
    ],
    plugins: [require("tailwindcss-animate")]
  } satisfies Config;
  ```

#### 4-2. `apps/frontend/next.config.mjs`

* [ ] ルート alias が必要なら追記

  ```js
  import path from "node:path";
  export default {
    experimental: { appDir: true },
    webpack(cfg) {
      cfg.resolve.alias["@"] = path.resolve(__dirname);
      return cfg;
    }
  };
  ```

---

### 5. 環境変数

```bash
cp .env.local apps/frontend/.env.local        # 既存の Supabase キーをコピー
```

* [ ] `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しい

---

### 6. ローカル起動

```bash
pnpm dev --filter frontend
```

* [ ] `http://localhost:3000` で Dashboard / Projects が描画
* [ ] ターミナルにエラーが出ていない

---

### 7. QA & コミット

* [ ] 主要ページをクリックで回り、404 や 500 がない
* [ ] `pnpm lint` で ESLint エラー 0
* [ ] `git add .` → `git commit -m "feat: replace frontend with v0 UI"`
* [ ] `git push -u origin feature/v0-frontend` → Pull Request 作成

---

## 🛠️ もしハマったら…

| 症状                          | 原因と対処                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **スタイル崩れ／真っ白**              | `tailwind.config.ts` の `content` に `apps/frontend/**` が無い → 追加して再ビルド                |
| **`window is not defined`** | SSR で `react-beautiful-dnd` が呼ばれている → `dynamic(() => import(\"…\"), { ssr:false })` |
| **依存の競合 (peer conflict)**   | root にだけ依存を入れ直し、`rm -rf node_modules && pnpm install`                               |
| **環境変数が読めない**               | `.env.local` を `apps/frontend` に置き忘れ → コピー                                          |

このチェックリスト通りに進めれば、**ZIP → apps/frontend** への移行が安全に完了します。
