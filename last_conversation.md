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







# ChatGPT-o3 が、github のディレクトリを見て分析したレポート：


### 今回まとめて落ちている 3 系統のエラー

| エラーの種類 | 代表メッセージ | 原因 | 影響しているファイル数 |
|-------------|---------------|------|------------------------|
| **インポート解決失敗** | `Failed to resolve import "@/lib/supabase"` | Vitest が **「@/** エイリアスを解決できていない** | 21 本以上 |
| **`jest is not defined`** | `jest.mock(...` / `jest.fn()` | テストコードが **Jest API** を使っているが、ランナーは **Vitest** | 10 本以上 |
| **期待クラス不一致** | `Expected … toHaveClass("bg-emerald-500/15 …")` | UI コンポーネントの **実装とテスト仕様がズレ** | 1 本（Badge） |

> まずは **上２つの「環境設定ミス」** を片付けると、  
> 3 つ目の純粋な実装テストだけが残ります。

---

## 1. 「@/」エイリアスが効かない問題

### ✅ 対策手順

1. **`vitest.config.ts` を追加／修正**

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // Jest 互換 API も後述
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),      // ← apps/frontend/src
    },
  },
})
```

2. **`tsconfig.json` も合わせる**（エディタ補完用）

```jsonc
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

3. ルート構成が monorepo（`apps/frontend`）の場合は  
   `alias` を `path.resolve(__dirname, 'apps/frontend/src')` に。

---

## 2. Vitest で `jest.` を使う方法

### A. **最速回避**（設定 1 行）

`vitest.setup.ts`

```ts
import { vi } from 'vitest'

// Jest → Vitest 互換
globalThis.jest = vi as unknown as typeof jest
```

> これで **`jest.fn` / `jest.mock`** が動く。  
> （`globals: true` 設定必須）

### B. **理想的にはコードを書き替え**

- `jest.fn()` → `vi.fn()`
- `jest.mock()` → `vi.mock()`

> 専用 codemod で一括変換も可：  
> `npx jscodeshift -t https://gist.githubusercontent.com/…/jest2vi.js "apps/frontend/__tests__/**/*.ts*"`

---

## 3. 足りないファイル vs エイリアス

もし **`src/components/ui/checkbox.tsx`** などが実際に存在しない場合は 2 択。

1. **実装を追加**（本来あるべき UI コンポーネント）
2. 当面 **スタブ** でテストだけ通す

```tsx
// src/components/ui/checkbox.tsx
const Checkbox = () => null
export { Checkbox }
```

---

## 4. Badge テストだけが落ちる件

- 実装側で Tailwind クラスが `px-2.5` などに変更されたが  
  **テスト期待値が旧値 (`px-2`) のまま**。
- 実装を元に戻すか、テストを合わせるか決定して修正。

---

## 5. 優先順位付きロードマップ

| 優先 | 作業 | 期待効果 |
|------|------|----------|
| ★1 | `vitest.config.ts` と `tsconfig` に **alias** を設定 | 21 本の import エラー解消 |
| ★2 | `vitest.setup.ts` で **`globalThis.jest = vi`** | 10 本の `jest is not defined` 解消 |
| ★3 | `npm run test` で再実行 → 残った “ファイル実在しない” を確認 | 実装 or スタブ |
| ★4 | **Badge コンポーネント** 実装・テストを同期 | UI の単体テスト緑化 |
| ★5 | 試験的に **Jest→Vi 移行 codemod** を走らせ、手書き修正を減らす | 保守コスト削減 |

---

### コミット例

```bash
git checkout -b chore/vitest-alias-jestpolyfill
git add vitest.config.ts vitest.setup.ts tsconfig.json
git commit -m "chore: alias '@/'; jest polyfill for vitest"
```

これで **“落ちる前にまず環境を整える”** ステップは完了です。  
再度 `npm test` で、純粋な実装バグだけが残る状態にしてから
個別の UI／Hook テストを直していきましょう 🚀