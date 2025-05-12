# コミットコーチ プロジェクト構造

\`\`\`
commit-coach/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── projects/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── project-template.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ai-chat-input.tsx
│   ├── ai-chat.tsx
│   ├── date-picker.tsx
│   ├── hierarchical-task-item.tsx
│   ├── icons.tsx
│   ├── sidebar.tsx
│   ├── task-breakdown.tsx
│   ├── task-group.tsx
│   ├── task-item-with-menu.tsx
│   ├── task-item.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       ├── separator.tsx
│       ├── tabs.tsx
│       └── use-toast.ts
├── context/
│   └── auth-context.tsx
├── lib/
│   ├── auth.ts
│   ├── dashboard-utils.ts
│   ├── project-utils.ts
│   ├── supabase.ts
│   └── utils.ts
├── middleware.ts
├── package.json
├── README.md
├── frontend/
│   └── README.md
└── tree.md
\`\`\`

## ディレクトリ構造の説明

### app/ ディレクトリ
Next.js App Routerを使用したアプリケーションのルーティング構造です。

- **dashboard/**: ダッシュボード画面
- **forgot-password/**: パスワード忘れ画面
- **login/**: ログイン画面
- **projects/**: プロジェクト関連画面
  - **[id]/**: 個別プロジェクト詳細画面（動的ルーティング）
  - **project-template.tsx**: プロジェクト共通テンプレート
- **register/**: 新規登録画面
- **globals.css**: グローバルスタイル
- **layout.tsx**: ルートレイアウト
- **page.tsx**: ランディングページ

### components/ ディレクトリ
再利用可能なReactコンポーネントを格納しています。

- **ai-chat-input.tsx**: AIチャット入力コンポーネント
- **ai-chat.tsx**: AIチャットコンポーネント
- **date-picker.tsx**: 日付選択コンポーネント
- **hierarchical-task-item.tsx**: 階層構造を持つタスクアイテム
- **icons.tsx**: カスタムアイコン
- **sidebar.tsx**: サイドバーナビゲーション
- **task-breakdown.tsx**: タスク分解コンポーネント
- **task-group.tsx**: タスクグループコンポーネント
- **task-item-with-menu.tsx**: メニュー付きタスクアイテム
- **task-item.tsx**: 基本タスクアイテム
- **ui/**: shadcn/uiベースの基本UIコンポーネント

### context/ ディレクトリ
Reactコンテキストを格納しています。

- **auth-context.tsx**: 認証コンテキスト

### lib/ ディレクトリ
ユーティリティ関数を格納しています。

- **auth.ts**: 認証関連ユーティリティ
- **dashboard-utils.ts**: ダッシュボード関連ユーティリティ
- **project-utils.ts**: プロジェクト関連ユーティリティ
- **supabase.ts**: Supabase連携ユーティリティ
- **utils.ts**: 汎用ユーティリティ

### その他のファイル
- **middleware.ts**: Next.jsミドルウェア（認証など）
- **package.json**: プロジェクト依存関係
- **README.md**: プロジェクト説明
- **frontend/README.md**: フロントエンド開発ガイド
- **tree.md**: このファイル（プロジェクト構造）
