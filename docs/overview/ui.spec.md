---
id: ui
title: Design Tokens & Components (Dynamic Edition)
owner: o3
stakeholders: [windsurf]
version: "2025-05-06"
branding:
  palette:
    base: "#FFFFFF"
    accent: "#31A9B8"
    background: "#F9F9F9"   # 新たに背景色を追加（例: Dashboardなどの背景用）
    primary: "#258039"       # プロジェクト固有の色設定
  fonts:
    heading: "system‑ui Bold"
    body: "system‑ui Regular"
    code: "Courier New, monospace"   # コード用フォントの追加
  radius: "0.75rem"
layout:
  common: [Layout, Header, Sidebar, Footer]
  screens: [auth, dashboard, project, task, profile, settings, ai-coach]  # AIコーチング画面を追加
components:
  atoms: 
    [Button, Input, Select, Badge, Avatar, Tooltip]  # Avatar, Tooltipコンポーネントを追加
  molecules: 
    [TaskCard, ProjectCard, AIMessage, TaskList, UserCard]  # 動的なタスク一覧、ユーザーカードを追加
  organisms: 
    [TaskBoard, ProjectList, ProjectOverview, AIChatInterface]  # AIチャットインターフェースとプロジェクト概要追加
accessibility:
  contrast_ratio: ">=4.5"
  keyboard_navigation: true
  screen_reader_support: true   # スクリーンリーダーサポートを強化
performance:
  memoization: required
  lazy_loading: encouraged
  critical_css: true  # クリティカルCSSのインライン化を推奨
---

# UI / UX Principles

デザインはシンプル / 直感的 / アクセシブルを最優先し、ダークモードとレスポンシブ対応を必須とします。Tailwind CSSでトークンをカスタムプロパティとして定義し、StorybookでUIをカタログ化します。

## ダークモード

- ダークモード対応を強化、`@media (prefers-color-scheme: dark)` でテーマを切り替える
- すべてのコンポーネントがダークモードで視認性とアクセシビリティを保つよう調整

## レスポンシブデザイン

- モバイルファーストのアプローチを採用
- グリッドシステムを利用し、全ての画面サイズに対応
- 必要に応じて、コンポーネントの状態をレスポンシブに変更

## ユーザーインタラクション

- **クリックとホバー**の状態を明確にし、フィードバックを即座に表示
- **ダイナミックなコンポーネント**（タスクボードのドラッグ＆ドロップ、プロジェクトのステータス変更など）に対しては、ユーザーがインタラクションの状態を即座に確認できるようにする

# 新しいコンポーネント

- **Avatar**: ユーザーのプロフィール画像表示用コンポーネント（例: ユーザープロフィール、プロジェクトメンバーなど）
- **Tooltip**: コンポーネントやUIエレメントにマウスホバーで表示される補足情報用
- **AIMessage**: AIとの会話履歴表示用のメッセージコンポーネント
- **TaskList**: 動的なタスクの一覧表示と管理
- **ProjectOverview**: プロジェクトの詳細と進行状況をダッシュボードに表示
- **AIChatInterface**: ユーザーとAIが対話するインターフェースコンポーネント

## アクセシビリティガイドライン

- すべてのインタラクションに**キーボードナビゲーション**を対応させ、タッチスクリーンデバイスにも適応
- **スクリーンリーダー**に対応し、すべての重要なUI要素（ボタン、リンク、フォーム）に適切な`aria-label`を設定

## UIコンポーネントライブラリ

すべてのコンポーネントは **Storybook** で管理され、デザインシステムの一部として整理されます。これにより、開発者とデザイナーがコンポーネントを容易に再利用でき、UIの一貫性を保つことができます。

# 動的インタラクションとフィードバック

ユーザーインタラクションのすべてに対して、動的に**視覚的フィードバック**を提供します。特に以下の点を重視します：

- タスク進捗バーやプロジェクトのステータスが変更される際のアニメーション
- ユーザーがデータを操作したとき（例: タスクの並び替え、ステータス変更）の即時フィードバック
- **ロード中のインディケータ**や**エラーメッセージ**は、すべてアクセシブルな形で提供

## ユーザーの反応を迅速に表示

- 状態変更後に表示されるアニメーションを最小限に抑えつつ、ユーザーが変更を反映したかどうかを視覚的に示します。  
- **進捗の表示**や**エラー通知**は、ユーザーが問題を簡単に理解し解決できるように設計します。

---

このUIガイドラインは、これからも柔軟に適応可能であり、動的コンポーネントの追加・変更を容易にする構造を取っています。新しい要素の追加や、プロジェクト特有のUI変更が発生した際にもスムーズにアップデートできます。