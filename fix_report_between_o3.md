# 概要：

このレポートは、cursorのローカルリポジトリで起きた問題点を、人間がgithubにアップして、
その内容を 総指揮官役であるChatGPT o3 が分析してレポートを書き、
現場ローカル側のcursor(人間とCalude-3.7-sonnetが協業)がバグ修正するためのものです。

Cursorは、o3が分析しやすいように、ローカルの問題点をまとめた議事録を書いてください。
ChatGPT o3は、githubのissueやリポジトリを見てから、そのissueに対するコメントを書いて下さい。

## githubリポジトリ
https://github.com/ttaarroo77/commit_coach_ver02/tree/fix/hydration-error

## 目次

- 概要:cusor担当
- 詳細:cursor担当
  - 問題点：
  - 注意深く見るべきと思うファイル：
  - 上記の中身を見るための catコマンド：
  - 原因と解決策に関する仮説 (複数)：
  - その他：

- o3からのコメント：o3担当
  - 解決のための手順 (チェックリスト[ ]付き)：
  - 注意すべき点とその対策
  - 初学者である人間のためのガイドや学習Tips：

## o3への依頼

## 新たな問題発見: ダッシュボードの重複キーエラー - 2024年5月26日

ハイドレーションエラー修正の実装後、ダッシュボード画面で以下の新たなエラーが発見されました：

```
Console Error

Encountered two children with the same key, `project-2`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.

app/dashboard/page.tsx (801:43) @ eval

  799 |                                       <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
  800 |                                         {group.projects.map((project, projectIndex) => (
> 801 |                                           <Draggable key={project.id} draggableId={project.id} index={projectIndex}>
      |                                           ^
  802 |                                             {(provided) => (
  803 |                                               <div
  804 |                                                 ref={provided.innerRef}
```

このエラーは、まさにo3のレポートで指摘されていた通り、異なるグループ間で同じプロジェクトID（`project-2`）が使用されていることが原因です。`<Draggable>`コンポーネントのkeyが一意でないため、Reactのレンダリングアルゴリズムに問題が発生しています。

## 対応状況の報告（更新: 2024年5月27日）

o3の提案に基づき、以下の修正を実装しました：

1. **`<Draggable>` のkeyとdraggableIdをどちらも一意にする**:
   - 複合キー `${group.id}-${project.id}` 形式でキーを設定
   - draggableId にも `${group.id}:${project.id}` 形式で一意の識別子を設定 ✅

2. **複合IDを処理するユーティリティ関数の追加**:
   - `makeDragId`/`makeTaskDragId`/`makeSubtaskDragId` などの生成関数
   - `splitDragId`/`splitTaskDragId`/`splitSubtaskDragId` などの解析関数 ✅

3. **Duplicate keyテストの拡充**:
   - `tests/unit/duplicate-keys.test.example.js` でコンソールエラー検出テスト
   - プロジェクトID検証ユーティリティ関数を追加 ✅

4. **ハイドレーションポリシードキュメントの更新**:
   - "キー設計指針" セクションを追加
   - 複合キーのベストプラクティスを文書化 ✅

5. **ESLintルールの追加**:
   - `eslint-plugin-react-x` を依存関係に追加
   - `.eslintrc.json` で以下のルールを有効化
     - `react-x/no-duplicate-key`
     - `react/no-array-index-key` ✅

## 次の対応：CI ステップの追加

- GitHub Actions のワークフローに `npm run lint && npm test` ステップを追加予定

引き続き o3 の指導に従い、重複キー問題を根本的に解決していきます。

## o3からのコメント：o3担当

### o3からのコメント

---

#### ✅ 解決のためのチェックリスト

* [ ] **`<Draggable>` の `key` と `draggableId` をどちらも一意にする**
  例：`key={`\${group.id}-\${project.id}`}` / `draggableId={`\${group.id}:\${project.id}`}`
* [ ] `group.id`・`project.id` が **永続的に変わらない** ことを保証（再生成すると Drag\&Drop の状態が壊れる）
* [ ] `onDragEnd` など Drag\&Drop ハンドラ内で、新しい複合 ID から元の `project.id` を取り出すユーティリティを追加
* [ ] **ユニットテスト**で `console.error` に "Encountered two children with the same key" が出ないことを検証
* [ ] **ESLint ルール** `react-x/no-duplicate-key` を `eslint-plugin-react-x` で有効化する
* [ ] PR に **CI ステップ** `npm run lint && npm test` を追加し、重複キー検知を自動化
* [ ] `docs/overview/hydration_policy.md` に "キー設計指針" セクションを追記

---

#### 1. 複合キー実装時の注意点（react-beautiful-dnd）

| 項目              | ベストプラクティス                                                                                |
| --------------- | ---------------------------------------------------------------------------------------- |
| **key**         | React の再レンダリング用なので **どの要素にも一意** に。<br>リスト外の UI には影響しない。                                  |
| **draggableId** | `<DragDropContext>` 全体で一意である必要あり。<br>ドロップ先が変わっても衝突しないよう、必ずグループ ID を混ぜる。([Code Daily][1]) |
| 区切り文字           | 将来の split() を考え **コロン `:`** など出現しない文字を使うと安全。                                             |
| 文字列化            | `draggableId` は **string** 型必須。Template Literals で確実に文字列化する。                             |
| パフォーマンス         | 複合キー生成を **useMemo** で包むと再計算を抑えられる。                                                       |

> **結論**：`key` も `draggableId` も両方複合化するのが最小コストで確実です。
> 片方だけ複合化しても他方が衝突すれば警告は消えません。

---

#### 2. `draggableId` を変える場合のコード断片

```tsx
// utils/dragIds.ts
export const makeDragId = (groupId: string, projectId: string) =>
  `${groupId}:${projectId}`;

export const splitDragId = (dragId: string) => {
  const [groupId, projectId] = dragId.split(':');
  return { groupId, projectId };
};
```

```tsx
// app/dashboard/page.tsx
<Draggable
  key={`${group.id}-${project.id}`}
  draggableId={makeDragId(group.id, project.id)}
  index={projectIndex}
>
```

`onDragEnd` 側では `splitDragId(result.draggableId)` で元 ID を復元し、既存ロジックを崩さずに済みます。

---

#### 3. ESLint & CI での自動検出

| ステップ        | 設定例                                                                                                                                                                                                  |                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 依存追加        | `npm i -D eslint-plugin-react-x`                                                                                                                                                                     |                                          |
| `.eslintrc` | `jsonc\n{\n  \"extends\": [\"plugin:react-x/recommended\"],\n  \"rules\": {\n    \"react-x/no-duplicate-key\": \"error\",\n    \"react/no-array-index-key\": \"warn\"\n  }\n}\n` ([ESLint React][2]) |                                          |
| CI          | \`\`\`yaml\n- name: Lint & Test\n  run:                                                                                                                                                              | \n    npm run lint\n    npm test\n\`\`\` |

> **ポイント**
>
> * `react-x/no-duplicate-key` は **同一レンダーツリー内の重複キー** を静的解析で弾き、コンソールエラー前に CI で落とせます。
> * `react/no-array-index-key` も同時に立てておくと、安易な index キー使用を防止。

---

#### 4. 学習 Tips（初学者向け）

| つまずきポイント                | 解説                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "キーをユニークに" とは？          | **React は key をメモ化のヒント**に使い、DOM パッチを最小化します。重複すると **状態が取り違えられ** 不可解な UI バグが起こるので常に一意に。                                                                                    |
| なぜ `project.id` だけではダメ？ | 複数のグループに同じプロジェクトを **参照表示**するケースで衝突。設計段階で "同一 Entity が複数リストに乗る可能性" を意識すると回避できます。                                                                                          |
| ESLint ルール名が多すぎて迷う      | "**no-missing-key / no-duplicate-key / no-array-index-key**" の 3 つを押さえれば 80% 防げます。まずはプリセット `react-x/recommended` を使うと早い。                                                 |
| テストで console.error を監視  | `js\njest.spyOn(console, 'error').mockImplementation(() => {});\nrender(<Dashboard />);\nexpect(console.error).not.toHaveBeenCalled();\n`<br>を置くだけで **キー警告もテスト落ち**になります。 |

---

### ✔ まとめ

* **`draggableId` も含めた複合キー**が最短距離の修正。
* **`eslint-plugin-react-x` の `no-duplicate-key` ルール**で再発防止。
* Drag\&Drop のユニーク ID 取り扱いは **ユーティリティ関数化**して全ファイルで共通化。
* 既存ハイドレーション方針と合わせ、「レンダリング時に差分が出ない」コード規約**を Docs に追記するとチーム内共有がスムーズ。

これで「重複キー → React 再利用ミス → コンソールエラー」の連鎖を根本的に断ち切れます。
次の PR で上記チェックリストをすべて緑にしてもらえれば、再レビューします。 💪

[1]: https://www.codedaily.io/tutorials/Multi-List-Drag-and-Drop-With-react-beautiful-dnd-Immer-and-useReducer "Multi List Drag and Drop With react-beautiful-dnd, Immer, and useReducer"
[2]: https://eslint-react.xyz/docs/rules/no-duplicate-key "no-duplicate-key | ESLint React"

