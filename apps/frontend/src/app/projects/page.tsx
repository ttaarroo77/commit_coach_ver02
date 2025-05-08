"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProjectTemplate from "./project-template"

export default function ProjectsPage() {
   // 3つのプロジェクトのデータを定義
   const projectsData = {
      webApp: {
         projectTitle: "プロジェクト一覧",
         taskGroups: [
            {
               id: "group-1",
               title: "プロジェクト準備",
               expanded: true,
               tasks: [
                  {
                     id: "task-1",
                     title: "開発環境を構築する",
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
               tasks: [
                  {
                     id: "task-3",
                     title: "UI コンポーネントを作成する",
                     completed: false,
                     expanded: true,
                     subtasks: [
                        { id: "subtask-3-1", title: "Todo アイテムコンポーネントを作成する", completed: false },
                        { id: "subtask-3-2", title: "Todo リストコンポーネントを作成する", completed: false },
                        { id: "subtask-3-3", title: "Todo 入力フォームコンポーネントを作成する", completed: false },
                        { id: "subtask-3-4", title: "フィルター機能コンポーネントを作成する (例: 全て、未完了、完了)", completed: false },
                        { id: "subtask-3-5", title: "スタイルを Tailwind CSS で実装する", completed: false },
                     ],
                  },
                  {
                     id: "task-4",
                     title: "状態管理を実装する (例: useState, useContext, Redux, Zustand など)",
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
               tasks: [
                  {
                     id: "task-6",
                     title: "API エンドポイントを設計する",
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
                     completed: false,
                     expanded: false,
                     subtasks: [
                        { id: "subtask-7-1", title: "Todo アイテムのデータモデルを定義する", completed: false },
                        { id: "subtask-7-2", title: "Todo アイテムの永続化処理を実装する (例: JSON ファイル、データベース)", completed: false },
                        { id: "subtask-7-3", title: "各 API エンドポイントの処理ロジックを実装する", completed: false },
                     ],
                  },
               ],
            },
         ],
         projectColor: "#31A9B8",
      },
      mobileApp: {
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
      },
      design: {
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
      },
   }

   // 現在選択中のプロジェクト
   const [currentProject, setCurrentProject] = useState("webApp")

   return (
      <div className="space-y-6">
         <Tabs defaultValue="webApp" onValueChange={setCurrentProject} className="w-full">
            {/* <TabsList className="mb-4">
               <TabsTrigger value="webApp" className="px-4">
                  ウェブアプリ開発
               </TabsTrigger>
               <TabsTrigger value="mobileApp" className="px-4">
                  モバイルアプリ開発
               </TabsTrigger>
               <TabsTrigger value="design" className="px-4">
                  デザインプロジェクト
               </TabsTrigger>
            </TabsList> */}

            <TabsContent value="webApp" className="space-y-4">
               <ProjectTemplate {...projectsData.webApp} />
            </TabsContent>

            <TabsContent value="mobileApp" className="space-y-4">
               <ProjectTemplate {...projectsData.mobileApp} />
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
               <ProjectTemplate {...projectsData.design} />
            </TabsContent>
         </Tabs>
      </div>
   )
}
