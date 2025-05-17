# Next.js ハイドレーション対策ガイドライン

## 開発者向けセットアップとルール

### 1. ブラウザ拡張機能

Next.jsアプリケーションの開発時には、以下の拡張機能に注意してください：

- **開発中は一時的に無効化推奨の拡張機能**:
  - ColorZilla (`cz-shortcut-listen` 属性を追加)
  - Redux DevTools
  - React DevTools
  - その他DOM構造を修正する拡張機能

無効化方法:
1. Chromeで `chrome://extensions` を開く
2. 該当拡張機能のトグルをオフにする
3. または「シークレットモード」で開発する

### 2. コーディングルール

- **レイアウトコンポーネント (`layout.tsx`) でのルール**:
  - 基本的にサーバーコンポーネントとして維持する
  - 状態管理や副作用のあるコードは含めない
  - `use client` ディレクティブは必要な場合のみ使用

- **suppressHydrationWarning 属性**:
  - 本属性はエラーを"隠す"だけで根本的な解決ではないことを理解する
  - ブラウザ拡張機能など制御不能な外部要因による場合のみ使用
  - 適用は最小範囲に限定し、できるだけ `<body>` 全体には適用しない

```tsx
// 推奨
<body>
  <div id="__extension_safe_root" suppressHydrationWarning>
    {children}
  </div>
</body>

// 非推奨
<body suppressHydrationWarning>
  {children}
</body>
```

### 3. テスト環境の設定

- **CI環境での検証**:
  - ヘッドレスブラウザでテストを実行し、拡張機能の影響がないことを確認
  - `NODE_ENV=production` でのビルドと実行を確認

- **E2Eテスト実施**:
  - Playwrightなどを使用して、ハイドレーションエラーの検出テストを実装
  - テスト例:
  ```js
  test('body should not have extension attributes', async ({ page }) => {
    await page.goto('/');
    const hasAttribute = await page.evaluate(() => {
      return document.body.hasAttribute('cz-shortcut-listen');
    });
    expect(hasAttribute).toBe(false);
  });
  ```

### 4. 新しい機能追加時のチェックリスト

新しいコンポーネントや機能を追加する際は、以下の点を確認してください：

- [ ] サーバー/クライアントコンポーネントの境界が明確か
- [ ] ランダム値や時間に依存する値は適切に処理されているか
- [ ] クライアントサイドでのみ使用すべきAPIが誤ってサーバーコンポーネントで使用されていないか
- [ ] データ取得ロジックは適切に分離されているか

### 5. 問題発生時の対応フロー

1. Chromeの拡張機能をすべて無効化して再現確認
2. React DevToolsのProfierでHydrationイベントを確認
3. `suppressHydrationWarning` を限定的に適用
4. middleware.tsの設定を確認・調整
5. 原因が内部コードの場合、サーバー/クライアント境界を見直す

## トラブルシューティング

### よくある問題と解決策

1. **日時表示の不一致**:
   ```tsx
   // 問題 - サーバーとクライアントで値が異なる
   <span>{new Date().toLocaleString()}</span>

   // 解決策 - クライアントサイドでのみ処理
   'use client'
   import { useState, useEffect } from 'react'

   function TimeDisplay() {
     const [time, setTime] = useState('')
     useEffect(() => {
       setTime(new Date().toLocaleString())
     }, [])
     return <span>{time || '読み込み中...'}</span>
   }
   ```

2. **ランダム値の使用**:
   ```tsx
   // 問題 - サーバーとクライアントで異なる値になる
   <div id={`item-${Math.random()}`}>...</div>

   // 解決策 - 安定したID生成やuseIdフック使用
   'use client'
   import { useId } from 'react'

   function RandomComponent() {
     const id = useId()
     return <div id={`item-${id}`}>...</div>
   }
   ```

このガイドラインを守ることで、Next.jsアプリケーションでのハイドレーションエラーを防ぎ、より安定した開発体験を実現できます。
