---
id: data
version: 2025-05-06
title: Database Schema & Domain Types (Dynamic Routing Edition)
owner: commit_coach_team
stakeholders: [frontend, backend]
platform: "Supabase (PostgreSQL 16)"
------------------------------------

# 1. 変更点サマリ（静的→動的）

| 変更                                                   | 理由                                        |
| ---------------------------------------------------- | ----------------------------------------- |
| **projects.slug** (text, unique per owner) 追加        | `/projects/[slug]` 動的 URL を永続化し SEO・共有を実現 |
| **order\_idx** 列を tasks / subtasks に追加               | DnD 並び順を永続化し、日付以外の自由ソートを可能に               |
| **tasks.progress** (smallint 0‑100) 追加               | サブタスク進捗をダッシュボードで即計算表示                     |
| **timestamps** (`created_at`, `updated_at`) を全テーブルに  | 監査ログ & Realtime 差分検知用                     |
| **soft‑delete** 用 `archived_at` を projects / tasks に | RLS で非表示にしつつ履歴保持                          |
| **RLS** を slug / archived\_at に対応                    | 非公開 slug への直接アクセスを 404 に                  |

---

# 2. テーブル定義

```yaml
tables:
  users:
    pk: id(UUID)
    unique: [email]
    cols:
      email: text!
      name: text!
      avatar_url: text?
      created_at: timestamptz default now()
      updated_at: timestamptz default now()

  projects:
    pk: id(UUID)
    fk: owner_id -> users.id cascade
    unique: [owner_id, slug]
    cols:
      slug: text!               # kebab-case, URL 用
      name: text!
      description: text?
      status: ProjectStatus default 'active'
      archived_at: timestamptz? # soft delete
      created_at: timestamptz default now()
      updated_at: timestamptz default now()

  project_members:
    pk: [project_id, user_id]
    fk:
      project_id -> projects.id cascade
      user_id -> users.id cascade
    cols:
      role: ProjectMemberRole default 'member'
      created_at: timestamptz default now()

  tasks:
    pk: id(UUID)
    fk:
      project_id -> projects.id cascade
      assignee_id -> users.id set null
    cols:
      title: text!
      status: TaskStatus default 'todo'
      priority: TaskPriority default 'medium'
      due_date: date?
      order_idx: int default 0          # 並び順 (0‑N)
      progress: smallint default 0      # 0‑100
      archived_at: timestamptz?
      created_at: timestamptz default now()
      updated_at: timestamptz default now()

  subtasks:
    pk: id(UUID)
    fk: task_id -> tasks.id cascade
    cols:
      title: text!
      is_completed: bool default false
      order_idx: int default 0
      created_at: timestamptz default now()
      updated_at: timestamptz default now()

  ai_messages:
    pk: id(UUID)
    fk: task_id -> tasks.id cascade
    cols:
      content: text!
      role: 'assistant'|'user'
      model: text default 'gpt-4o'
      created_at: timestamptz default now()
```

---

# 3. ドメイン Enum

```yaml
types:
  ProjectStatus: [active, archived, completed]
  ProjectMemberRole: [owner, member]
  TaskStatus: [todo, in_progress, review, completed]
  TaskPriority: [low, medium, high, urgent]
```

> **変更**: `done` → `completed` に揃えて UI と一致。

---

# 4. Row‑Level Security ポリシー

```sql
-- projects: オーナー or メンバーかつ未アーカイブ
create policy "access_own_projects" on projects
using (
  archived_at is null and (
    auth.uid() = owner_id
    or auth.uid() in (select user_id from project_members where project_id = id)
  )
);

-- tasks: 関連プロジェクトのポリシー継承
create policy "access_tasks" on tasks
using (
  archived_at is null and project_id in (
    select id from projects where archived_at is null
      and (owner_id = auth.uid() or id in (select project_id from project_members where user_id = auth.uid()))
  )
);
```

---

# 5. インデックス

```sql
create index on projects(owner_id, slug);
create index on tasks(project_id, order_idx);
create index on subtasks(task_id, order_idx);
```

---

# 6. バックアップ & マイグレーション

```yaml
backups:
  frequency: daily
  retention_days: 30
migrations: "Supabase CLI, versioned in git (timestamp-based)"
```

---

# 7. 変更に伴うアプリ影響

* フロントエンド: `Project` 型に `slug`, `archivedAt` 追加。
  ルート生成 `generateStaticParams()` は `select slug from projects where owner_id = ?`。
* Dashboard DnD: 並び替え時に `order_idx` 更新 API `/reorder` 呼び出し。
* API 層: 新規 `DELETE /projects/{slug}` は `archived_at = now()` に変換。

---

# Supabase セットアップガイド

このドキュメントでは、Commit Coach プロジェクト用の Supabase 環境をセットアップする手順を説明します。

## 1. Supabase プロジェクトの作成

1. [Supabase ダッシュボード](https://app.supabase.io/) にアクセスし、アカウントでログインします
2. 「New Project」ボタンをクリックします
3. 以下の情報を入力します：
   - **Organization**: 既存の組織を選択するか、新しく作成します
   - **Name**: `commit-coach` (または希望するプロジェクト名)
   - **Database Password**: 安全なパスワードを生成・保存します
   - **Region**: アプリケーションのターゲットユーザーに近いリージョンを選択します
   - **Pricing Plan**: Free Tier (開発用) または Pro Tier (本番用)
4. 「Create new project」をクリックします
5. プロジェクトのセットアップが完了するまで待ちます（約 1 分）

## 2. プロジェクト情報の取得

プロジェクトが作成されたら、以下の情報を取得して `.env` ファイルに保存します：

1. プロジェクトのダッシュボードで「Project Settings」→「API」を選択します
2. 以下の情報をコピーします：
   - **Project URL**
   - **API Key** (anon/public)
   - **Service Role Key** (秘密にしておく必要があります)

## 3. .env ファイルの設定

以下の形式で `.env` ファイルを作成します（適切なディレクトリに）：

```
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

`.env.example` ファイルも作成し、秘密情報を削除したテンプレートを提供します：

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Supabase CLI のインストール

ローカル開発とマイグレーション管理のために Supabase CLI をインストールします：

```bash
# npm を使う場合
npm install -g supabase

# または、その他のインストール方法
# https://github.com/supabase/cli を参照
```

## 5. ローカル開発環境のセットアップ (オプション)

ローカルで Supabase を実行するには、Docker が必要です：

```bash
# ローカル Supabase の初期化
supabase init

# ローカルサーバー起動
supabase start
```

---

# マイグレーション管理

## 1. 初期マイグレーション生成

最初のマイグレーションファイルを生成するには：

```bash
# マイグレーションファイルを生成
supabase migration new initial_schema

# 生成されたファイルを編集
# supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql
```

## 2. マイグレーションの適用

```bash
# ローカル開発環境に適用
supabase db reset

# 本番環境に適用 (Supabase ダッシュボードから)
# または CLI から
supabase db push --db-url "postgres://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

## 3. 既存スキーマからマイグレーション生成 (既存DBがある場合)

```bash
# 現在のスキーマからマイグレーションを生成
supabase db diff --use-migra -f initial_schema
```

---

*Last updated: 2025-05-06 (dynamic-routing edition)*