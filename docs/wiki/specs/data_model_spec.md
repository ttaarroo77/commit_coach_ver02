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