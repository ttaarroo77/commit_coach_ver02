"use client"

import ProjectTemplate from "../project-template"
import type { Task, TaskGroup, SubTask } from "@/types/dashboard"

export default function DesignProjectPage() {
  // 型に適合したプロジェクトデータを定義
  const projectData: {
    projectTitle: string;
    taskGroups: TaskGroup[];
    projectColor: string;
  } = {
    projectTitle: "デザインプロジェクト",
    taskGroups: [
      {
        id: "group-3",
        title: "レビュー・改善",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-1",
            title: "ユーザーリサーチ",
            status: "completed" as const,
            progress: 100,
            expanded: true,
            projectId: "design-project",
            priority: "high",
            createdAt: new Date("2025-04-01").toISOString(),
            updatedAt: new Date("2025-04-05").toISOString(),
            completed: true,
            subtasks: [
              { id: "subtask-1-1", title: "ターゲットユーザーの定義", completed: true },
              { id: "subtask-1-2", title: "ユーザーインタビューの実施", completed: true },
              { id: "subtask-1-3", title: "競合分析", completed: true },
            ],
          },
        ],
      },
      {
        id: "group-2",
        title: "デザイン制作",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-5",
            title: "UI設計",
            status: "todo" as const,
            progress: 0,
            expanded: false,
            projectId: "design-project",
            priority: "high",
            createdAt: new Date("2025-04-10").toISOString(),
            updatedAt: new Date("2025-04-10").toISOString(),
            completed: false,
            subtasks: [
              { id: "subtask-3-1", title: "ホーム画面のワイヤーフレーム", completed: true },
              { id: "subtask-3-2", title: "詳細画面のワイヤーフレーム", completed: false },
              { id: "subtask-3-3", title: "設定画面のワイヤーフレーム", completed: false },
            ],
          },
          {
            id: "task-3",
            title: "ワイヤーフレーム作成",
            status: "in-progress" as const,
            progress: 50,
            expanded: false,
            projectId: "design-project",
            priority: "medium",
            createdAt: new Date("2025-04-12").toISOString(),
            updatedAt: new Date("2025-04-15").toISOString(),
            completed: false,
            subtasks: [
              { id: "subtask-4-1", title: "ロゴデザインの作成", completed: true },
              { id: "subtask-4-2", title: "アイコンセットの作成", completed: false },
              { id: "subtask-4-3", title: "UI コンポーネントのデザイン", completed: false },
              { id: "subtask-4-4", title: "レスポンシブデザインの対応", completed: false },
            ],
          },
          {
            id: "task-2",
            title: "ユーザビリティテスト",
            status: "completed" as const,
            progress: 100,
            expanded: false,
            projectId: "design-project",
            priority: "medium",
            createdAt: new Date("2025-04-02").toISOString(),
            updatedAt: new Date("2025-04-08").toISOString(),
            completed: true,
            subtasks: [
              { id: "subtask-5-1", title: "インタラクションデザインの検討", completed: false },
              { id: "subtask-5-2", title: "クリッカブルプロトタイプの作成", completed: false },
              { id: "subtask-5-3", title: "ユーザーテストの実施", completed: false },
            ],
          },
          {
            id: "task-4",
            title: "ユーザージャーニー作成",
            status: "todo" as const,
            progress: 0,
            expanded: false,
            projectId: "design-project",
            priority: "low",
            createdAt: new Date("2025-04-18").toISOString(),
            updatedAt: new Date("2025-04-18").toISOString(),
            completed: false,
            subtasks: [
              { id: "subtask-7-1", title: "使用方法のドキュメント作成", completed: false },
              { id: "subtask-7-2", title: "デザイン原則の文書化", completed: false },
              { id: "subtask-7-3", title: "アクセシビリティガイドラインの作成", completed: false },
            ],
          },
        ],
      },
    ],
    projectColor: "bg-purple-100 text-purple-800",
  }

  return <ProjectTemplate {...projectData} />
}
