# データベーススキーマ

## 概要
Commit Coachのデータベースは、PostgreSQLを使用して構築されています。このドキュメントでは、データベースのスキーマと関連する情報を説明します。

## テーブル構造

### users
ユーザー情報を管理するテーブルです。

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### projects
プロジェクト情報を管理するテーブルです。

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### tasks
タスク情報を管理するテーブルです。

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### subtasks
サブタスク情報を管理するテーブルです。

```sql
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## インデックス
パフォーマンスを最適化するために、以下のインデックスを設定しています。

```sql
-- usersテーブルのインデックス
CREATE INDEX idx_users_email ON users(email);

-- projectsテーブルのインデックス
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- tasksテーブルのインデックス
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- subtasksテーブルのインデックス
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_subtasks_status ON subtasks(status);
```

## 外部キー制約
データの整合性を保つために、以下の外部キー制約を設定しています。

```sql
-- projectsテーブルの外部キー制約
ALTER TABLE projects
ADD CONSTRAINT fk_projects_user_id
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- tasksテーブルの外部キー制約
ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_project_id
FOREIGN KEY (project_id) REFERENCES projects(id)
ON DELETE CASCADE;

-- subtasksテーブルの外部キー制約
ALTER TABLE subtasks
ADD CONSTRAINT fk_subtasks_task_id
FOREIGN KEY (task_id) REFERENCES tasks(id)
ON DELETE CASCADE;
```

## トリガー
データの自動更新のために、以下のトリガーを設定しています。

```sql
-- updated_atカラムを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subtasks_updated_at
BEFORE UPDATE ON subtasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## マイグレーション
データベースの変更を管理するために、Prismaを使用してマイグレーションを実行します。

```bash
# マイグレーションファイルの生成
npx prisma migrate dev --name init

# マイグレーションの適用
npx prisma migrate deploy
```

## バックアップとリストア
データベースのバックアップとリストアの手順です。

```bash
# バックアップの作成
pg_dump -U username -d database_name > backup.sql

# リストア
psql -U username -d database_name < backup.sql
```

## 監視とメンテナンス
データベースのパフォーマンスを監視し、定期的なメンテナンスを実行します。

```sql
-- テーブルの統計情報を更新
ANALYZE users;
ANALYZE projects;
ANALYZE tasks;
ANALYZE subtasks;

-- インデックスの再構築
REINDEX TABLE users;
REINDEX TABLE projects;
REINDEX TABLE tasks;
REINDEX TABLE subtasks;
```

## セキュリティ
データベースのセキュリティを確保するために、以下の対策を実施しています。

- 最小権限の原則に基づいたユーザー権限の設定
- SSL/TLSによる通信の暗号化
- パスワードのハッシュ化
- 定期的なセキュリティ監査
- バックアップの暗号化

## 結論
このデータベーススキーマは、Commit Coachの要件を満たすように設計されています。適切なインデックス、外部キー制約、トリガーを設定することで、データの整合性とパフォーマンスを確保しています。