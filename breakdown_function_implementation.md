# supabase_integration_roadmap.md
> **目的**


> いま **Mock JSON in-memory** で動いている「ダッシュボード / プロジェクト」機能を **Supabase (PostgreSQL + Realtime + Auth)** に載せ替え、
> - **新規プロジェクト／タスク／サブタスク** をリアルタイム作成
> - 既存ダミーデータも “最初のシード” として取り込む
> - 将来的な **AI‐コーチ／分解 { } 機能** が DB 上で履歴管理できる
> を最短で実現するロードマップ。

---

## 1. 現状 & 課題

| 項目 | 状況 | ボトルネック |
|------|------|--------------|
| **State 管理** | useState だけ。LocalStorage 保存あり | マルチデバイス同期不可 |
| **データ構造** | `/lib/dashboard-utils.ts` に TS 型 + モック |   |
| **Auth** | Supabase client だけ入っているが未配線 | ルートガード無し |
| **SSR** | App Router (next 14) | DB フェッチをまだ Server Action 化していない |

---

## 2. ハイレベル戦略

1. **DB スキーマ確定**
   `projects` → `tasks` → `subtasks` を **階層テーブル or JSONB** で表現。
2. **Supabase Client Hooks** で CRUD API を置換。
3. **Server Actions + SWR** で **“Optimistic UI”** 化。
4. 旧ローカルデータを **Seed Script** で投入し、以降は LocalStorage fallback を削除。
5. E2E テストを追加し “Hydration error” を regression させない。

---

## 3. フェーズ別ロードマップ（概要）

| Phase | スコープ | Exit Criteria |
|-------|---------|---------------|
| **0** | Supabase プロジェクト作成 & .env 設定 | `healthcheck.ts` で ping OK |
| **1** | DB スキーマ & 型生成 | `supabase gen types typescript` が pass |
| **2** | **Read** 置換（SSR） | `/projects` が DB 読み込みで描画 |
| **3** | **Write** 置換（Client Mutations） | 追加 / 削除 / 分解 が DB 反映 |
| **4** | Realtime Sync | 別タブでも UI が自動更新 |
| **5** | Auth + RLS | ユーザごとの行レベルセキュリティ完成 |
| **6** | Seed & Clean-up | モック util を削除し、CI green |

---

## 4. 詳細チェックリスト

### ☐ Phase-0: インフラ準備
- [ ] Supabase プロジェクトを **org/team** に作成
- [ ] `anon` / `service_role` key を `apps/frontend/.env.local` へ
- [ ] **`@supabase/cli`** を devDeps 追加 → `supabase link --project-ref ...`

### ☐ Phase-1: スキーマ定義
```sql
create table profiles (
  id uuid primary key references auth.users,
  username text
);

create table projects (
  id uuid default uuid_generate_v4() primary key,
  owner uuid references profiles(id),
  title text not null,
  position int,
  inserted_at timestamptz default now()
);

create table tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  title text,
  position int,
  expanded boolean default false,
  progress int default 0
);

create table subtasks (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references tasks(id) on delete cascade,
  title text,
  completed boolean default false,
  position int
);
````

* [ ] `supabase db push`
* [ ] **RLS OFF** → 後段で有効化

### ☐ Phase-2: 型生成 & SDK

* [ ] `supabase gen types typescript --local > lib/database.types.ts`
* [ ] **DB Client ラッパ** `lib/supabase.server.ts` / `lib/supabase.client.ts`

### ☐ Phase-3: Read パス置換

* [ ] `/app/projects/page.tsx`

  * [ ] `getProjects(userId)` *Server Action* で fetch
  * [ ] `use suspense()` で CSR fallback
* [ ] `/app/dashboard/page.tsx` 同様

### ☐ Phase-4: Write パス置換

* [ ] `addProjectToDashboard()` ⇒ `insert into projects …`
* [ ] `addTaskToProject()` ⇒ `insert into tasks …`
* [ ] `addSubtaskToTask()` ⇒ `insert into subtasks …`
* [ ] 削除系も同様に supabase RPC or delete query
* [ ] **React-Query / useSWRMutation** で Optimistic Update

### ☐ Phase-5: Realtime

* [ ] `supabase.channel('db-changes')` で `on('postgres_changes', …)` 監視
* [ ] `useEffect` → `queryClient.invalidateQueries(['projects'])`

### ☐ Phase-6: Auth & RLS

* [ ] `auth.users` の UUID を `owner` 列に格納
* [ ] `alter table … enable row level security;`
* [ ] ポリシー:

  ```sql
  create policy "own rows" on projects
    for all using (owner = auth.uid());
  ```
* [ ] Next.js Middleware で `supabase.auth.getUser()` & redirect

### ☐ Phase-7: Seed & Clean-up

* [ ] `scripts/seedFromMock.ts` で旧 JSON を insert
* [ ] `lib/dashboard-utils.ts` / LocalStorage ロジックを削除
* [ ] `pnpm test:e2e` (Playwright) パス

---

## 5. リスク & 対策

| リスク                  | 具体例                                | 対策                                    |
| -------------------- | ---------------------------------- | ------------------------------------- |
| **Hydration 再発**     | Server Action → Client cache ミスマッチ | `cache:` option + `suspense`          |
| **Realtime flood**   | 1000+ 変更で再レンダ連鎖                    | `debounce` & `batch` in listener      |
| **RLS ブロック**         | 書き込みが 403                          | Service Role key を *server only* 利用   |
| **位置 (position) 競合** | DnD 並び替え同時編集                       | `rpc(reorder_project, …)` で atomic 更新 |

---

## 6. マイルストーン & 期日イメージ

| 日付        | Deliverable                               |
| --------- | ----------------------------------------- |
| **Day-0** | Supabase project & CLI link               |
| **+2d**   | スキーマ Push / 型生成                           |
| **+5d**   | Read パス (Phase-3) 完了 → `/projects` SSR OK |
| **+8d**   | Write パス & Optimistic コメント動作              |
| **+10d**  | Realtime 同期デモ                             |
| **+12d**  | Auth + RLS ON                             |
| **+14d**  | Seed 書き換え / Mock util 削除 → PR Merge 🚀    |

---

> **備考**
>
> * **setting / mypage** は *profiles* テーブルと 1:1 で紐付け、後続 Sprint で CRUD UI を作成。
> * Supabase Edge Functions を使った **AI 分解ログ保存** は次フェーズで検討。
