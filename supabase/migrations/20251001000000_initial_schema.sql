-- Commit Coach データベースのスキーマ定義

-- 拡張機能のインストール
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- テーブル作成 (Step 114)

-- ユーザーテーブル (Supabase Authと連携)
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "avatar_url" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- プロジェクトテーブル
CREATE TABLE IF NOT EXISTS "projects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "owner_id" UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  "is_archived" BOOLEAN DEFAULT false NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- プロジェクトメンバーテーブル
CREATE TABLE IF NOT EXISTS "project_members" (
  "project_id" UUID REFERENCES "projects"(id) ON DELETE CASCADE,
  "user_id" UUID REFERENCES "users"(id) ON DELETE CASCADE,
  "role" TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY ("project_id", "user_id")
);

-- タスクグループテーブル (カンバン列)
CREATE TABLE IF NOT EXISTS "task_groups" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "project_id" UUID NOT NULL REFERENCES "projects"(id) ON DELETE CASCADE,
  "position" INTEGER NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- タスクテーブル
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  "priority" TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  "due_date" TIMESTAMP WITH TIME ZONE,
  "task_group_id" UUID NOT NULL REFERENCES "task_groups"(id) ON DELETE CASCADE,
  "position" INTEGER NOT NULL,
  "assignee_id" UUID REFERENCES "users"(id) ON DELETE SET NULL,
  "created_by" UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- サブタスクテーブル
CREATE TABLE IF NOT EXISTS "subtasks" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" TEXT NOT NULL,
  "is_completed" BOOLEAN DEFAULT false NOT NULL,
  "task_id" UUID NOT NULL REFERENCES "tasks"(id) ON DELETE CASCADE,
  "position" INTEGER NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- AIメッセージテーブル
CREATE TABLE IF NOT EXISTS "ai_messages" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  "content" TEXT NOT NULL,
  "is_user" BOOLEAN NOT NULL,
  "context" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Step 116: インデックスの作成
CREATE INDEX IF NOT EXISTS "idx_projects_owner" ON "projects" ("owner_id");
CREATE INDEX IF NOT EXISTS "idx_task_groups_project" ON "task_groups" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_tasks_task_group" ON "tasks" ("task_group_id");
CREATE INDEX IF NOT EXISTS "idx_tasks_assignee" ON "tasks" ("assignee_id");
CREATE INDEX IF NOT EXISTS "idx_tasks_creator" ON "tasks" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_subtasks_task" ON "subtasks" ("task_id");
CREATE INDEX IF NOT EXISTS "idx_ai_messages_user" ON "ai_messages" ("user_id");

-- Step 115: RLSポリシーの設定
-- RLSを有効化
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "task_groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subtasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_messages" ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のみが自分のデータにアクセス可能
CREATE POLICY "users_access_own" ON "users"
  FOR ALL USING (auth.uid() = id);

-- プロジェクトはオーナーとメンバーがアクセス可能
CREATE POLICY "projects_owner_access" ON "projects"
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "projects_member_access" ON "projects"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_id = projects.id AND user_id = auth.uid()
    )
  );

-- プロジェクトメンバーの管理はプロジェクトオーナーのみ可能
CREATE POLICY "project_members_owner_access" ON "project_members"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_members.project_id AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "project_members_view_own" ON "project_members"
  FOR SELECT USING (user_id = auth.uid());

-- タスクグループはプロジェクトメンバーがアクセス可能
CREATE POLICY "task_groups_project_access" ON "task_groups"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_id = task_groups.project_id AND user_id = auth.uid()
    )
  );

-- タスクはプロジェクトメンバーがアクセス可能
CREATE POLICY "tasks_project_access" ON "tasks"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM task_groups 
      JOIN project_members ON task_groups.project_id = project_members.project_id 
      WHERE task_groups.id = tasks.task_group_id AND project_members.user_id = auth.uid()
    )
  );

-- サブタスクはプロジェクトメンバーがアクセス可能
CREATE POLICY "subtasks_task_access" ON "subtasks"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN task_groups ON tasks.task_group_id = task_groups.id 
      JOIN project_members ON task_groups.project_id = project_members.project_id 
      WHERE tasks.id = subtasks.task_id AND project_members.user_id = auth.uid()
    )
  );

-- AIメッセージは作成者のみがアクセス可能
CREATE POLICY "ai_messages_user_access" ON "ai_messages"
  FOR ALL USING (user_id = auth.uid());

-- ビューの作成：期限間近のタスク
CREATE OR REPLACE VIEW "upcoming_tasks" AS
SELECT t.*, tg.project_id
FROM tasks t
JOIN task_groups tg ON t.task_group_id = tg.id
WHERE t.status != 'completed' 
AND t.due_date IS NOT NULL 
AND t.due_date > now() 
AND t.due_date < now() + interval '7 days'
ORDER BY t.due_date ASC;

-- 関数の作成：プロジェクトの進捗状況計算
CREATE OR REPLACE FUNCTION get_project_progress(project_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  total_tasks INT;
  completed_tasks INT;
  result JSONB;
BEGIN
  -- 全タスク数を取得
  SELECT COUNT(*) INTO total_tasks
  FROM tasks t
  JOIN task_groups tg ON t.task_group_id = tg.id
  WHERE tg.project_id = project_uuid;
  
  -- 完了したタスク数を取得
  SELECT COUNT(*) INTO completed_tasks
  FROM tasks t
  JOIN task_groups tg ON t.task_group_id = tg.id
  WHERE tg.project_id = project_uuid AND t.status = 'completed';
  
  -- 結果を構築
  result = jsonb_build_object(
    'total_tasks', total_tasks,
    'completed_tasks', completed_tasks,
    'completion_percentage', 
      CASE WHEN total_tasks > 0 THEN (completed_tasks::float / total_tasks) * 100 ELSE 0 END
  );
  
  RETURN result;
END;
$$; 