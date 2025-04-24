"use client"

import ProjectTemplate from "../project-template"

export default function MobileAppProjectPage() {
  const projectData = {
    projectTitle: "モバイルアプリ開発",
    projectColor: "#4F46E5", // インディゴ
    taskGroups: [
      {
        id: "group-1",
        title: "開発環境構築・技術選定",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-1",
            title: "開発環境セットアップ (ローカル環境、開発ツール設定)",
            status: "completed" as const,
            progress: 100,
            completed: true,
            expanded: true,
            subtasks: [
              { id: "subtask-1-1", title: "React Native 開発環境のセットアップ", completed: true },
              { id: "subtask-1-2", title: "Expo CLI のインストール", completed: true },
              { id: "subtask-1-3", title: "エミュレータ/シミュレータの設定", completed: true },
            ],
          },
          {
            id: "task-2",
            title: "主要技術選定 (フレームワーク、ライブラリ、DBなど)",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-2-1", title: "状態管理ライブラリの選定 (Redux, MobX, Zustand など)", completed: true },
              { id: "subtask-2-2", title: "UI コンポーネントライブラリの選定", completed: false },
              { id: "subtask-2-3", title: "アプリ用データベースの選定", completed: false },
            ],
          },
        ],
      },
      {
        id: "group-2",
        title: "UI/UX デザイン",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-3",
            title: "画面設計・ワイヤーフレーム作成",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-3-1", title: "ログイン/登録画面のワイヤーフレーム", completed: true },
              { id: "subtask-3-2", title: "メイン画面のワイヤーフレーム", completed: false },
              { id: "subtask-3-3", title: "設定画面のワイヤーフレーム", completed: false },
            ],
          },
          {
            id: "task-4",
            title: "UI コンポーネント実装",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-4-1", title: "共通ボタンコンポーネント", completed: false },
              { id: "subtask-4-2", title: "フォームコンポーネント", completed: false },
              { id: "subtask-4-3", title: "リスト表示コンポーネント", completed: false },
              { id: "subtask-4-4", title: "カード表示コンポーネント", completed: false },
            ],
          },
        ],
      },
      {
        id: "group-3",
        title: "フロントエンド実装",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-5",
            title: "認証・ユーザー管理画面実装",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-5-1", title: "ログイン画面実装", completed: false },
              { id: "subtask-5-2", title: "ユーザー登録画面実装", completed: false },
              { id: "subtask-5-3", title: "プロフィール画面実装", completed: false },
            ],
          },
          {
            id: "task-6",
            title: "メイン機能実装",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-6-1", title: "ホーム画面実装", completed: false },
              { id: "subtask-6-2", title: "詳細画面実装", completed: false },
              { id: "subtask-6-3", title: "検索機能実装", completed: false },
            ],
          },
        ],
      },
      {
        id: "group-4",
        title: "バックエンド連携",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-7",
            title: "API接続実装",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-7-1", title: "HTTP クライアントの設定 (Axios など)", completed: false },
              { id: "subtask-7-2", title: "API エンドポイント定義", completed: false },
              { id: "subtask-7-3", title: "エラーハンドリング", completed: false },
            ],
          },
          {
            id: "task-8",
            title: "データ同期・オフライン対応",
            status: "todo" as const,
            progress: 0,
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-8-1", title: "ローカルキャッシュ実装", completed: false },
              { id: "subtask-8-2", title: "オフライン時のデータ処理", completed: false },
              { id: "subtask-8-3", title: "再接続時の同期処理", completed: false },
            ],
          },
        ],
      },
    ],
  }

  return <ProjectTemplate {...projectData} />
}
