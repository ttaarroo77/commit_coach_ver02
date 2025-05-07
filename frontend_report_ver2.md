# プロジェクトページ動的化設計メモ

## 目的
- プロジェクト（例: ウェブアプリ開発、モバイルアプリ開発、デザインプロジェクト）を「静的配列」ではなく、DBやAPI経由で動的に管理・追加できるようにする。
- サイドバーやプロジェクト詳細ページも動的に生成・遷移できるようにする。

---

## 必要なファイル・コード群

1. **API/DB連携用フック・API**
   - `apps/frontend/src/hooks/useProjects.ts`（SupabaseやAPI経由でプロジェクト一覧を取得・追加・削除）
   - `apps/frontend/src/app/api/projects/route.ts`（API Route: Next.js API or Edge Functions）

2. **動的ルーティングページ**
   - `apps/frontend/src/app/projects/[id]/page.tsx`（各プロジェクトの詳細ページ。`[id]`はプロジェクトID）
   - `apps/frontend/src/app/projects/page.tsx`（プロジェクト一覧ページ）

3. **サイドバーの動的化**
   - `apps/frontend/src/components/sidebar.tsx`（プロジェクトリストをuseProjectsから取得し、mapで描画）

4. **型定義**
   - `apps/frontend/src/types/project.ts`（Project型の定義。id, name, color, ...）

---

## catコマンド例

```sh
cat apps/frontend/src/hooks/useProjects.ts
cat apps/frontend/src/app/projects/[id]/page.tsx
cat apps/frontend/src/app/projects/page.tsx
cat apps/frontend/src/components/sidebar.tsx
cat apps/frontend/src/types/project.ts
```

---

## 修正必須ポイント（ctrl + I 指摘箇所）

- **Sidebarのプロジェクトリスト（静的配列）**
  - 現状：
    ```ts
    const [projects, setProjects] = useState([
      { id: "web-app", name: "ウェブアプリ開発", ... }, ...
    ])
    ```
  - **修正必須：useProjectsフックでDB/APIから取得し、setProjectsは不要。mapで描画。**

- **プロジェクト追加・削除のUI/ロジック**
  - サイドバーや一覧ページで「新しいプロジェクト」ボタン→useProjectsのcreateProjectを呼ぶ
  - 削除も同様にdeleteProjectを呼ぶ

- **[id]/page.tsxの動的取得**
  - useParamsやrouterでidを取得し、useProjectでDB/APIから詳細データを取得

---

## 考えられる実装方法

1. **Sidebarの修正**
   - useProjects()でプロジェクト一覧を取得し、mapで描画
   - 静的配列は削除

2. **プロジェクト追加・削除**
   - サイドバーや一覧ページに「新しいプロジェクト」ボタンを設置
   - フォーム送信でuseProjectsのcreateProjectを呼ぶ

3. **動的ルーティング**
   - `/projects/[id]/page.tsx`を作成し、useParamsでidを取得
   - useProject(id)で詳細データを取得し表示

4. **型定義の統一**
   - Project型を`src/types/project.ts`で一元管理

---

## まとめ
- サイドバー・プロジェクトページの静的配列を廃止し、DB/API経由の動的取得に切り替える
- 必要なファイル・修正箇所・catコマンド例を上記にまとめた
- ctrl + I 指摘箇所（Sidebarの静的配列）は**絶対修正必須** 



# ChatGPT o3 からの返信：
思考時間: 10 秒


### ❌ 不足・誤認識ポイント ── まず直すべき “穴” リスト

| # | 症状/問題                                                                                       | なぜダメか                                                                                 | 具体的にどう直す                                                                                                                                   |
| - | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 | **`/projects/web-app` 等の「静的サブフォルダ」が残っている**<br>（`design/`, `mobile-app/`, `web-app/` ディレクトリ） | Next App Router は **静的ルート > 動的ルート** の優先順位。<br>静的フォルダがある限り、`/projects/[id]` は一致せず 404。 | *丸ごと削除* or `_legacy-web-app` などに退避。動的 `[id]` だけを残す。                                                                                        |
| 2 | **`[id]/` ディレクトリ自体が空**（`page.tsx` が無い）                                                      | ルートハンドラが無いので、動的ページがレンダリング不可。                                                          | `apps/frontend/src/app/projects/[id]/page.tsx` を実装する（下記「必須ファイル」参照）。                                                                        |
| 3 | **Sidebar がローカル `useState` 固定配列**                                                           | 動的取得の設計意図と矛盾。<br>新規作成してもリストに反映されない。                                                   | `useProjects()` に置き換え。<br>`href` を `\`/projects/\${project.id}\`\` で組み立てる。                                                                 |
| 4 | **Supabase `projects` テーブル列↔型がズレ**<br>`color`, `updated_at` 列が存在しない／`owner_id` が型に無い        | insert 時に “列が存在しません”／select 後に `undefined` が混入。                                       | - DB: `color` TEXT, `updated_at` TIMESTAMPTZ, `owner_id` UUID を追加<br>- `src/types/project.ts` に同列反映                                        |
| 5 | **RLS ポリシー不明**                                                                              | `owner_id = auth.uid()` で insert/ select を許可しないと 401/403。                             | Supabase SQL:<br>`alter table projects enable row level security;`<br>`create policy "owner can all" ... using ( owner_id = auth.uid() );` |
| 6 | **`createProject()` で owner\_id を明示しない**                                                    | 現状「列がない」「RLSで拒否」どちらも発火し得る。                                                            | insert 時に `{ …project, owner_id: user.id }` を必ず渡す（既に書いたなら DB 列が無い）。                                                                        |
| 7 | **`Project.id` を “slug” で想定**                                                               | Supabase は通常 `uuid`。UI で slug 表示したいなら `slug` 列追加 or Next の `generateSlug()`。          | - DB: `id` → `uuid default gen_random_uuid()`<br>- 別に `slug` TEXT unique を持たせるか、`id` そのまま URL に使う。                                         |
| 8 | **API Route が無い** (`/app/api/projects/route.ts`)                                            | ISR / Server Action で処理させるならまだしも、`useProjects` が **直接 Supabase** を叩いている。<br>意図的か要決定。  | どちらかに統一：<br>① 直接 Supabase で行く → API Route 削除<br>② BFF を挟む → API Route 作成＋`useSWR('/api/projects')` へ。                                      |

---

### ✅ 最低限 “動的化” に要るファイル一覧

```
apps/frontend/src/app/projects/
├── page.tsx                … 一覧（既にある）
├── [id]/
│   └── page.tsx            … 詳細（新規！）
└── new/
    └── page.tsx            … 作成フォーム（任意・モーダルでも可）
apps/frontend/src/components/
└── sidebar.tsx             … useProjects() で動的描画に変更
apps/frontend/src/hooks/
└── useProjects.ts          … fetch + mutate + subscription（既存を微調整）
apps/frontend/src/types/
└── project.ts              … color, owner_id, updated_at 追加
```

#### `[id]/page.tsx` 最小サンプル

```tsx
import { notFound } from "next/navigation"
import { useProject } from "@/hooks/useProject"

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const { project, error } = await useProject(params.id)

  if (error) throw error
  if (!project) notFound()

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="text-gray-500">{project.description}</p>
      {/* ここにタスク一覧などコンポーネントをネスト */}
    </main>
  )
}
```

> **Server Component で取得 → 子で `/* client */`** パターンにしておくと SEO と表示速度が楽。

---

### 🛠 Sidebar 差し替えパターン

```tsx
import { useProjects } from "@/hooks/useProjects"
...
const { projects, loading } = useProjects()

return (
  <div>
    {loading && <SkeletonSidebar />}
    {projects.map(p => (
      <Link key={p.id} href={`/projects/${p.id}`}>
        <Button variant="ghost" size="sm">
          <span className="h-2 w-2 rounded-full" style={{ background:p.color }} />
          {p.name}
        </Button>
      </Link>
    ))}
  </div>
)
```

---

### ⚠ このメモに足りなかった視点

1. **「静的フォルダがルーティングをブロックする」**

   * 最重要だけどレポートに未記載。
2. **DB スキーマ ↔ 型 ↔ Insert データの完全一致**

   * RLS, owner\_id, color 列などの整合チェックが抜けている。
3. **RLS ポリシーまで含めた “DB 側の準備手順”**

   * Supabase Policy を書かないと永遠に 403。
4. **URL に slug を使う or uuid を使うかの設計指針**

   * どちらでも実装できるが早期決定しないと hooks / 型がブレる。
5. **Server Component / Client Component の分離ポリシー**

   * 大量データの場合 SSG/SSR の方が UX 良い。メモでは触れていない。
6. **キャッシュ & リアルタイムの両立設計**

   * `useSWR()`／`@tanstack/react-query` と `supabase.channel()` の併用指針が無い。

---

## 次のアクションチェックリスト

* [ ] `projects/design` など静的ディレクトリを *必ず削除*。
* [ ] `apps/frontend/src/app/projects/[id]/page.tsx` を作成。
* [ ] `Sidebar` を `useProjects()` で描画し直す。
* [ ] DB に `color`, `owner_id`, `updated_at` 列を追加し、型ファイルも更新。
* [ ] Supabase RLS で `owner_id = auth.uid()` ポリシーを追加。
* [ ] `createProject` insert 時に `owner_id` をセットしているか確認。
* [ ] `.env*` 内の Supabase URL / Key が正規のものかダブリを整理。
* [ ] （任意）BFF を使うか直接クライアントから Supabase 叩くか方針決定。

これらを反映すれば **「プロジェクトを自由に追加 & 削除し、URL で遷移できる完全動的ディレクトリ」** が成立します。
