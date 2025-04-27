"use client"

import ProjectTemplate from "../project-template"

export default function DesignProjectPage() {
  const projectData = {
    projectTitle: "デザインプロジェクト",
    taskGroups: [
      {
        id: "group-1",
        title: "リサーチ・企画",
        expanded: true,
        tasks: [
          {
            id: "task-1",
            title: "ユーザーリサーチ",
            completed: true,
            expanded: true,
            subtasks: [
              { id: "subtask-1-1", title: "ターゲットユーザーの定義", completed: true },
              { id: "subtask-1-2", title: "ユーザーインタビューの実施", completed: true },
              { id: "subtask-1-3", title: "競合分析", completed: true },
            ],
          },
          {
            id: "task-2",
            title: "デザインコンセプト策定",
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-2-1", title: "ムードボードの作成", completed: true },
              { id: "subtask-2-2", title: "カラーパレットの選定", completed: true },
              { id: "subtask-2-3", title: "タイポグラフィの選定", completed: false },
              { id: "subtask-2-4", title: "デザイン方針のドキュメント化", completed: false },
            ],
          },
        ],
      },
      {
        id: "group-2",
        title: "UI設計・デザイン",
        expanded: true,
        tasks: [
          {
            id: "task-3",
            title: "ワイヤーフレーム作成",
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-3-1", title: "ホーム画面のワイヤーフレーム", completed: true },
              { id: "subtask-3-2", title: "詳細画面のワイヤーフレーム", completed: false },
              { id: "subtask-3-3", title: "設定画面のワイヤーフレーム", completed: false },
            ],
          },
          {
            id: "task-4",
            title: "ビジュアルデザイン",
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-4-1", title: "ロゴデザインの作成", completed: true },
              { id: "subtask-4-2", title: "アイコンセットの作成", completed: false },
              { id: "subtask-4-3", title: "UI コンポーネントのデザイン", completed: false },
              { id: "subtask-4-4", title: "レスポンシブデザインの対応", completed: false },
            ],
          },
          {
            id: "task-5",
            title: "プロトタイプ作成",
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-5-1", title: "インタラクションデザインの検討", completed: false },
              { id: "subtask-5-2", title: "クリッカブルプロトタイプの作成", completed: false },
              { id: "subtask-5-3", title: "ユーザーテストの実施", completed: false },
            ],
          },
        ],
      },
      {
        id: "group-3",
        title: "デザインシステム構築",
        expanded: false,
        tasks: [
          {
            id: "task-6",
            title: "コンポーネントライブラリ作成",
            completed: false,
            expanded: false,
            subtasks: [
              { id: "subtask-6-1", title: "基本コンポーネントの定義", completed: false },
              { id: "subtask-6-2", title: "コンポーネントの命名規則の策定", completed: false },
              { id: "subtask-6-3", title: "コンポーネントのバリエーション定義", completed: false },
            ],
          },
          {
            id: "task-7",
            title: "デザインガイドライン作成",
            completed: false,
            expanded: false,
            subtasks: [
              { id: "subtask-7-1", title: "使用方法のドキュメント作成", completed: false },
              { id: "subtask-7-2", title: "デザイン原則の文書化", completed: false },
              { id: "subtask-7-3", title: "アクセシビリティガイドラインの作成", completed: false },
            ],
          },
        ],
      },
    ],
    projectColor: "#F5BE41",
  }

  return <ProjectTemplate {...projectData} />
}
