---
id: data
title: Database Schema & Domain Types
owner: o3
stakeholders: [cursor]
platform: "Supabase (PostgreSQL 16)"
tables:
  users:
    pk: id(UUID)
    unique: [email]
    cols:
      email: text!
      name: text!
      avatar_url: text?
      created_at: timestamptz default now
  projects:
    pk: id(UUID)
    fk: owner_id -> users.id cascade
    cols:
      name: text!
      description: text?
      status: ProjectStatus default 'active'
  project_members:
    pk: [project_id, user_id]
    fk:
      project_id -> projects.id cascade
      user_id -> users.id cascade
    cols:
      role: ProjectMemberRole default 'member'
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
  subtasks:
    pk: id(UUID)
    fk: task_id -> tasks.id cascade
    cols:
      title: text!
      is_completed: bool default false
  ai_messages:
    pk: id(UUID)
    fk: task_id -> tasks.id cascade
    cols:
      content: text!
      role: text!
rls:
  users: "auth.uid() = id"
  projects: "owner or member"
backups:
  frequency: daily
  retention_days: 30
migrations: "Supabase CLI, versioned in git"
types:
  ProjectStatus: [active, archived, completed]
  ProjectMemberRole: [owner, member]
  TaskStatus: [todo, in_progress, review, done]
  TaskPriority: [low, medium, high, urgent]
---

# Data Model Rationale

RLS によりテーブルごとに最小権限を担保しています。型定義は packages/shared-types で Zod スキーマとして共有し、フロントエンドとバックエンド双方が同一型を参照します。

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

これで Supabase プロジェクトの基本的なセットアップは完了です。次のステップではデータベーススキーマの設計と作成を行います。

# Supabase トランザクション方針

このドキュメントでは、Commit Coach プロジェクトでの Supabase を使用したトランザクション処理の方針と実装パターンについて説明します。

## 基本原則

1. **ACID 特性の維持**: トランザクションは Atomicity（原子性）、Consistency（一貫性）、Isolation（独立性）、Durability（永続性）の性質を保つ必要があります。
2. **楽観的ロック**: 競合を防ぐために楽観的ロックを使用します。
3. **エラーハンドリング**: すべてのトランザクションで適切なエラーハンドリングを行います。

## トランザクション実装パターン

### 1. サーバーサイド（Node.js）でのトランザクション

```typescript
// ... existing code ...