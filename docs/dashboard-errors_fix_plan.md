# dashboard-errors_fix_plan.md
**目的**：

1. **Duplicate key `project-2`** ― ダッシュボードへ同じ `id` のプロジェクトが 2 回挿入される
2. **Hydration Mismatch** ― サーバー HTML とクライアント初期描画がずれ、再描画＋警告

---

## 1. 現状と主原因

| 事象 | 原因の推定 | 証拠 |
| --- | --- | --- |
| `Encountered two children with the same key, "project-2"` | `addProjectToDashboard()` 内で **既存 `id` を再利用** or 手動で同じ `id` をモックに入れている | `<Draggable key={project.id} …>` に同一 `project.id` が 2 個 |
| Hydration failed <br>**(lucide アイコン / timestamp / aria-hidden)** | ① *SVG props 差* : `IconWrapper` が **クライアント側だけ `aria-hidden="true"`** を付与 <br>② *日時差* : `AICoachSidebar` で `new Date()`→ `timestamp` を直接描画 | Stack trace が `components/client-icons.tsx` と `AICoachSidebar.tsx` を指す |

---

## 2. 推奨ロードマップ（概要）

1. **ID 重複ガード**を実装して key 重複を根絶
2. **SVG ラッパーを修正**し、SSR/CSR で同一の属性セットに揃える
3. **日時表示をクライアント専用レンダリングへ移行**
4. E2E と Storybook で回帰テスト → main へマージ

---

## 3. チェックリスト（詳細）

### 3-1. Duplicate key 対策 ✅

- [x] **ユーティリティ追加** `lib/generate-id.ts`
  ```ts
  import { nanoid } from 'nanoid';
  export const genId = (prefix: string) => `${prefix}-${nanoid(6)}`;
  ```

* [x] **`addProjectToDashboard()` を改修**

  * [x] 既存 ID が衝突する場合は `genId('project')` で再発行
  * [x] 追加前に `group.projects.some(p=>p.id===id)` をチェック
* [x] **モックデータ** (`getDefaultDashboardData` / `mockProjects`) を **一意 ID** に変更
* [x] **ローカルストレージ読込時** (`getDashboardData`) に **重複フィルタ**

  ```ts
  const unique = new Map();
  group.projects.forEach(p => { if(!unique.has(p.id)) unique.set(p.id,p); });
  group.projects = Array.from(unique.values());
  ```

### 3-2. Hydration エラー対策 ✅

#### 3-2-A. lucide IconWrapper

* [x] **`components/client-icons.tsx` を編集**

  ```diff
  - return <Icon className={cn('h-4 w-4', className)} {...rest} />;
  + const merged = cn('h-4 w-4', className);
  + // サーバー／クライアントで同一になるよう props を固定
  + return <Icon aria-hidden {...rest} className={merged} />;
  ```

  > 重要：`aria-hidden` を **明示的に常に付与** し、SSR と CSR の差をなくす
* [x] `Sidebar` 内で `<IconWrapper>` を必ず使用し、直接 lucide Icon を呼ばない

#### 3-2-B. 日時フォーマット

* [x] **`AICoachSidebar`**

  * [x] `message.timestamp` に **ISO 文字列** を保存
  * [x] 表示は `client` コンポーネントで `new Date(iso).toLocaleTimeString()`

    ```tsx
    'use client'
    import { useMemo } from 'react';
    const DisplayTime = ({iso}:{iso:string}) => {
      const time = useMemo(()=>new Date(iso).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}),[iso]);
      return <span>{time}</span>;
    }
    ```
  * [x] サーバーレンダリング時に **空 span** を返し、クライアントで埋める (`suppressHydrationWarning`)

#### 3-2-C. その他

* [x] モノレポ構成の場合 **`next.config.mjs`** に `experimental: { appDir: true }` を確認
* [x] Chrome 拡張の影響を除外するため、無効化状態でも再現するか確認

### 3-3. 回帰テスト ✅

* [x] **ユニット** : `getDashboardData` が一意 ID を維持
* [x] **Integration** : `addProjectToDashboard` → ダッシュボードに project が 1 つだけあること
* [x] **Playwright** :

  * [x] プロジェクト追加 → ページリロード後もエラーなし
  * [x] サイドバーアイコンが正しく描画される（`svg` 差分なし）

---

## 4. 事故ポイント & 事前対策

| リスク                                    | 対策                                                            |
| -------------------------------------- | ------------------------------------------------------------- |
| 変更で **ローカルストレージ schema** が食い違い、旧データと衝突 | `localStorage version` を持たせ、バージョン不一致なら `wipe & migrate`       |
| ID 再発行ロジックで **参照整合性が崩れる**              | 子要素 (`tasks`, `subtasks`) にも `parentId` を持たせ、`Map` で一括更新      |
| アイコンの **aria-hidden 付与漏れ**             | ESLint ルールを追加：lucide Icon 使用を禁止し `IconWrapper` 強制             |
| 時刻表示を抑制した結果、**SSR 時に content shift**   | `suppressHydrationWarning` と同じ高さの placeholder (`&nbsp;`) を入れる |

---

## 5. 次のアクション

1. ✅ ブランチ `fix/dashboard-key-hydration` を切る
2. ✅ **チェックリスト**を順に実装し、`pnpm test && pnpm lint` で通す
3. ✅ PR で **Vercel Preview** → QA チェック → `main` へマージ

---

> **備考**
>
> * GitHub `feat/decompose-button` は 2025-05-13 現在、`addProjectToDashboard` がそのまま `project.id` を使い回す実装のままなので本修正が必要。
> * Lucide v0.284 以降は `aria-hidden` デフォルトが付くようになったため、**SSR 時点から合わせておく** ことが重要。
