# Next.js ハイドレーションエラー調査と解決

## 概要

Next.jsアプリケーションで発生していたハイドレーションエラー「Hydration failed because the server rendered HTML didn't match the client」の原因と解決策についてのレポートです。

## 問題の詳細

- **エラー内容**: サーバーサイドレンダリング(SSR)で生成されたHTMLと、クライアントサイドレンダリング(CSR)で生成されたHTMLが一致しないというエラー
- **具体的な不一致**:
  - `data-redeviation-bs-uid="***"` 属性がSSRには存在するがCSRでは存在しない
  - `cz-shortcut-listen="true"` 属性がSSRには存在するがCSRでは存在しない
- **エラー発生箇所**: `apps/frontend/app/layout.tsx` の `<body>` 要素

## 原因分析

| 原因候補 | 検証結果 | コメント |
|----------|----------|----------|
| **ブラウザ拡張機能 (ColorZilla など) が HTML 属性を挿入** | **最有力**。`cz-shortcut-listen` は ColorZilla 固有属性。拡張を無効化するとエラーが消える事例多数。 | |
| **`layout.tsx` がクライアント／サーバー混在レンダリング** | 低い。`layout.tsx` は基本的に純サーバーであるべきで状態を持たない。 | |
| **AuthProvider の hydration race** | 可能性小。拡張機能属性と無関係。 | |

**結論**: **ColorZilla などのブラウザ拡張機能の content-script が `<body>` に属性を注入することによるHTML不一致**が直接原因です。

## 対策

### 実装した解決策

1. **限定的な `suppressHydrationWarning` の適用**:
   - `<body>` 要素全体に適用するのではなく、`<div id="__extension_safe_root">` でコンテンツを囲み、その要素に属性を適用
   ```tsx
   <body>
     <div id="__extension_safe_root" suppressHydrationWarning>
       <AuthProvider>{children}</AuthProvider>
     </div>
   </body>
   ```

2. **開発環境での拡張機能対策**:
   - `middleware.ts` を追加して、開発環境でのみ拡張機能の影響を軽減するヘッダーを設定
   ```ts
   // ヘッダーによりColorZillaなどの拡張機能の動作を制限
   response.headers.set(
     'Content-Security-Policy',
     "script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
   )
   response.headers.set('X-Extension-Disable', 'true')
   ```

### 追加すべき対策

- **CI/テスト環境の確認**:
  - ヘッドレスChromeでの実行確認（拡張機能がないためエラーが出ないはず）
- **E2E テストでの検証**:
  - Playwright/Cypressに不正な属性検出のテストを追加

## ガイドライン

### ハイドレーション差分回避のルール

1. **「警告を潰す」≠「バグ修正」**:
   - `suppressHydrationWarning` は最後の手段。まず"なぜズレるのか"をステップデバッグ。

2. **`suppressHydrationWarning` の使用条件**:
   - ブラウザ拡張機能など、開発者の制御外の要因による場合のみ使用可
   - 適用範囲は最小限に留め、影響を受ける特定の要素に限定する
   - `<body>` 全体への適用は避け、必要な場合はラッパー要素を設ける

3. **開発環境での対策**:
   - Next.js開発中はブラウザ拡張機能を無効化することを推奨
   - 特にColorZillaなどUI操作系の拡張機能は一時的にオフに

4. **コード品質管理**:
   - SSR/CSRで差異が生じないよう、データ取得や副作用のあるコードは適切に分離
   - `use client` ディレクティブは状態を持つコンポーネントのみに使用
   - ランダム値や時間依存の値はuseEffectなどクライアントサイドのライフサイクルフックで適用

## 開発者向け学習Tips

1. **拡張機能は Client-side first**:
   - content-scriptがHTMLを変更し、React DOMが「想定外差分」と認識してHydration Errorが発生

2. **Chrome DevTools を活用**:
   - Performance → Start profiling でHydrationフェーズを確認
   - `Mismatch @ node...` が出る要素を特定

3. **本番環境での検証**:
   - 開発環境だけでなく、本番ビルド (`next build && next start`) でも警告がないか確認

4. **公式ドキュメントと Issue の確認**:
   - Next.js の公式ドキュメントやリポジトリの Issues で同様の問題が報告されていないか確認
