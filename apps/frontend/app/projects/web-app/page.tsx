"use client"

import ProjectTemplate from "../project-template"

export default function WebAppProjectPage() {
  const projectData = {
    projectTitle: "ウェブアプリ開発",
    projectColor: "#31A9B8",
    taskGroups: [
      {
        id: "group-1",
        title: "プロジェクト準備",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-1",
            title: "開発環境を構築する",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-1-1", title: "Node.js, npm (または yarn, pnpm) のインストール", completed: true },
              { id: "subtask-1-2", title: "Next.js プロジェクトの作成 (create-next-app)", completed: true },
              { id: "subtask-1-3", title: "TypeScript の設定", completed: false },
              { id: "subtask-1-4", title: "Tailwind CSS の設定", completed: false },
              { id: "subtask-1-5", title: "Git リポジトリの初期化", completed: false },
            ],
          },
          {
            id: "task-2",
            title: "デザイン要件を確認する",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-2-1", title: "デザイン要件定義書を入手する", completed: true },
              { id: "subtask-2-2", title: "デザイン要件定義書を読み込む", completed: false },
              { id: "subtask-2-3", title: "UI/UX デザインの全体像を把握する", completed: false },
              { id: "subtask-2-4", title: "コンポーネント設計を検討する", completed: false },
            ],
          },
        ],
      },
      {
        id: "group-2",
        title: "フロントエンド開発 (React, Tailwind CSS, TypeScript, Next.js)",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-3",
            title: "UI コンポーネントを作成する",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-3-1", title: "Todo アイテムコンポーネントを作成する", completed: false },
              { id: "subtask-3-2", title: "Todo リストコンポーネントを作成する", completed: false },
              { id: "subtask-3-3", title: "Todo 入力フォームコンポーネントを作成する", completed: false },
              {
                id: "subtask-3-4",
                title: "フィルター機能コンポーネントを作成する (例: 全て、未完了、完了)",
                completed: false,
              },
              { id: "subtask-3-5", title: "スタイルを Tailwind CSS で実装する", completed: false },
            ],
          },
          {
            id: "task-4",
            title: "状態管理を実装する (例: useState, useContext, Redux, Zustand など)",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-4-1", title: "Todo アイテムの状態 (テキスト、完了状態) を管理する", completed: false },
              { id: "subtask-4-2", title: "Todo リストの状態を管理する", completed: false },
              { id: "subtask-4-3", title: "フィルターの状態を管理する", completed: false },
            ],
          },
          {
            id: "task-5",
            title: "API クライアントを実装する (Next.js API Routes 連携)",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-5-1", title: "Todo アイテムの取得 API クライアント関数を作成する", completed: false },
              { id: "subtask-5-2", title: "Todo アイテムの追加 API クライアント関数を作成する", completed: false },
              { id: "subtask-5-3", title: "Todo アイテムの更新 API クライアント関数を作成する", completed: false },
              { id: "subtask-5-4", title: "Todo アイテムの削除 API クライアント関数を作成する", completed: false },
            ],
          },
        ],
      },
      {
        id: "group-3",
        title: "バックエンド開発 (Node.js, Next.js API Routes)",
        expanded: false,
        completed: false,
        tasks: [
          {
            id: "task-6",
            title: "API エンドポイントを設計する",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: false,
            subtasks: [
              { id: "subtask-6-1", title: "Todo アイテム取得 API (/api/todos - GET)", completed: false },
              { id: "subtask-6-2", title: "Todo アイテム追加 API (/api/todos - POST)", completed: false },
              { id: "subtask-6-3", title: "Todo アイテム更新 API (/api/todos/[id] - PUT/PATCH)", completed: false },
              { id: "subtask-6-4", title: "Todo アイテム削除 API (/api/todos/[id] - DELETE)", completed: false },
            ],
          },
          {
            id: "task-7",
            title: "API ロジックを実装する",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: false,
            subtasks: [
              { id: "subtask-7-1", title: "Todo アイテムのデータモデルを定義する", completed: false },
              {
                id: "subtask-7-2",
                title: "Todo アイテムの永続化処理を実装する (例: JSON ファイル、データベース)",
                completed: false,
              },
              { id: "subtask-7-3", title: "各 API エンドポイントの処理ロジックを実装する", completed: false },
            ],
          },
        ],
      },
    ],
  }

  return <ProjectTemplate {...projectData} />
}
