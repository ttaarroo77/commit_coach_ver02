# コミットコーチ フロントエンド

## 概要

コミットコーチは、開発者がタスクを効率的に管理し、先延ばしを防止するためのWebアプリケーションです。直感的なタスク管理機能とAIコーチング機能を提供し、プロジェクト、タスクグループ、タスク、サブタスクの階層構造で作業を整理します。期限管理と進捗の可視化によって生産性向上をサポートします。

## 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (useState, useContext)
- **ドラッグ&ドロップ**: react-beautiful-dnd
- **日付操作**: date-fns
- **アイコン**: Lucide React
- **UI コンポーネント**: shadcn/ui

## ディレクトリ構成

\`\`\`
frontend/
├── app/                    # Next.js App Router ページ
│   ├── dashboard/          # ダッシュボード画面
│   ├── projects/           # プロジェクト関連画面
│   │   ├── [id]/           # プロジェクト詳細画面
│   │   ├── project-template.tsx # プロジェクト共通テンプレート
│   ├── settings/           # 設定画面
│   ├── mypage/             # マイページ
│   ├── login/              # ログイン画面
│   ├── register/           # 新規登録画面
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ランディングページ
│   └── globals.css         # グローバルスタイル
├── components/             # 再利用可能なコンポーネント
│   ├── ai-chat.tsx         # AIチャットコンポーネント
│   ├── date-picker.tsx     # 日付選択コンポーネント
│   ├── sidebar.tsx         # サイドバーナビゲーション
│   ├── task-item.tsx       # タスクアイテム
│   ├── task-breakdown.tsx  # タスク分解コンポーネント
│   ├── ui/                 # 基本UIコンポーネント (shadcn/ui)
│   └── icons.tsx           # カスタムアイコン
├── hooks/                  # カスタムフック
│   ├── use-mobile.tsx      # モバイル検出フック
│   └── use-toast.ts        # トースト通知フック
├── lib/                    # ユーティリティ関数
│   ├── api.ts              # APIクライアント
│   ├── auth.ts             # 認証関連ユーティリティ
│   └── utils.ts            # 汎用ユーティリティ
├── types/                  # 型定義
│   ├── project.ts          # プロジェクト関連の型
│   ├── task.ts             # タスク関連の型
│   └── user.ts             # ユーザー関連の型
├── context/                # Reactコンテキスト
│   ├── auth-context.tsx    # 認証コンテキスト
│   └── project-context.tsx # プロジェクト管理コンテキスト
├── public/                 # 静的アセット
├── next.config.mjs         # Next.js設定
├── tailwind.config.ts      # Tailwind CSS設定
├── tsconfig.json           # TypeScript設定
└── package.json            # 依存関係とスクリプト
\`\`\`

## 主要機能

### 1. 認証機能
- ユーザー登録
- ログイン/ログアウト
- プロフィール管理

### 2. ダッシュボード
- 今日のタスク表示
- 未定のタスク表示
- 現在時刻表示
- タスクの追加/編集/削除
- タスクの完了状態管理
- タスクのドラッグ&ドロップ並べ替え
- タスクの展開/折りたたみ
- AIコーチングセクション

### 3. プロジェクト管理
- プロジェクト一覧表示
- プロジェクト作成/編集/削除
- プロジェクト詳細表示
- プロジェクトの色分け
- タスクグループ管理
- タスク管理
- サブタスク管理
- 期限管理
- 完了状態管理
- ドラッグ&ドロップ並べ替え

### 4. AIコーチング
- AIチャットインターフェース
- タスク進捗に基づいたアドバイス
- モチベーション維持のための対話
- タスク分解サポート
- 音声入力によるタスク追加

### 5. 設定
- AIコーチ設定
- 通知設定
- アプリ設定

## コンポーネント設計

### 共通コンポーネント

#### サイドバー (`components/sidebar.tsx`)
- プロジェクト一覧表示
- ナビゲーションリンク
- プロジェクト追加ボタン

#### AIチャット (`components/ai-chat.tsx`)
- メッセージ表示エリア
- 入力フォーム
- 送信ボタン

#### タスクアイテム (`components/task-item.tsx`)
- チェックボックス
- タスクタイトル
- 期限表示
- タグ表示
- アクションボタン

#### 日付ピッカー (`components/date-picker.tsx`)
- 日付入力フィールド
- カレンダー表示
- 時間選択

#### タスク分解 (`components/task-breakdown.tsx`)
- 目的入力
- 目標値入力
- 制約条件入力
- AI分解結果表示

### ページコンポーネント

#### ランディングページ (`app/page.tsx`)
- ヒーローセクション
- 機能紹介
- 登録/ログインボタン

#### ダッシュボード (`app/dashboard/page.tsx`)
- 今日のタスクセクション
- 未定のタスクセクション
- 現在時刻表示
- AIコーチングセクション

#### プロジェクト詳細 (`app/projects/[id]/page.tsx`)
- プロジェクト情報
- タスクグループ一覧
- タスク一覧
- サブタスク一覧
- AIコーチングセクション

#### 設定画面 (`app/settings/page.tsx`)
- AIコーチ設定タブ
- 通知設定タブ
- アプリ設定タブ

#### マイページ (`app/mypage/page.tsx`)
- ユーザー情報表示
- プロフィール編集
- パスワード変更

## 状態管理

### ローカル状態
- React Hooks (`useState`, `useReducer`) を使用
- コンポーネント固有の状態管理

### グローバル状態
- React Context API を使用
- 認証状態 (`AuthContext`)
- プロジェクト状態 (`ProjectContext`)

## API連携

### APIクライアント (`lib/api.ts`)
- Fetch APIを使用したHTTPリクエスト
- エラーハンドリング
- 認証トークン管理

### エンドポイント
- 認証API (`/api/v1/auth/*`)
- ユーザーAPI (`/api/v1/users/*`)
- プロジェクトAPI (`/api/v1/projects/*`)
- タスクグループAPI (`/api/v1/groups/*`)
- タスクAPI (`/api/v1/tasks/*`)
- サブタスクAPI (`/api/v1/subtasks/*`)
- AIメッセージAPI (`/api/v1/projects/:projectId/ai/messages`)

## レスポンシブデザイン

- モバイルファーストアプローチ
- Tailwind CSSのブレークポイント活用
- モバイル: `< 640px`
- タブレット: `640px - 1024px`
- デスクトップ: `> 1024px`

## アクセシビリティ

- セマンティックHTML
- 適切なARIA属性
- キーボードナビゲーション
- スクリーンリーダー対応
- 十分なコントラスト比

## パフォーマンス最適化

- コンポーネントのメモ化 (`React.memo`, `useMemo`, `useCallback`)
- 画像最適化 (Next.js Image)
- コード分割 (Dynamic Import)
- SSR/SSG活用 (Next.js)

## テスト戦略

- 単体テスト: Jest + React Testing Library
- コンポーネントテスト: Storybook
- E2Eテスト: Cypress

## 開発ガイドライン

### コーディング規約
- ESLint + Prettier を使用
- 関数コンポーネントとHooksを優先
- 型安全性を確保 (TypeScript)

### コンポーネント設計原則
- 単一責任の原則
- 再利用可能なコンポーネント
- Props経由のデータフロー
- 適切な粒度の分割

### スタイリング規約
- Tailwind CSSのユーティリティクラスを優先
- コンポーネント固有のスタイルはモジュール化
- 一貫したデザイントークン使用

## 環境変数

| 変数名                   | 必須 | 説明                                |
|--------------------------|------|-------------------------------------|
| `NEXT_PUBLIC_API_URL`    | Yes  | バックエンドAPIのベースURL          |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase プロジェクトURL           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase 匿名キー             |
| `OPENAI_API_KEY`         | Yes  | OpenAI API キー (AIコーチング用)    |

## ビルド・デプロイ

### 開発環境
\`\`\`bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
\`\`\`

### 本番ビルド
\`\`\`bash
# 本番ビルド
npm run build

# ビルド結果の起動
npm run start
\`\`\`

### デプロイ
- Vercelへの自動デプロイ
- GitHub Actionsによる継続的インテグレーション

## 将来的な拡張計画

### 短期的拡張（3-6ヶ月）
- 通知システムの実装
- タスクのリマインダー機能
- 日次/週次レポート機能
- タスク完了時のお祝い表示

### 中期的拡張（6-12ヶ月）
- GitHub連携によるコミット情報の自動取得
- カレンダー連携（Google Calendar, Outlook）
- タスクテンプレート機能
- タイムトラッキング機能

### 長期的拡張（12ヶ月以上）
- チーム連携機能
- モバイルアプリ開発（iOS/Android）
- 高度なAI分析と予測
- サードパーティ連携（Slack, Jira, Trello）

---

このREADMEは、コミットコーチのフロントエンド実装に関する要件定義と開発ガイドラインを提供します。バックエンドとの連携方法や、フロントエンドの構造、主要機能、コンポーネント設計などを詳細に記述しています。開発チームはこのドキュメントを参照して、一貫性のあるフロントエンド開発を進めることができます。
