# Supabase トランザクション方針

このドキュメントでは、Commit Coach プロジェクトでの Supabase を使用したトランザクション処理の方針と実装パターンについて説明します。

## 基本原則

1. **ACID 特性の維持**: トランザクションは Atomicity（原子性）、Consistency（一貫性）、Isolation（独立性）、Durability（永続性）の性質を保つ必要があります。
2. **楽観的ロック**: 競合を防ぐために楽観的ロックを使用します。
3. **エラーハンドリング**: すべてのトランザクションで適切なエラーハンドリングを行います。

## トランザクション実装パターン

### 1. サーバーサイド（Node.js）でのトランザクション

```typescript
import { supabaseAdmin } from '../config/supabase';

async function createProjectWithTasks(userId: string, projectData: any, initialTasks: any[]) {
  // トランザクションを開始
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .insert({
      name: projectData.name,
      description: projectData.description,
      owner_id: userId
    })
    .select()
    .single();

  if (projectError) {
    console.error('Error creating project:', projectError);
    throw new Error('プロジェクトの作成に失敗しました');
  }

  // プロジェクトIDを取得
  const projectId = project.id;

  // デフォルトのタスクグループを作成
  const { data: taskGroup, error: taskGroupError } = await supabaseAdmin
    .from('task_groups')
    .insert({
      name: 'タスク',
      project_id: projectId,
      position: 0
    })
    .select()
    .single();

  if (taskGroupError) {
    // タスクグループの作成に失敗した場合は、プロジェクトを削除
    await supabaseAdmin.from('projects').delete().eq('id', projectId);
    console.error('Error creating task group:', taskGroupError);
    throw new Error('タスクグループの作成に失敗しました');
  }

  // 初期タスクの作成
  if (initialTasks && initialTasks.length > 0) {
    const tasksToInsert = initialTasks.map((task, index) => ({
      title: task.title,
      description: task.description || null,
      status: 'pending',
      priority: task.priority || 'medium',
      due_date: task.due_date || null,
      task_group_id: taskGroup.id,
      position: index,
      created_by: userId
    }));

    const { error: tasksError } = await supabaseAdmin
      .from('tasks')
      .insert(tasksToInsert);

    if (tasksError) {
      // タスクの作成に失敗した場合は、プロジェクトとタスクグループを削除
      await supabaseAdmin.from('task_groups').delete().eq('id', taskGroup.id);
      await supabaseAdmin.from('projects').delete().eq('id', projectId);
      console.error('Error creating tasks:', tasksError);
      throw new Error('タスクの作成に失敗しました');
    }
  }

  return project;
}
```

### 2. Supabase の PostgreSQL 関数を使用した場合

複雑なトランザクションは PostgreSQL の関数として実装し、一度の呼び出しで完結させる方法もあります：

```sql
-- create_project_with_tasks.sql
CREATE OR REPLACE FUNCTION create_project_with_tasks(
  p_user_id UUID,
  p_project_name TEXT,
  p_project_description TEXT,
  p_tasks JSONB
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_project_id UUID;
  v_task_group_id UUID;
  v_task JSONB;
BEGIN
  -- プロジェクトを作成
  INSERT INTO projects (name, description, owner_id)
  VALUES (p_project_name, p_project_description, p_user_id)
  RETURNING id INTO v_project_id;
  
  -- プロジェクトメンバーに追加
  INSERT INTO project_members (project_id, user_id, role)
  VALUES (v_project_id, p_user_id, 'owner');
  
  -- デフォルトのタスクグループを作成
  INSERT INTO task_groups (name, project_id, position)
  VALUES ('タスク', v_project_id, 0)
  RETURNING id INTO v_task_group_id;
  
  -- タスクを追加
  FOR i IN 0..jsonb_array_length(p_tasks) - 1 LOOP
    v_task := p_tasks->i;
    
    INSERT INTO tasks (
      title, 
      description, 
      status, 
      priority, 
      due_date, 
      task_group_id, 
      position, 
      created_by
    )
    VALUES (
      v_task->>'title',
      v_task->>'description',
      'pending',
      COALESCE(v_task->>'priority', 'medium'),
      (v_task->>'due_date')::TIMESTAMP WITH TIME ZONE,
      v_task_group_id,
      i,
      p_user_id
    );
  END LOOP;
  
  RETURN v_project_id;
EXCEPTION
  WHEN OTHERS THEN
    -- エラー発生時はロールバック（トランザクションを使用しているため自動的に行われる）
    RAISE;
END;
$$;
```

Node.js からの呼び出し：

```typescript
async function createProjectWithTasksUsingFunction(userId: string, projectData: any, initialTasks: any[]) {
  const { data, error } = await supabaseAdmin.rpc('create_project_with_tasks', {
    p_user_id: userId,
    p_project_name: projectData.name,
    p_project_description: projectData.description,
    p_tasks: initialTasks
  });

  if (error) {
    console.error('Error creating project with tasks:', error);
    throw new Error('プロジェクトとタスクの作成に失敗しました');
  }

  return data; // 関数から返された projectId
}
```

## 一般的なトランザクションパターン

### 1. カンバンボードでのドラッグ＆ドロップ（順序更新）

タスクの移動を行う場合：

```typescript
async function moveTask(taskId: string, newGroupId: string, newPosition: number) {
  // 現在のタスク情報を取得
  const { data: currentTask, error: fetchError } = await supabaseAdmin
    .from('tasks')
    .select('task_group_id, position')
    .eq('id', taskId)
    .single();

  if (fetchError) {
    throw new Error('タスク情報の取得に失敗しました');
  }

  const oldGroupId = currentTask.task_group_id;
  const oldPosition = currentTask.position;

  // 同じグループ内での移動
  if (oldGroupId === newGroupId) {
    // 位置の調整：例えば位置3から位置5に移動する場合、位置4と5のタスクを1つ前に移動
    if (oldPosition < newPosition) {
      await supabaseAdmin.rpc('reorder_tasks_in_group', {
        p_group_id: oldGroupId,
        p_start_pos: oldPosition + 1,
        p_end_pos: newPosition,
        p_offset: -1
      });
    } 
    // 位置5から位置3に移動する場合、位置3,4を1つ後ろに移動
    else if (oldPosition > newPosition) {
      await supabaseAdmin.rpc('reorder_tasks_in_group', {
        p_group_id: oldGroupId,
        p_start_pos: newPosition,
        p_end_pos: oldPosition - 1,
        p_offset: 1
      });
    }
  } 
  // 異なるグループへの移動
  else {
    // 元のグループのタスク位置を調整
    await supabaseAdmin.rpc('reorder_tasks_in_group', {
      p_group_id: oldGroupId,
      p_start_pos: oldPosition + 1,
      p_end_pos: 999999, // 大きな数字を指定して最後まで
      p_offset: -1
    });

    // 新しいグループのタスク位置を調整
    await supabaseAdmin.rpc('reorder_tasks_in_group', {
      p_group_id: newGroupId,
      p_start_pos: newPosition,
      p_end_pos: 999999,
      p_offset: 1
    });
  }

  // タスク自体を更新
  const { error: updateError } = await supabaseAdmin
    .from('tasks')
    .update({
      task_group_id: newGroupId,
      position: newPosition
    })
    .eq('id', taskId);

  if (updateError) {
    throw new Error('タスクの移動に失敗しました');
  }

  return true;
}
```

## エラーハンドリングとリトライ戦略

1. **一時的なエラーの処理**: ネットワークエラーなどの一時的な問題に対しては、指数バックオフを使用したリトライを実装します。

2. **競合の解決**: 楽観的ロックで検出された競合は、最新の状態を再取得して操作をやり直します。

3. **データの整合性チェック**: トランザクション完了後、データの整合性を確認する追加のチェックを実装することを検討します。

## まとめ

- 単純な操作には Supabase クライアントの通常の CRUD 操作を使用します。
- 複数テーブルに影響する複雑な操作では、サーバーサイドで明示的にトランザクションを管理します。
- 頻繁に実行される複雑な操作は、PostgreSQL の関数として実装することで効率化します。
- すべてのトランザクションで適切なエラーハンドリングとロギングを行います。 