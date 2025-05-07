---
id: architecture
title: コミットコーチ - システムアーキテクチャ & DevOps
owner: commit_coach_team
stakeholders: [dev_team, product_manager]
tasks_note: 必ず、終わったタスクには[x]印をつけて、ここに報連相の記録を残すこと
---

# コミットコーチ - モノレポアーキテクチャ設計

## 技術スタック概要

- **フロントエンド**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **バックエンド**: Express 5 + TypeScript + Supabase SDK
- **共有パッケージ**:
  - shared-types: Zod schemas for task/project data models
  - ai-coach: AI coaching logic and prompts
- **デプロイ先**:
  - フロントエンド: Vercel
  - バックエンド: Fly.io

## プロジェクト構造

```
commit_coach/
├── apps/
│   ├── backend/     # バックエンドアプリケーション
│   └── frontend/    # フロントエンドアプリケーション
├── docs/            # プロジェクトドキュメント
│   └── overview/    # アーキテクチャと開発フロー
├── supabase/        # Supabase設定
└── cleanup_plan/    # プロジェクト整理計画
```

## 関連ドキュメント

- **docs/overview/**: 公式プロジェクトドキュメント
  - `architecture.spec.md`: アーキテクチャ仕様（本ドキュメント）
  - `development_flow.md`: 開発フロー

- **cleanup_plan/**: プロジェクト整理計画
  - `cleanup_strategy.md`: 全体的な整理方針
  - `frontend_cleanup.md`: フロントエンド整理手順
  - `backend_cleanup.md`: バックエンド整理手順
  - `project_structure_cleanup.md`: プロジェクト構造整理手順
  - `execution_checklist.md`: 実行チェックリスト

**注意**: `www_extra.md`ディレクトリには古いドキュメントが含まれており、参照用として保持されていますが、最新の情報は上記の公式ドキュメントを参照してください。
  - エッジ関数: Supabase Edge Functions

## 非機能要件

- **パフォーマンス**: レスポンス時間 <=500ms、同時接続 1000
- **セキュリティ**: JWT認証、Supabase RLS、OWASP top-10対策
- **監視**: HTTPログ、Supabaseログ、Sentry、Vercel Analytics

## 開発ガイドライン

- **CI/CD**: GitHub Actions (lint, test, build, deploy)
- **コードスタイル**: eslint + prettier + commitlint
- **ブランチ戦略**: trunk-based with short-lived feature branches
- **UIフレームワーク**: Tailwind CSS + shadcn/ui

## 環境変数

- **グローバル**: NODE_ENV, SUPABASE_URL
- **フロントエンド**: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, OPENAI_API_KEY
- **バックエンド**: SUPABASE_SERVICE_KEY, PORT, OPENAI_API_KEY, JWT_SECRET

## 1. ディレクトリ構造（最終最適化版）

```plaintext
commit_coach/
├── apps/
│   ├── frontend/           # Next.js フロントエンド
│   │   ├── src/
│   │   │   ├── app/        # App Router ページ
│   │   │   │   ├── layout.tsx        # ルートレイアウト
│   │   │   │   ├── page.tsx          # ランディングページ
│   │   │   │   ├── globals.css       # グローバルスタイル
│   │   │   │   ├── dashboard/        # ダッシュボード
│   │   │   │   │   └── page.tsx      # ダッシュボードページ
│   │   │   │   ├── projects/         # プロジェクト
│   │   │   │   │   ├── project-template.tsx  # プロジェクト共通テンプレート
│   │   │   │   │   ├── web-app/      # ウェブアプリプロジェクト
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── mobile-app/   # モバイルアプリプロジェクト
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── design/       # デザインプロジェクト
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── login/            # ログイン
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/         # 新規登録
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── forgot-password/  # パスワード忘れ
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── mypage/           # マイページ
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/         # 設定
│   │   │   │       └── page.tsx
│   │   │   ├── components/           # 共通コンポーネント
│   │   │   │   ├── ui/               # shadcn/ui コンポーネント (ui-kitの再エクスポート)
│   │   │   │   │   ├── button.tsx    # `export { Button } from '@commit-coach/ui-kit'`
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── checkbox.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── providers/        # プロバイダーコンポーネント
│   │   │   │   │   ├── drag-provider.tsx  # DnD Kit用SSR対応プロバイダー
│   │   │   │   │   └── auth-provider.tsx  # 認証プロバイダー
│   │   │   │   ├── sidebar.tsx       # サイドバー
│   │   │   │   ├── ai-chat.tsx       # AIチャット
│   │   │   │   ├── task-item.tsx     # タスクアイテム
│   │   │   │   ├── date-picker.tsx   # 日付選択
│   │   │   │   └── icons.tsx         # アイコン
│   │   │   ├── hooks/                # カスタムフック
│   │   │   │   ├── use-mobile.tsx    # モバイル検出
│   │   │   │   └── use-toast.ts      # トースト通知
│   │   │   ├── lib/                  # ユーティリティ関数
│   │   │   │   ├── supabase.ts       # Supabaseクライアント
│   │   │   │   ├── auth.ts           # 認証ユーティリティ
│   │   │   │   └── utils.ts          # 汎用ユーティリティ
│   │   │   ├── context/              # Reactコンテキスト
│   │   │   │   └── auth-context.tsx  # 認証コンテキスト
│   │   │   └── types/                # アプリ固有の型定義
│   │   │       └── local.ts          # ローカル型定義
│   │   ├── public/                   # 静的ファイル
│   │   │   └── images/               # 画像ファイル
│   │   ├── middleware.ts             # Next.js ミドルウェア
│   │   ├── next.config.mjs           # Next.js 設定
│   │   ├── tailwind.config.ts        # Tailwind CSS 設定
│   │   ├── tsconfig.json             # TypeScript 設定
│   │   └── package.json              # 依存関係とスクリプト
│   │
│   └── backend/           # Express バックエンド
│       ├── src/
│       │   ├── api/       # REST API エンドポイント
│       │   │   ├── tasks/
│       │   │   ├── projects/
│       │   │   └── ai-coach/
│       │   ├── middleware/  # ミドルウェア
│       │   │   ├── auth.ts
│       │   │   └── error-handler.ts
│       │   ├── services/    # ビジネスロジック
│       │   │   ├── task-service.ts
│       │   │   └── ai-service.ts
│       │   ├── edge/        # Supabase Edge Functions
│       │   │   ├── tasks/   # タスク関連のEdge Functions
│       │   │   └── auth/    # 認証関連のEdge Functions
│       │   ├── utils/       # ユーティリティ
│       │   └── index.ts     # エントリーポイント
│       ├── tests/           # テスト
│       │   ├── unit/        # 単体テスト
│       │   └── edge/        # Edge Functions用e2eテスト
│       │       ├── setup.ts # Playwrightセットアップ
│       │       └── tasks.spec.ts # タスクAPIテスト
│       ├── tsconfig.json    # バックエンド用TypeScript設定
│       ├── tsconfig.edge.json  # Edge Functions用TypeScript設定
│       └── package.json
│
├── packages/
│   ├── config/            # 共通設定ファイル
│   │   ├── eslint/        # ESLint設定
│   │   │   ├── base.js
│   │   │   ├── next.js
│   │   │   └── node.js
│   │   ├── prettier/      # Prettier設定
│   │   │   └── index.js
│   │   ├── tailwind/      # Tailwind設定
│   │   │   └── index.js
│   │   └── tsconfig/      # TypeScript設定
│   │       ├── base.json
│   │       ├── next.json
│   │       ├── node.json
│   │       └── edge.json  # Edge Functions用ベース設定
│   │
│   ├── shared-types/      # 共有型定義
│   │   ├── src/
│   │   │   ├── task.ts    # タスク関連の型定義
│   │   │   ├── project.ts # プロジェクト関連の型定義
│   │   │   ├── user.ts    # ユーザー関連の型定義
│   │   │   └── schema/    # Zod スキーマ定義
│   │   │       ├── task.schema.ts
│   │   │       └── project.schema.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ai-coach/         # AIコーチングロジック (pure-TS)
│   │   ├── src/
│   │   │   ├── prompts/   # AIプロンプトテンプレート
│   │   │   ├── models/    # AIモデル接続
│   │   │   └── utils/     # ユーティリティ
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ui-kit/           # UIコンポーネントライブラリ
│       ├── src/
│       │   ├── components/  # 共通UIコンポーネント
│       │   │   ├── ui/      # shadcn/ui コンポーネント
│       │   │   │   ├── button.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   └── ...
│       │   │   └── index.ts # エクスポート
│       │   ├── hooks/       # UIフック
│       │   └── theme/       # テーマ設定
│       ├── tsconfig.json
│       └── package.json
│
├── supabase/             # Supabase設定
│   ├── functions/        # Edge Functions (ビルド後のコピー先)
│   │   ├── tasks/        # タスク関連のEdge Functions
│   │   └── auth/         # 認証関連のEdge Functions
│   └── config.toml       # Supabase設定ファイル
│
├── docs/                 # ドキュメント
│
├── scripts/              # スクリプト
│   ├── setup.sh          # 環境セットアップ
│   ├── build-edge.js     # Edge Functionsビルド・コピー
│   └── seed-data.js      # テストデータ生成
│
├── .github/              # GitHub設定
│   └── workflows/        # GitHub Actions
│       ├── ci.yml        # CI/CDパイプライン
│       └── secrets-sync.yml  # シークレット同期
│
├── .node-version         # Node.jsバージョン固定（単一ソース）
├── turbo.json            # Turborepoの設定
├── pnpm-workspace.yaml   # pnpm workspace設定
├── .eslintrc.js          # ESLint設定
├── .prettierrc.js        # Prettier設定
├── tsconfig.json         # ルートTypeScript設定
└── package.json          # ルート依存関係とスクリプト
└── www_extra.md/         # その他mdファイル群のディレクトリ
    ├── skratchpad.md     # 短期作業記録
    └── ...               # その他
```

## 2. 主要コンポーネントの最適化

### 2.1 フロントエンド (Next.js)

- **認証機能**: Supabaseを使用したユーザー認証
- **タスク管理UI**: ドラッグ&ドロップ対応のタスク管理インターフェース（SSR対応）
- **プロジェクト管理**: プロジェクト作成・編集・削除機能
- **AIコーチングUI**: AIとのチャットインターフェース
- **設定画面**: ユーザー設定・AIコーチ設定


### 2.2 バックエンド (Express + Edge Functions)

- **Express API**:

- 複雑なビジネスロジック
- AIコーチング機能（コールドスタートが重い処理）
- セッション管理
- Webhook受信
- URL: `/api/*`（将来的な衝突を避けるため）



- **Edge Functions**:

- 単純なCRUD操作
- 認証関連の軽量処理
- データ検証
- URL: `/edge/*`（将来的な衝突を避けるため）





### 2.3 共有パッケージ

- **config**: 共通設定ファイル（ESLint, Prettier, Tailwind, TypeScript）
- **shared-types**: フロントエンドとバックエンド間で共有される型定義（Zod schemas）
- **ai-coach**: AIコーチングロジックとプロンプトテンプレート（pure-TS）
- **ui-kit**: 共通UIコンポーネント（shadcn/uiのラッパー）


## 3. ビルドとキャッシュの最適化

### 3.1 Turborepo設定

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local", ".node-version"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        "dist/**", 
        "apps/frontend/.next/**", 
        "supabase/functions/**"
      ]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"],
      "cache": {
        "dir": ".turbo"
      }
    }
  }
}
```

### 3.2 パッケージ依存関係の最適化

- **shared-types**: 依存関係なし（基本型定義のみ）
- **ai-coach**: shared-typesに依存（pure-TSライブラリ、ビルド不要）
- **ui-kit**: shared-typesに依存
- **frontend**: shared-types, ai-coach, ui-kitに依存
- **backend**: shared-types, ai-coachに依存


## 4. Edge Functions の型解決

### 4.1 Edge Functions 用 TypeScript 設定

```json
// packages/config/tsconfig/edge.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Edge Functions",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020"],
    "module": "es2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["@supabase/functions-js/edge-runtime"]
  },
  "exclude": ["node_modules"]
}
```

```json
// apps/backend/tsconfig.edge.json
{
  "extends": "../../packages/config/tsconfig/edge.json",
  "include": ["src/edge/**/*"],
  "compilerOptions": {
    "outDir": "dist/edge",
    "rootDir": "src/edge",
    "paths": {
      "@/*": ["./src/*"],
      "@commit-coach/shared-types": ["../../packages/shared-types/src"]
    }
  }
}
```

### 4.2 Edge Functions のビルドスクリプト

```json
// apps/backend/package.json (スクリプト部分)
{
  "scripts": {
    "build": "tsc -b",
    "build:edge": "tsc -p tsconfig.edge.json",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "dev:edge": "supabase functions serve --watch --no-verify-jwt",
    "deploy:edge": "node ../../scripts/build-edge.js && supabase functions deploy"
  }
}
```

## 5. DnD Kit の SSR 対応

### 5.1 DragProvider コンポーネント

```typescriptreact
// apps/frontend/src/components/providers/drag-provider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// DnD Kit コンポーネントを動的インポート (SSR無効)
const DndContext = dynamic(
  () => import('@dnd-kit/core').then(mod => mod.DndContext),
  { ssr: false }
);

const SortableContext = dynamic(
  () => import('@dnd-kit/sortable').then(mod => mod.SortableContext),
  { ssr: false }
);

interface DragProviderProps {
  children: ReactNode;
  items: string[];
  onDragEnd: (activeId: string, overId: string) => void;
}

export function DragProvider({ children, items, onDragEnd }: DragProviderProps) {
  // クライアントサイドでのみレンダリング
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR時やマウント前は単純なコンテナを返す
    return <div>{children}</div>;
  }

  return (
    <DndContext onDragEnd={(event) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        onDragEnd(String(active.id), String(over.id));
      }
    }}>
      <SortableContext items={items}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
```

## 6. UI Kit と Frontend コンポーネントの連携

### 6.1 UI Kit のエクスポート

```typescriptreact
// packages/ui-kit/src/components/ui/button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

// ボタンのバリアント定義
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### 6.2 Frontend での再エクスポート

```typescriptreact
// apps/frontend/src/components/ui/button.tsx
export { Button, buttonVariants, type ButtonProps } from '@commit-coach/ui-kit';
```

## 7. CI/CD ワークフローの最適化

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'  # 単一ソースから Node バージョンを読み込み
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint

  build:
    needs: lint
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [frontend, backend]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'  # 単一ソースから Node バージョンを読み込み
          cache: 'pnpm'
      
      # Turborepo Remote Caching - セキュリティ強化版
      - name: Setup Turborepo Remote Cache
        uses: actions/github-script@v7
        with:
          script: |
            // Fine-grained PAT を使用してセキュリティを強化
            core.exportVariable('TURBO_TOKEN', process.env.GH_TOKEN);
            core.exportVariable('TURBO_TEAM', process.env.TURBO_TEAM || 'commit-coach');
            core.exportVariable('TURBO_REMOTE_CACHE_SIGNATURE_KEY', process.env.TURBO_REMOTE_CACHE_SIGNATURE_KEY);
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}  # Fine-grained PAT
          TURBO_REMOTE_CACHE_SIGNATURE_KEY: ${{ secrets.TURBO_REMOTE_CACHE_SIGNATURE_KEY }}
      
      - run: pnpm install --frozen-lockfile
      - name: Build ${{ matrix.app }}
        run: pnpm turbo run build --filter=${{ matrix.app }}
      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.app }}-dist
          path: apps/${{ matrix.app }}/dist

  test:
    needs: [lint, build]  # ビルドキャッシュを共有するために依存関係を追加
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'  # 単一ソースから Node バージョンを読み込み
          cache: 'pnpm'
      
      # Turborepo Remote Caching - セキュリティ強化版
      - name: Setup Turborepo Remote Cache
        uses: actions/github-script@v7
        with:
          script: |
            core.exportVariable('TURBO_TOKEN', process.env.GH_TOKEN);
            core.exportVariable('TURBO_TEAM', process.env.TURBO_TEAM || 'commit-coach');
            core.exportVariable('TURBO_REMOTE_CACHE_SIGNATURE_KEY', process.env.TURBO_REMOTE_CACHE_SIGNATURE_KEY);
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}  # Fine-grained PAT
          TURBO_REMOTE_CACHE_SIGNATURE_KEY: ${{ secrets.TURBO_REMOTE_CACHE_SIGNATURE_KEY }}
      
      - run: pnpm install --frozen-lockfile
      - name: Run tests
        run: pnpm turbo run test --cache-dir=.turbo

  deploy-frontend:
    if: github.ref == 'refs/heads/main'
    needs: [build, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: frontend-dist
          path: .vercel/output
      - uses: vercel/actions/cli@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    if: github.ref == 'refs/heads/main'
    needs: [build, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: backend-dist
          path: apps/backend/dist
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-edge:
    if: github.ref == 'refs/heads/main'
    needs: [build, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: backend-dist
          path: apps/backend/dist
      - name: Copy Edge Functions
        run: node scripts/build-edge.js
      - uses: supabase/setup-cli@v1
      - name: Deploy Edge Functions
        run: supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

## 8. Edge Functions の e2e テスト

```typescript
// apps/backend/tests/edge/setup.ts
import { execSync } from 'child_process';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';

// Supabase ローカル環境の URL
export const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
export const EDGE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1/edge`;

// テスト用のブラウザとページ
let browser: Browser;
let page: Page;

// テスト前の準備
export async function setupTests() {
  console.log('Starting Supabase local development server...');
  
  try {
    // Supabase が起動しているか確認
    execSync('supabase status', { stdio: 'ignore' });
  } catch (error) {
    // 起動していなければ起動
    execSync('supabase start', { stdio: 'inherit' });
  }
  
  // Edge Functions をビルドしてデプロイ
  console.log('Building and deploying Edge Functions...');
  execSync('pnpm run build:edge', { stdio: 'inherit' });
  execSync('node ../../scripts/build-edge.js', { stdio: 'inherit' });
  
  // ブラウザを起動
  browser = await chromium.launch();
  page = await browser.newPage();
  
  return { browser, page };
}

// テスト後のクリーンアップ
export async function teardownTests() {
  await browser?.close();
}
```

```typescript
// apps/backend/tests/edge/tasks.spec.ts
import { test, expect } from '@playwright/test';
import { setupTests, teardownTests, EDGE_FUNCTIONS_URL } from './setup';

// テスト用のデータ
const testTask = {
  title: 'Test Task',
  description: 'This is a test task',
  status: 'todo',
};

let taskId: string;

test.beforeAll(async () => {
  await setupTests();
});

test.afterAll(async () => {
  await teardownTests();
});

test('should create a new task', async ({ request }) => {
  const response = await request.post(`${EDGE_FUNCTIONS_URL}/tasks`, {
    data: testTask,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  });
  
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data.id).toBeDefined();
  expect(data.title).toBe(testTask.title);
  
  taskId = data.id;
});

test('should get a task by id', async ({ request }) => {
  const response = await request.get(`${EDGE_FUNCTIONS_URL}/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  });
  
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data.id).toBe(taskId);
  expect(data.title).toBe(testTask.title);
});

test('should update a task', async ({ request }) => {
  const updatedTask = {
    ...testTask,
    title: 'Updated Test Task',
  };
  
  const response = await request.put(`${EDGE_FUNCTIONS_URL}/tasks/${taskId}`, {
    data: updatedTask,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  });
  
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data.id).toBe(taskId);
  expect(data.title).toBe(updatedTask.title);
});

test('should delete a task', async ({ request }) => {
  const response = await request.delete(`${EDGE_FUNCTIONS_URL}/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  });
  
  expect(response.ok()).toBeTruthy();
  
  // 削除後に取得を試みて404が返ることを確認
  const getResponse = await request.get(`${EDGE_FUNCTIONS_URL}/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  });
  
  expect(getResponse.status()).toBe(404);
});
```

## 9. Node バージョンの単一ソース管理

```plaintext
// .node-version
18.19.0
```

## 10. 環境変数と秘密情報の管理

### 10.1 環境変数の分離

```plaintext
# .env.example (ルート)
# 共通環境変数
NODE_ENV=development

# フロントエンド環境変数
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_EDGE_URL=${NEXT_PUBLIC_SUPABASE_URL}/functions/v1/edge

# バックエンド環境変数
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret

# Turborepo Remote Cache
TURBO_TOKEN=your_github_token
TURBO_TEAM=commit-coach
TURBO_REMOTE_CACHE_SIGNATURE_KEY=your_signature_key
```

## 11. ログ一元化

### 11.1 OpenTelemetry 設定

```typescript
// apps/backend/src/utils/telemetry.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

// Grafana Cloud または Axiom の設定
const exporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  headers: {
    'Authorization': `Bearer ${process.env.OTEL_EXPORTER_OTLP_HEADERS_AUTHORIZATION}`,
  },
});

const metricExporter = new OTLPMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
  headers: {
    'Authorization': `Bearer ${process.env.OTEL_EXPORTER_OTLP_HEADERS_AUTHORIZATION}`,
  },
});

export const otelSDK = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'commit-coach-backend',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  traceExporter: exporter,
  metricExporter: metricExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

// アプリケーション起動時に初期化
export function initTelemetry() {
  otelSDK.start();
  
  // アプリケーション終了時にシャットダウン
  process.on('SIGTERM', () => {
    otelSDK.shutdown()
      .then(() => console.log('Telemetry SDK shut down successfully'))
      .catch((error) => console.error('Error shutting down Telemetry SDK', error))
      .finally(() => process.exit(0));
  });
}
```

## 12. 現在のv0ファイル構造との互換性

現在のv0で作成しているファイル構造は、提案したモノレポ構造と基本的に互換性があります。ただし、以下の点を現在のv0コードベースに反映することをお勧めします：

1. **DnD Kit のSSR対応**:
現在のコードベースでは、react-beautiful-dndを使用していますが、SSRの問題が発生する可能性があります。以下のようなDragProviderコンポーネントを追加することで、SSRの問題を解決できます：


```typescriptreact
// components/providers/drag-provider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { DragDropContext, Droppable, type DropResult } from 'react-beautiful-dnd';

// SSR対応のためのラッパーコンポーネント
export function DragProvider({ children, onDragEnd }: { 
  children: ReactNode; 
  onDragEnd: (result: DropResult) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR時やマウント前は単純なコンテナを返す
    return <div>{children}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
}
```

2. **Edge Functions用のTypeScript設定**:
将来的にSupabase Edge Functionsを使用する場合に備えて、以下のtsconfig.edge.jsonファイルを追加することをお勧めします：


```json
// tsconfig.edge.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020"],
    "module": "es2020",
    "moduleResolution": "node",
    "isolatedModules": true,
    "types": ["@supabase/functions-js/edge-runtime"]
  },
  "include": ["supabase/functions/**/*"],
  "exclude": ["node_modules"]
}
```

3. **Node.jsバージョンの固定**:
プロジェクトルートに`.node-version`ファイルを追加して、Node.jsバージョンを固定することをお勧めします：


```plaintext
// .node-version
18.19.0
```

## 13. 実戦投入チェックリスト

1. ✅ Node.jsバージョンを単一ソースで管理（`.node-version`）
2. ✅ Edge Functions用の別TypeScript設定が用意されている
3. ✅ DnD Kitの適切なSSR対応が実装されている
4. ✅ UI Kitコンポーネントが適切に再エクスポートされている
5. ✅ Turborepo Remote Cacheのセキュリティが強化されている
6. ✅ Edge Functionsのe2eテストが実装されている
7. ✅ OpenTelemetryによるログ一元化が設定されている
8. ✅ Zod/Drizzleによる型安全性が確保されている
9. ✅ 環境変数が適切に分離・管理されている
10. ✅ CI/CDパイプラインが最適化されている


## 14. まとめ

この最終最適化されたモノレポ構造は、以下の利点を提供します：

1. **効率的なビルドとキャッシュ**: Turborepoによる依存関係の最適化とキャッシュ
2. **明確な役割分担**: Edge FunctionsとExpressの適切な使い分け
3. **共通設定の一元管理**: packages/configによる設定ファイルの共有
4. **型安全性**: shared-typesによる一貫した型定義
5. **UIの一貫性**: ui-kitによる共通コンポーネント
6. **秘密情報の安全な管理**: 環境変数の適切な分離と秘密情報の同期
7. **効率的なCI/CD**: マトリクスビルドとキャッシュによる高速なパイプライン
8. **SSR対応のDnD**: クライアントサイドのみで動作するDnD Kitを適切に分離
9. **ログ一元化**: OpenTelemetryによる統合ログ管理
10. **型と実装の一致**: ZodとDBスキーマの互換性確保
11. **Node.jsバージョンの一元管理**: 単一ソースによるバージョン固定
12. **Edge Functionsのテスト**: Playwright + Supabaseローカルによるe2eテスト



---

# AIサービス

### 1. サービス概要
- 本プロジェクトではOpenAI GPT-4 APIを利用したAIコーチング機能を提供。
- ユーザーのタスク進捗やプロジェクト管理をAIがサポート。

### 2. システム構成
- バックエンド（Express）からOpenAI APIを呼び出し、フロントエンド（Next.js）経由でユーザーに応答。
- APIキーはサーバー側で安全に管理。
- AI応答はDB（ai_messagesテーブル）に保存し、履歴管理・再利用を実現。

### 3. 主なAPIエンドポイント
- `POST /api/v1/ai/coach` : タスク進捗や質問をAIに投げて応答を取得
- `GET /api/v1/ai/messages` : 過去のAI応答履歴を取得

### 4. プロンプト設計方針
- ユーザーの入力内容・タスク状況・過去のAI応答履歴をもとにプロンプトを動的生成
- プロンプトテンプレートは`packages/shared-prompts`で管理
- ユーザーごとにパーソナライズされた応答を目指す

### 5. 運用・セキュリティ
- OpenAI APIキーは環境変数で管理し、フロントエンドには絶対に露出しない
- レートリミット・エラーハンドリングを徹底
- AI応答の品質・安全性を定期レビュー

### 6. 今後の拡張案
- LLMの切り替え（Anthropic Claude等）やマルチエージェント対応
- ユーザーごとのAIパーソナライズ設定
- AIによる自動リマインド・進捗サマリ生成

</rewritten_file>