"use client"

import ProjectTemplate from "../project-template"

export default function MobileAppProjectPage() {
  const projectData = {
    projectTitle: "モバイルアプリ開発",
    taskGroups: [
      {
        id: "group-1",
        title: "開発環境構築・技術選定",
        expanded: true,
        tasks: [
          {
            id: "task-1",
            title: "開発環境セットアップ (ローカル環境、開発ツール設定)",
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
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-2-1", title: "状態管理ライブラリの選定 (Redux, MobX, Zustand など)", completed: true },
              { id: "subtask-2-2", title: "UI コンポーネントライブラリの選定", completed: false },
              { id: "subtask-2-3", title: "ナビゲーションライブラリの選定", completed: false },
              { id: "subtask-2-4", title: "データベース/ストレージの選定", completed: false },
            ],
          },
        ],
      },
      {
        id: "group-2",
        title: "UI/UX 設計・実装",
        expanded: true,
        tasks: [
          {
            id: "task-3",
            title: "画面設計・ワイヤーフレーム作成",
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
        title: "バックエンド連携・API実装",
        expanded: false,
        tasks: [
          {
            id: "task-5",
            title: "API クライアント実装",
            completed: false,
            expanded: false,
            subtasks: [
              { id: "subtask-5-1", title: "HTTP クライアントの設定 (Axios など)", completed: false },
              { id: "subtask-5-2", title: "API エンドポイント定義", completed: false },
              { id: "subtask-5-3", title: "認証処理の実装", completed: false },
            ],
          },
          {
            id: "task-6",
            title: "データ同期処理実装",
            completed: false,
            expanded: false,
            subtasks: [
              { id: "subtask-6-1", title: "オフライン対応の実装", completed: false },
              { id: "subtask-6-2", title: "データキャッシュ処理", completed: false },
              { id: "subtask-6-3", title: "バックグラウンド同期処理", completed: false },
            ],
          },
        ],
      },
    ],
    projectColor: "#258039",
  }

  return <ProjectTemplate {...projectData} />
}
