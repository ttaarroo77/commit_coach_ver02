# プロジェクト構造リファクタリング計画

## 現状と課題

2025年5月1日時点で、commit_coachプロジェクトには以下の課題があります：

1. **ファイルの散在**:
   - コンポーネント、コンテキスト、フック、ライブラリなどのファイルがルートディレクトリに直接配置されています
   - 本来は`apps/frontend/src`内に整理されるべきです

2. **重複したディレクトリ構造**:
   - `apps/frontend/apps/frontend`という二重の階層構造があります
   - 理想的には`apps/frontend`のみで十分です

3. **設定ファイルの重複**:
   - Babel、Jest、Viteなどの設定ファイルがルートと複数の場所に重複しています
   - これによりNext.jsのSWCコンパイラとBabelの競合が発生しています

4. **パスエイリアスの問題**:
   - `@/`で始まるパスエイリアスが正しく解決されていない箇所があります

## 解決済みの問題

1. **Babel設定ファイルの競合**:
   - 複数のBabel設定ファイルを`babel_backup`ディレクトリに移動
   - `apps/frontend/apps/frontend/babel.config.js`をCommonJS形式に修正

2. **フォントローダーの問題**:
   - `Geist`フォントを`Inter`に、`Geist_Mono`を`Roboto_Mono`に置き換え
   - これによりNext.jsのフォントローダーエラーを解消

3. **Git管理**:
   - `feat/unsafe-analysis`ブランチにバックアップをコミット
   - `refactor/project-structure`ブランチを新規作成

## 今後の作業計画

### 1. ディレクトリ構造の整理

```bash
# 1. apps/frontend/apps/frontend の内容を apps/frontend に移動
cp -r apps/frontend/apps/frontend/* apps/frontend/
rm -rf apps/frontend/apps

# 2. ルートディレクトリのファイルを apps/frontend/src に移動
mkdir -p apps/frontend/src
mv components apps/frontend/src/
mv contexts apps/frontend/src/
mv hooks apps/frontend/src/
mv lib apps/frontend/src/
mv types apps/frontend/src/

# 3. src ディレクトリの内容も移動
mkdir -p apps/frontend/src/app
cp -r src/* apps/frontend/src/app/
```

### 2. 設定ファイルの整理

1. **Next.js設定の統一**:
   - `next.config.mjs`と`next.config.js`の重複を解消
   - SWCコンパイラを明示的に有効化

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: true,
  },
  compiler: {
    // SWCコンパイラを明示的に有効化
    styledComponents: true, // styled-componentsを使用する場合
  },
};

export default nextConfig;
```

2. **TypeScript設定の最適化**:
   - パスエイリアスの設定を修正

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、必要な環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy
```

### 4. パスエイリアスの修正

`LinkValidator.tsx`などのコンポーネントでパスエイリアスが解決できない問題を修正：

```tsx
// 修正前
import { LinkValidator } from '@/components/LinkValidator';

// 修正後
import { LinkValidator } from '../components/LinkValidator';
// または
import { LinkValidator } from '@/components/LinkValidator';
// (tsconfig.jsonのpaths設定に応じて)
```

### 5. テストの修正

1. **テスト環境の設定ファイルを整理**:
   - Jest/Vitestの設定ファイルの重複を解消
   - テスト用のモックを整理

2. **パスエイリアスをテスト環境でも解決できるように設定**:
   - `jest.config.js`または`vitest.config.ts`でパスエイリアスを設定

### 6. 最終確認

1. **ビルドとテストの実行**:
   ```bash
   cd apps/frontend
   pnpm build
   pnpm test
   ```

2. **開発サーバーの起動確認**:
   ```bash
   cd apps/frontend
   pnpm dev
   ```

## 理想的なディレクトリ構造（目標）

アーキテクチャ仕様書に基づく理想的な構造：

```
commit_coach/
├── apps/
│   ├── frontend/           # Next.js フロントエンド
│   │   ├── src/
│   │   │   ├── app/        # App Router ページ
│   │   │   ├── components/ # コンポーネント
│   │   │   ├── hooks/      # カスタムフック
│   │   │   ├── lib/        # ユーティリティ
│   │   │   ├── context/    # Reactコンテキスト
│   │   │   └── types/      # 型定義
│   │   ├── public/         # 静的ファイル
│   │   ├── middleware.ts   # Next.js ミドルウェア
│   │   ├── next.config.mjs # Next.js 設定
│   │   └── package.json    # 依存関係
│   └── backend/            # Express バックエンド
├── packages/               # 共有パッケージ
│   ├── config/             # 共通設定
│   ├── shared-types/       # 共有型定義
│   └── ui-kit/             # UIコンポーネント
├── docs/                   # ドキュメント
├── .github/                # GitHub設定
├── turbo.json              # Turborepo設定
└── pnpm-workspace.yaml     # pnpm workspace設定
```

## 注意点

1. **段階的な移行**:
   - 一度にすべてを変更するのではなく、段階的に移行してテストすることを推奨
   - 各ステップ後にビルドとテストを実行して問題がないことを確認

2. **バックアップの活用**:
   - 問題が発生した場合は`feat/unsafe-analysis`ブランチに戻ることができます
   - 重要なファイルは`project_backup`ディレクトリにバックアップ済み

3. **環境変数の管理**:
   - `.env.local`ファイルは`.gitignore`に含まれているため、手動で作成する必要があります

## 参考資料

- [アーキテクチャ仕様書](/docs/overview/architecture.spec.md)
- [Next.js Babel設定の競合解決](https://nextjs.org/docs/messages/babel-font-loader-conflict)
- [Turborepoのベストプラクティス](https://turbo.build/repo/docs/handbook)

---

作成日: 2025年5月1日
ブランチ: `refactor/project-structure`
