---
id: api
version: 2025-05-06
title: コミットコーチ – API Specification (Dynamic Routing Edition)
owner: commit_coach_team
stakeholders: [frontend, backend]
base_path: "/api/v1"
---------------------

# 1. 概要

Next.js **App Router** で導入した動的 URL 構造（`/projects/[slug]`, `/projects/[slug]/tasks/[taskId]` など）をそのまま **REST / Edge Function** のエンドポイントにも反映する。クライアントは `fetch()` か **Server Actions** で呼び出す。

> **注**: 本仕様は **"MVP = Supabase Row‑Level Security + Edge Functions"** を前提とする。後段で GraphQL / gRPC への発展パスを示す。

---

# 2. 認証 & 共通ヘッダ

| Header          | 値                  | 必須             | 説明                            |
| --------------- | ------------------ | -------------- | ----------------------------- |
| `Authorization` | `Bearer <JWT>`     | ✓              | Supabase で発行される JWT (anon も可) |
| `Content-Type`  | `application/json` | POST/PUT/PATCH | -                             |

---

# 3. リソース定義 & エンドポイント

## 3.1 Project

| メソッド       | パス                         | 概要                                 |
| ---------- | -------------------------- | ---------------------------------- |
| **GET**    | `/projects?cursor=&limit=` | プロジェクト一覧 (ページネーション)                |
| **POST**   | `/projects`                | 新規プロジェクト作成                         |
| **GET**    | `/projects/{slug}`         | プロジェクト詳細 (slug はユニーク文字列)           |
| **PATCH**  | `/projects/{slug}`         | 部分更新 (name / description / status) |
| **DELETE** | `/projects/{slug}`         | プロジェクト削除 (owner のみ)                |

### 3.1.1 Schema (shared‑types)

```ts
// packages/shared-types/src/project.ts
export interface Project {
  id: string;        // UUID
  slug: string;      // kebab‑case, unique per user
  name: string;
  description?: string;
  status: "active" | "archived" | "completed";
  createdAt: string; // ISO‑8601
}
```

## 3.2 Task

| メソッド       | パス                                               | 概要                              |
| ---------- | ------------------------------------------------ | ------------------------------- |
| **GET**    | `/projects/{slug}/tasks?cursor=&status=&search=` | タスク一覧 (フィルタ対応)                  |
| **POST**   | `/projects/{slug}/tasks`                         | タスク新規作成                         |
| **GET**    | `/projects/{slug}/tasks/{taskId}`                | 詳細取得                            |
| **PATCH**  | `/projects/{slug}/tasks/{taskId}`                | 部分更新                            |
| **DELETE** | `/projects/{slug}/tasks/{taskId}`                | 削除                              |
| **POST**   | `/projects/{slug}/tasks/{taskId}/reorder`        | DnD 並び順更新 (body: `aboveTaskId`) |

## 3.3 Subtask

| メソッド       | パス                                                 |
| ---------- | -------------------------------------------------- |
| **POST**   | `/projects/{slug}/tasks/{taskId}/subtasks`         |
| **PATCH**  | `/projects/{slug}/tasks/{taskId}/subtasks/{subId}` |
| **DELETE** | `/projects/{slug}/tasks/{taskId}/subtasks/{subId}` |

## 3.4 Dashboard Snapshot (Today / Unscheduled)

| メソッド    | パス                           | 説明                                      |
| ------- | ---------------------------- | --------------------------------------- |
| **GET** | `/dashboard?date=YYYY-MM-DD` | 指定日のタスクグループを取得 (Server Component SSR 用) |
| **PUT** | `/dashboard`                 | 編集結果を一括保存 (optimistic update 用)         |

## 3.5 AI Coach

| メソッド     | パス                     | 説明                                   |
| -------- | ---------------------- | ------------------------------------ |
| **POST** | `/ai/coach`            | { `prompt`, `context` } を送り AI 返信を取得 |
| **GET**  | `/ai/messages?taskId=` | AI との履歴 (ストリーミング対応)                  |

---

# 4. HTTP Status 規約

* **200** Success (GET)
* **201** Created (POST)
* **204** No Content (DELETE / update without body)
* **400** ValidationError (Zod)
* **401** Unauthorized
* **403** Forbidden (RLS 失敗)
* **404** Not Found (slug / id 不正)
* **409** Conflict (slug 重複, 楽観ロック失敗)

---

# 5. Supabase Edge Functions ⇄ REST マッピング

| Edge Function     | 対応パス                   | ランタイム                 |
| ----------------- | ---------------------- | --------------------- |
| `projects-create` | POST `/projects`       | TypeScript (Edge)     |
| `projects-get`    | GET `/projects/{slug}` | SQL + Row Cache       |
| `tasks-bulk-save` | PUT `/dashboard`       | Deno 1.42             |
| `ai-coach`        | POST `/ai/coach`       | Node 20 (vercel/edge) |

> **理由**: 長期実行 or GPT 呼び出しは **Edge Function** でアイソレーションし、軽量 CRUD は `rest/v1` (PostgREST) を直接叩く。

---

# 6. Row‑Level Security

```sql
create policy "project_owner_or_member" on projects
  for all using (
    auth.uid() = owner_id
    or auth.uid() in (
      select user_id from project_members where project_id = id
    ));

create policy "task_same_project" on tasks
  for all using (
    project_id in (
      select id from projects where auth.uid() = owner_id
      union
      select project_id from project_members where user_id = auth.uid())
);
```

---

# 7. WebSocket (Realtime) チャンネル

| Channel           | 監視対象                                       | Payload          |
| ----------------- | ------------------------------------------ | ---------------- |
| `projects:{slug}` | `tasks`, `subtasks` (insert/update/delete) | 完全行              |
| `ai:{taskId}`     | `ai_messages`                              | streaming chunks |

フロントエンドは `supabase.channel("projects:"+slug)` で購読し、`useEffect` により Dashboard UI を差分更新。

---

# 8. エラーオブジェクト

```jsonc
{
  "status": 400,
  "error": "ValidationError",
  "message": "title: Required field",
  "details": [
    { "path": "title", "msg": "Required" }
  ]
}
```

---

# 9. 今後の拡張

1. **GraphQL Gateway**: `/graphql` に schema stitching、RLS 担保は Postgres row filter で共用。
2. **gRPC + Buf**: モバイルアプリ向け。
3. **Batch Mutation**: `/projects/{slug}/tasks:batch` で最大 500 ops。

---

*Last updated: 2025‑05‑06 (dynamic‑routing edition)*