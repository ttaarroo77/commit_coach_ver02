# Next.js Hydrationエラー・レイアウト崩れ調査レポート

---

## ■ 現象・トラブル内容

- **Hydration failed because the server rendered HTML didn't match the client.**
  - SSR（サーバーサイドレンダリング）とCSR（クライアントサイドレンダリング）でHTMLが一致せず、ReactのHydrationエラーが発生。
  - エラー箇所は `<html lang="ja">` や `<body className={inter.className}>` で発生している。
- **ファーストビューの左右バランスが崩れている**
  - 左カラムが重く、右カラム（AIカード）が小さく右端に寄ってしまう。

---

## ■ catコマンドで出力した主な内容

### apps/frontend/src/app/layout.tsx
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Commit Coach',
  description: 'A project management tool for developers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### apps/frontend/src/contexts/AuthProvider.tsx
- `"use client"` でクライアントコンポーネントとして宣言。
- Supabaseクライアントはハードコーディング。
- `useState`の初期値は静的。
- `window.location.origin`は関数内のみで使用。
- `useEffect`で認証状態を監視。

---

## ■ 調査すべきコードの場所

1. **レイアウトの根本**
   - `apps/frontend/src/app/layout.tsx`
2. **認証プロバイダー**
   - `apps/frontend/src/contexts/AuthProvider.tsx`
3. **ファーストビュー（ヒーローセクション）**
   - 例：`apps/frontend/src/app/page.tsx` または `components/Hero.tsx` など
4. **Next.js 設定**
   - `apps/frontend/next.config.mjs`
5. **Tailwind 設定**
   - `apps/frontend/tailwind.config.ts`
6. **グローバルCSS**
   - `apps/frontend/src/app/globals.css`

---

## ■ catコマンドで一撃確認コマンド例

```sh
cat apps/frontend/src/app/layout.tsx
cat apps/frontend/src/contexts/AuthProvider.tsx
cat apps/frontend/src/app/page.tsx
cat apps/frontend/src/components/Hero.tsx
cat apps/frontend/next.config.mjs
cat apps/frontend/tailwind.config.ts
cat apps/frontend/src/app/globals.css
```

---

## ■ 現象と原因・対策

### 1. Hydrationエラーの主な原因

- **SSR/CSRで異なる値を使っている**
  - 例：`window`や`localStorage`、`Date.now()`、`Math.random()`などを初期描画で使うとNG
  - **現状**：`layout.tsx`や`AuthProvider.tsx`では初期値は静的で、関数内でのみ`window`を使用しているため、直接的な原因は見当たらない。
- **Next.jsの設定ミス**
  - `next.config.mjs`の`experimental.serverActions`はオブジェクトで指定、`swcMinify`は削除
  - **現状**：警告が出ているため、設定ファイルの修正が必要。
- **Providerやコンポーネントの初期値のズレ**
  - **現状**：`useState`の初期値は静的で問題なし。
- **外部要因**
  - ブラウザ拡張や、`cz-shortcut-listen`などの属性が自動付与されている場合もHydrationエラーの原因となる。

### 2. レイアウト崩れの主な原因

- **左右のカラム幅・配置の不均等**
  - `flex-1`＋`max-w`＋`justify-center items-center`で左右均等＆中央寄せ
- **AIカードのサイズ・余白不足**
  - `min-w`や`min-h`、`p-12`などでカードを大きく
- **gap不足**
  - `gap-24`などで左右の間隔を広げる

---

## ■ 今後の調査・対策ポイント

1. **Next.jsの設定ファイル（next.config.mjs）を修正**
   - `experimental.serverActions`はオブジェクトで指定
   - `swcMinify`は削除
2. **ヒーローセクションやAIカードの実装ファイルをcatで確認し、SSR/CSR差分がないか再確認**
3. **ブラウザ拡張や外部要因も疑う（シークレットウィンドウで再現するか確認）**
4. **Hydrationエラーが消えるまで、怪しいProviderやコンポーネントを一時的に外して切り分ける**

---

## ■ まとめ

- **catコマンドで該当ファイルを一撃確認し、SSR/CSR差分やレイアウトの実装をチェック**
- **Hydrationエラーは「初期値の静的化」「Next.js設定修正」「クライアント依存値のuseEffect限定化」で解消**
- **レイアウト崩れは「左右の幅・中央寄せ・gap・カードサイズ調整」で解消**
- **catコマンドで出力した内容をもとに、さらに具体的な修正案を提示可能**






# o3 が出した分析レポートの結果：


### 🔍 深掘り候補ディレクトリ & ファイル

| 優先度   | 場所                                                 | 着目ポイント                                                       |
| ----- | -------------------------------------------------- | ------------------------------------------------------------ |
| **A** | `apps/frontend/src/app/layout.tsx`                 | `<html>`/`<body>`への付加属性ズレ ([GitHub][1])                      |
| **A** | `apps/frontend/src/contexts/AuthProvider.tsx`      | **createBrowserClient** がサーバでも実行されていないか ([GitHub][2])        |
| **A** | `apps/frontend/next.config.mjs`                    | `swcMinify` と `experimental.serverActions` の設定 ([GitHub][3]) |
| **B** | `apps/frontend/src/app/page.tsx`                   | ヒーロー部のカラム構造・Tailwindクラス ([GitHub][4])                        |
| **B** | `apps/frontend/tailwind.config.ts` / `globals.css` | カスタム‐カラー・フォント定義衝突                                            |
| **C** | `.next/static/**`（ビルド後）                            | font-hash・style順序の差分                                         |

---

## 🧐 あり得る原因と対策 ― 6つの仮説

| # | 仮説                                  | 想定メカニズム                                                              | 検証ステップ                                    | 解決アプローチ                                                  |
| - | ----------------------------------- | -------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| 1 | **ブラウザ拡張子注入**                       | `cz-shortcut-listen` / `data-redeviation-bs-uid` がクライアントのみで付与→DOM不一致 | 拡張OFF・シークレットで再現確認                         | 原因なら**コード改修不要**。最終手段は `suppressHydrationWarning`         |
| 2 | **next/font のハッシュ揺らぎ**              | `Inter` の `__className_XXXX` がビルド⇆HMRで変動                             | 開発⇆本番それぞれで全リロードして比較                       | `Inter` 定義を共通 util へ切り出し / Next を 15.3.x 以降へアップ          |
| 3 | **AuthProvider が SSR で副作用**         | `createBrowserClient()` がモジュール評価時に走り、ランダム値や `localStorage` 参照発生      | `console.log(typeof window)` でサーバ側実行有無を確認 | Supabase 初期化を `useMemo + typeof window` 内に移動             |
| 4 | **`swcMinify: true` が HTML 並び順を変更** | SWC が属性順序を並べ替え→Hydration 差分                                          | `next build` → HTML snapshot 比較           | 設定削除（Next のデフォルトで既に有効）し `.next` をクリーン                    |
| 5 | **ヒーローのマークアップ不整合**                  | 左右カラムが SSR 時点で DOM 上非対称→再水和時にずれ                                      | Chrome DevTools "Elements" の初期 HTML を確認   | `grid grid-cols-12` 等で左右とも常に描画、`min-w / max-w` でバランス fix |
| 6 | **Vite 依存CSSの混在**                   | ルートに残る `vite.config.ts` が dev で style を追加挿入                          | head 内 `<style data-vite>` の有無            | 不要なら `apps/frontend` から Vite 設定を除去                       |

---

## 🛠️ 推奨調査フロー（上から順に潰す）

1. **拡張無効化 → 再現テスト**
2. **`next.config.mjs` を整理**（`swcMinify` 削除、`serverActions` を `{}` 形式へ）
3. **Supabase 初期化をクライアント限定に変更**
4. **フォント util 化 & Next アップデート**
5. **Hero レイアウトを grid/flex で再実装＋`gap-24` 等で余白調整**
6. **全キャッシュ削除 (`rm -rf .next`) → `pnpm build` → 本番起動で確認**

---

### メモ

* **Hydration エラーは「HTML が同じか」が全て**。まずは *"サーバとクライアントで異なるもの"* を一点ずつ排除するのが近道。
* **レイアウト崩れ**は Tailwind クラスの不足／並び順が主因。構造をシンプルにしつつ、`flex-1`, `basis-1/2`, `gap-*` あたりでバランスを取ると早い。

これで大抵の再水和エラーと左右バランスは収まるはずです。あとは **`pnpm dlx next lint`** で静的解析を走らせ、怪しい警告が無いかを確認してみてください。

[1]: https://github.com/ttaarroo77/commit_coach_ver02/raw/feat/frontend-v0-rebuild/apps/frontend/src/app/layout.tsx "github.com"
[2]: https://github.com/ttaarroo77/commit_coach_ver02/raw/feat/frontend-v0-rebuild/apps/frontend/src/contexts/AuthProvider.tsx "github.com"
[3]: https://github.com/ttaarroo77/commit_coach_ver02/raw/feat/frontend-v0-rebuild/apps/frontend/next.config.mjs "github.com"
[4]: https://github.com/ttaarroo77/commit_coach_ver02/raw/feat/frontend-v0-rebuild/apps/frontend/src/app/page.tsx "github.com"
