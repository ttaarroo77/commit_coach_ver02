# ハイドレーション差分防止ポリシー

## 目的

このドキュメントは、Next.jsアプリケーションにおけるハイドレーションエラーを防ぎ、一貫性のあるレンダリングを確保するためのガイドラインを提供します。

## ハイドレーションエラーとは

ハイドレーションエラーは、サーバーサイドレンダリング（SSR）で生成されたHTMLとクライアントサイドレンダリング（CSR）で生成されたHTMLが一致しない場合に発生します。これは以下のような原因で発生する可能性があります：

1. `Date.now()`や`Math.random()`などの実行毎に異なる値を返す関数の使用
2. クライアント依存のブラウザAPIの不適切な使用
3. 開発者の制御外にあるブラウザ拡張機能による属性の注入
4. サーバーとクライアントの異なるロケール設定
5. 異なるレンダリング環境での不整合

## 基本原則

1. **「警告を黙らせる」前に「DOM を一致させる」**：
   - `suppressHydrationWarning`属性は最後の解決策としてのみ使用する
   - 根本的な原因を特定し、可能であれば解決するよう努める

2. **一貫性のあるレンダリング**：
   - サーバーとクライアントで同じ出力を保証するコードを常に書く
   - 決定論的なレンダリングを維持する

3. **適切なコンポーネント分離**：
   - サーバーコンポーネントとクライアントコンポーネントの境界を明確にする
   - 必要な場合のみ`use client`ディレクティブを使用する

## ガードレール

### 拡張機能属性の対策

ブラウザ拡張機能によるハイドレーションエラーに対処するために、以下のアプローチのいずれかを採用してください：

1. **事前属性除去スクリプト**（推奨）:
   ```tsx
   // apps/frontend/app/_scripts/remove-extension-attrs.js
   <Script
     id="remove-extension-attrs"
     strategy="beforeInteractive"
     src="/_scripts/remove-extension-attrs.js"
   />
   ```

2. **限定的な`suppressHydrationWarning`**:
   - `<div id="__extension_safe_root" suppressHydrationWarning>` を使用して影響範囲を限定する
   - `<html suppressHydrationWarning>`や`<body suppressHydrationWarning>`は避ける

### React Keyの一意性

1. **複合キーの使用**:
   ```tsx
   // 不適切
   <Draggable key={project.id}>...</Draggable>

   // 適切
   <Draggable key={`${group.id}-${project.id}`}>...</Draggable>
   ```

2. **データ生成時の一意性チェック**:
   ```tsx
   // データ処理時に重複IDをチェック
   const allProjectIds = groups.flatMap(group =>
     group.projects.map(project => project.id)
   );
   const uniqueIds = new Set(allProjectIds);
   if (uniqueIds.size !== allProjectIds.length) {
     console.warn('Duplicate project IDs detected');
   }
   ```

## テスト戦略

以下のテスト方法を採用して、ハイドレーションの問題を早期に検出します：

1. **ユニットテスト**:
   - データの一意性をテストするテストを含める
   - 重複キーが発生しないことを検証する

2. **E2Eテスト**:
   - ハイドレーションエラーを検出するテストを実装
   - 拡張機能による影響を検出するテストを含める

3. **CI環境での検証**:
   - ヘッドレスブラウザでテストを実行し、拡張機能の影響がないことを確認
   - 本番ビルドでの検証を行う

## 開発環境の設定

1. **拡張機能の管理**:
   - Next.js開発中はブラウザ拡張機能を無効化することを推奨
   - 特にColorZillaなどDOMを操作する拡張機能は開発中に無効化

2. **Incognitoモードの使用**:
   - ハイドレーションエラーが発生した場合、Incognitoモードで再現確認
   - 拡張機能なしの状態でのテストに活用

## チェックリスト

新機能実装時に以下のチェックリストを利用してください：

- [ ] サーバーとクライアントで同じ出力を生成するか
- [ ] 環境依存のAPIを適切に分離しているか
- [ ] 一意のキーが使用されているか
- [ ] クライアント依存の処理が適切に処理されているか
- [ ] ハイドレーション差分を引き起こさないか

## 例外処理

ハイドレーション警告を抑制する必要がある場合は、以下の手順に従ってください：

1. チームで協議し、抑制の必要性について合意する
2. 抑制範囲を最小限に保つ
3. コードにコメントで理由を記載する
4. ドキュメントに例外を記録する

## まとめ

ハイドレーションエラーは開発体験とアプリケーションのパフォーマンスに影響を与える可能性があります。このポリシーを遵守することで、一貫性のあるレンダリングと安定したアプリケーション動作を確保しましょう。

## キー設計指針

Reactで一意のキーを持つことは、レンダリングパフォーマンスとハイドレーションの整合性の両方に重要です。以下の指針に従ってください。

### 基本原則

1. **常に一意のキーを使用する**
   - 同じレンダリングツリー内で重複するキーを持つ要素は作成しない
   - インデックスをキーとして使用することを避ける（特にリストの項目が追加・削除・並べ替えされる場合）

2. **複合キーの使用**
   - 異なるリストやコンテキスト間で同じIDが使用される可能性がある場合は、複合キーを使用する
   - 例: `${parentId}-${itemId}` または `${contextId}:${itemId}`

3. **ドラッグ&ドロップでの対応**
   - `react-beautiful-dnd` などのライブラリを使用する場合:
     - `key` 属性と `draggableId` 属性の両方を一意にする
     - `draggableId` は文字列型である必要があり、DragDropContext全体で一意である必要がある

### 実装例

```tsx
// 悪い例 - IDの重複リスクあり
<Draggable key={item.id} draggableId={item.id} index={index}>

// 良い例 - 複合キーで一意性を保証
<Draggable key={`${listId}-${item.id}`} draggableId={`${listId}:${item.id}`} index={index}>
```

### ユーティリティ関数の活用

複合キーの生成と解析には専用のユーティリティ関数を使用し、一貫性を保ってください：

```tsx
// 複合IDを生成する
export const makeDragId = (groupId, itemId) => `${groupId}:${itemId}`;

// 複合IDを解析する
export const splitDragId = (dragId) => {
  const [groupId, itemId] = dragId.split(':');
  return { groupId, itemId };
};
```

### 自動検証

1. **ESLintルール**
   - `eslint-plugin-react-x` の `no-duplicate-key` ルールを有効化
   - `react/no-array-index-key` ルールも有効化して、インデックスをキーとして使用することを警告

2. **テスト**
   - ユニットテストで重複キーによるコンソールエラーが出ないことを検証
   - コンポーネントのスナップショットテストに重複キーチェックを含める

重複キーの問題は微妙なバグの原因となり、デバッグが困難になる可能性があります。これらの指針に従うことで、予期しないハイドレーションエラーやレンダリング問題を回避できます。
