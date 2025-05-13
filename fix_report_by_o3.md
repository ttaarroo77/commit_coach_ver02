# fix_expand_button_for_added_items.md
**目的**
- プロジェクト画面から追加した「## プロジェクト」や「### タスク」を **ダッシュボード上でも必ず展開／折りたたみ可能** にする
- "展開 ▸ / 折りたたみ ▾" ボタンが表示されないバグを解消し、追加直後も UX を統一する

---

## 1. 現状と問題点

| 階層 | 症状 | コード上の原因 |
| --- | --- | --- |
| **プロジェクト (`level = 1`)** | `hasChildren === false` の場合、`HierarchicalTaskItem` が <br>展開ボタンを描画しない → 追加直後はタスクが空なのでボタンが消える | `HierarchicalTaskItem` 内条件：<br>`hasChildren ? (<Button …/>) : <div className="w-6" />` |
| **タスク (`level = 2`)** | 同上 — サブタスクが空のまま追加すると矢印非表示 | `hasChildren={task.subtasks.length > 0}` が原因 |
| **折りたたみ状態** | 矢印がないため `toggleProject()` / `toggleTask()` が呼べず状態が変わらない | UI 起点のイベントが存在しない |

---

## 2. 手順概要

1. **UI コンポーネントを改修**
   - caret ボタンを「子が無くても表示」し、押下時に `expanded` をトグル
2. **呼び出し側 props の整理**
   - `hasChildren` を削除 or optional 化し、`level < 3` なら常時 caret を描画
3. **追加直後のデータ整合**
   - `addProjectToDashboard` / `addTaskToProject` で `expanded: true` を保証
4. **回帰テスト**（プロジェクト追加→折りたたみ→リロードで状態維持）

---

## 3. 詳細チェックリスト ✅

### 3-1. `HierarchicalTaskItem.tsx` の改修

- [x] **プロパティ整理**
  ```diff
  - expanded?: boolean
  - hasChildren?: boolean
  + expanded: boolean           // 必須に
````

* [x] **caret 描画ロジックを変更**

  ```diff
  - {hasChildren ? (
  + {level < 3 ? (
        <Button onClick={onToggleExpand} …>
          {expanded ? <ChevronDown …/> : <ChevronRight …/>}
        </Button>
    ) : (
        <div className="w-6 mr-1" />
    )}
  ```

  > *レベルが 1 または 2 なら「子が無くても常時表示」*
* [x] **インデント調整** — caret 分のスペースが既にあるのでレイアウト崩れなし

### 3-2. 呼び出し側の修正

#### `app/dashboard/page.tsx`

* [x] `<HierarchicalTaskItem …>` で **`expanded={project.expanded}` のみ渡す**

  ```diff
  - hasChildren={project.tasks.length > 0}
  + expanded={project.expanded}
  ```
* [x] タスクも同様に変更

#### `app/projects/page.tsx`

* [x] ページ内プレビューでも同じ変更を適用

### 3-3. 追加ロジックの安全装置

* [x] `addProjectToDashboard()` と `addTaskToProject()` にて

  ```ts
  expanded: true                   // ← 既にあるが念のため確認
  ```
* [x] `toggleProject()` / `toggleTask()` は既存のまま動作確認

### 3-4. 回帰テスト

| テスト       | 手順                   | 期待値                                           |
| --------- | -------------------- | --------------------------------------------- |
| **UI**    | 「新しいプロジェクトを追加」→ 矢印表示 | caret が出現し、クリックで折りたたみ                         |
| **データ保持** | 折りたたんだ状態でリロード        | 折りたたまれたまま（localStorage の `expanded:false` 反映） |
| **タスク追加** | 折りたたみ状態で「＋タスク」       | 自動で展開し caret も維持                              |

---

## 4. 事故りそうな部分と対策

| リスク                                          | 対策                                     |
| -------------------------------------------- | -------------------------------------- |
| 旧コンポーネント呼び出しが `expanded` を渡さず TypeScript エラー | `expanded` を **必須 prop** に昇格し、ビルドで検知   |
| 空プロジェクトで caret を押しても何も見えず UX 混乱              | 折りたたみ時のみ背景色を変え「空です」プレースホルダを表示          |
| 既存 `hasChildren` 依存コードとの衝突                   | grep で `hasChildren=` を洗い出し、一括置換 or 削除 |

---

## 5. 次のアクション

1. **ブランチ** `fix/caret-always-visible` を切る
2. チェックリストを順に実装 → `pnpm typecheck && pnpm lint`
3. Manual QA：プロジェクト/タスク追加 → caret 動作確認
4. GitHub PR → Vercel Preview → マージ

---

> **備考**
> 商品版では「子要素 0 のときは淡色 caret + ツールチップ "タスクを追加して展開可能に"」など、ガイダンスを追加するとさらに UX が上がります。
