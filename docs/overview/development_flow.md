---
id: development_flow
title: "Commit Coach 開発フロー – モノレポ構成 (Next.js + Express)"
description: "フロントエンド (Next.js + TypeScript + Tailwind CSS) とバックエンド (Express + TypeScript + Supabase) の開発ロードマップと詳細チェックリスト"
version: "7.0"
last_updated: "2025-05-06"
owner: "nakazawatarou"
stakeholders: ["dev_team", "ai_assistant"]
---

# Commit Coach 開発フロー - モノレポ構成 (Next.js + Express)

## 概要

このドキュメントでは、**Commit Coach** プロジェクトの開発フローをまとめています。フロントエンドは Next.js + TypeScript + Tailwind CSS、バックエンドは Express + TypeScript + Supabase を使用しており、AIアシスタントと連携して効率的に開発を進めるためのロードマップとチェックリストを提供します。

---

## 1. 開発環境の準備

### 1.1 プロジェクト構造の整理

* モノレポ構成の初期化
* 開発環境のセットアップ
* CI/CDパイプラインの準備
* フロントエンドとバックエンドの基盤構築

### 1.2 フロントエンドの基盤構築

* **認証フロー** の実装（ログイン/ログアウト、ユーザー登録、セッション管理）
* **ダッシュボード** のレイアウト設計
* **プロジェクト管理**、**タスク管理** のインタラクション実装
* **UIコンポーネント**（ボタン、フォーム、タスクカード、プロジェクトカードなど）の実装
* **レスポンシブ対応** を加え、全画面サイズに対応
* 動的データ表示を実装（SWRやuseEffectでAPIからデータを取得）

```typescript
// APIからプロジェクトデータを取得するカスタムフック例
const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return { projects, loading };
};
```

---

## 2. バックエンドの基盤構築

### 2.1 API設計

* 認証API、プロジェクトAPI、タスクAPI、ユーザーAPIの設計
* JWTを使用した認証、セッション管理

### 2.2 データベース設計

* Supabaseを使用し、ユーザー、プロジェクト、タスクのテーブルを設計
* 外部キー、インデックス、RLS (Row Level Security) を使用してデータアクセス制御

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.3 バックエンドAPIの実装

* CRUD操作：ユーザー、プロジェクト、タスクの操作をAPIエンドポイントとして実装
* エラーハンドリングとバリデーション

---

## 3. 動的フロントエンドの実装

### 3.1 API連携

フロントエンドはバックエンドのAPIと連携し、動的にデータを取得して表示します。例えば、タスクのステータス変更やプロジェクトの管理画面などを動的に表示します。

* APIからデータを取得し、コンポーネントの状態として管理
* **SWR** などのフックを使って、非同期データの取得とキャッシュを最適化

```typescript
const useTasks = () => {
  const { data, error } = useSWR('/api/tasks', fetch);
  if (error) return <div>Error loading tasks</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <ul>
      {data.map((task: Task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
};
```

### 3.2 インタラクションとUIの改善

* タスクやプロジェクトの変更時に、状態を即座に反映するようなリアルタイムの反映を行う
* タスクの進捗やプロジェクトの更新に応じてUIが動的に変わるようにする

```tsx
import { DndContext } from '@dnd-kit/core';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    // ドラッグ&ドロップでタスクの順番を変更
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* タスクボード表示 */}
    </DndContext>
  );
};
```

---

## 4. テストの実行

### 4.1 ユニットテスト

* **Jest** や **React Testing Library** を使ってフロントエンドのユニットテストを実装
* 各コンポーネントが予想通りに動作するかをテスト

### 4.2 統合テスト

* フロントエンドとバックエンドの統合テストを実施し、APIが正しくデータを返すか、フロントエンドがそれを適切に表示するかを確認

### 4.3 E2Eテスト

* **Cypress** を使って、ユーザーの操作フロー（認証 → ダッシュボード → タスク管理）をテスト

---

## 5. CI/CDの設定

### 5.1 GitHub Actionsの設定

* 自動でコードチェック（lint）、テスト、デプロイを実行するために **GitHub Actions** を設定

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
```

### 5.2 デプロイ

* **Vercel**（フロントエンド）と**Fly.io**（バックエンド）を使って自動デプロイを設定
* 本番環境へのデプロイをGitHub Actionsに統合し、プッシュ後に自動でデプロイされる

---

## 6. モニタリングと運用

### 6.1 モニタリングシステムの構築

* アプリケーションとインフラの両方を監視
* アラート設定とダッシュボードによるパフォーマンスの監視

### 6.2 ログ管理

* **Pino** ロガーを使用してバックエンドのログを収集
* **CloudWatch** や **Logtail** を使用してログを可視化

---

## 7. AIアシスタントとの協業

### 7.1 要件定義とAPI設計

* AIアシスタントと協力し、APIの仕様書や要件定義を作成し、コードを自動生成します。

### 7.2 テスト戦略

* **AI** がテストケースを自動生成し、人間がエッジケースを特定して、テストを実施

---

## 8. まとめと今後の展望

動的なフロントエンドとバックエンドの連携を実現した後、各機能をしっかりとテストし、CI/CDパイプラインを使ってデプロイを自動化します。AIアシスタントとの協力によって効率的に開発を進め、コード品質を高めることができます。

---

## 9. 開発チェックリスト - 動的フロントエンドへのアップデート

このチェックリストでは、現在の静的なフロントエンドを、より動的でインタラクティブなものにアップデートするためのステップを示しています。以下の手順を順番に実行し、GitHubリポジトリの更新を行ってください。

### 9.1 API連携とデータの動的取得

* [x] **APIエンドポイントの確認**
  * 必要なAPI（`/projects`、`/tasks`など）がバックエンドで実装されていることを確認。
* [x] **データ取得のフック作成**
  * `useProjects`、`useTasks` などのカスタムフックを作成し、フロントエンドでAPIからデータを動的に取得。
  * `useDashboardTasks`などのフックを実装してローカルストレージとの連携を確立。
* [ ] **SWRの利用**
  * SWRを使用してデータをキャッシュし、パフォーマンス向上を図ります。

```typescript
import useSWR from 'swr';

function useProjectsWithSWR() {
  const { data, error, isLoading, mutate } = useSWR('/api/projects', async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('プロジェクトの取得に失敗しました');
    }
    return response.json();
  });

  return {
    projects: data || [],
    isLoading,
    error,
    refresh: mutate
  };
}
```

### 9.2 ダッシュボードの動的表示とインタラクション

* [ ] **ダッシュボード表示の動的化**

  * プロジェクト一覧やタスクボードが動的に表示されることを確認。
  * 必要に応じてタスクのステータス（`todo`、`in_progress`、`done`）ごとにフィルタリング。

* [ ] \*\*
