# タスク分解機能の実装ガイド：

### 目的

* **`{}` 分解ボタン** を押したとき、
  1 階層下のリストを *即座に* 生成して UI に反映できるようにする。
* 将来 **AI コーチング** で本格的な分解ロジックを差し替えられるよう、**フック化** & **非同期モック**で実装する。

---

## 実装サマリー

| やること                               | 触るファイル                                                              | 役割                                        |
| ---------------------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| 1. **共通フック** `useDecompose.ts` 追加  | `hooks/use-decompose.ts`                                            | 分解 API（モック or AI 呼び出し）を呼んで配列を返す           |
| 2. **TaskGroup / Task に dispatch** | `components/task-group.tsx`<br>`components/task-item-with-menu.tsx` | `{}` クリック → `onBreakdown(id, level)` をコール |
| 3. **ProjectsPage で state 生成**     | `app/projects/page.tsx`                                             | 返ってきた配列を state に組み込み／再レンダー                |
| 4. **後で AI に差し替えられるようモック層を DI**    | `lib/decompose-service.ts`                                          | 今は固定サンプル、あとで OpenAI や自社モデルに切替             |

---

## 1. アーキテクチャ設計

* [x] 分解ロジックを **サービス層** (`lib/decompose-service.ts`) に切り出す
* [x] UI からは **React Hook** (`hooks/use-decompose.ts`) 経由で呼ぶ図を設計
* [x] モック実装と将来 AI 実装を **Strategy Pattern** で差し替え可能にする

---

## 2. フックを作る（hooks/use-decompose.ts）

```ts
import { mockDecompose } from "@/lib/decompose-service";

/**
 * level = 1 (Project) | 2 (Task) – 今回は2階層のみ
 */
export async function useDecompose(
  title: string,
  level: 1 | 2,
): Promise<string[]> {
  // ここを将来 AI 呼び出しに差し替える
  return mockDecompose(title, level);
}
```

---

## 3. `task-item-with-menu.tsx` にハンドラを注入

```tsx
// 既存 props に追加
onBreakdown?: (id: string, level: number, title: string) => void;

// ボタン onClick を変更
<Button
  … onClick={() => onBreakdown?.(id, level, title)}
>
  <Braces className="h-4 w-4" />
</Button>
```

---

## 4. `task-group.tsx` で Task クリックを親に伝播

```tsx
<TaskItemWithMenu
  …
  onBreakdown={(taskId, lvl, tTitle) =>
    onBreakdown?.(taskId, lvl, tTitle, /* parentId = */ id)
  }
/>
```

---

## 5. `ProjectsPage` で分岐ロジック

```tsx
import { useDecompose } from "@/hooks/use-decompose";

// 分解コールバック
const handleBreakdown = async (
  nodeId: string,
  level: number,
  title: string,
  parentId?: string,
) => {
  const items = await useDecompose(title, level as 1 | 2);

  setProjects((prev) =>
    prev.map((p) => {
      if (level === 1 && p.id === nodeId) {
        // Project → 新 Task 生成
        return {
          ...p,
          tasks: items.map((t, i) => ({
            id: `task-${Date.now()}-${i}`,
            title: t,
            completed: false,
            expanded: false,
            subtasks: [],
          })),
        };
      }
      if (level === 2) {
        // Task → SubTasks
        return {
          ...p,
          tasks: p.tasks.map((tk) =>
            tk.id === nodeId
              ? {
                  ...tk,
                  expanded: true,
                  subtasks: items.map((s, i) => ({
                    id: `sub-${Date.now()}-${i}`,
                    title: s,
                    completed: false,
                  })),
                }
              : tk,
          ),
        };
      }
      return p;
    }),
  );
};
```

* `TaskGroup` と `TaskItemWithMenu` の `onBreakdown` prop に **`handleBreakdown`** を渡すだけで連動。

---

## 6. モックサービス（lib/decompose-service.ts）

```ts
export const mockDecompose = (title: string, level: 1 | 2): string[] => {
  // 後で AI に差し替える箇所
  if (level === 1) {
    return [
      "市場・テーマ選定",
      "ブログ基盤構築",
      "コンテンツ制作・SEO最適化",
      "集客チャネル拡大",
      "収益化 & LTV 向上",
      "計測・改善・自動化",
    ];
  }
  // level 2 → 任意のサブタスク
  return [
    `「${title}」キックオフ`,
    `要件取りまとめ`,
    `工数見積もり`,
    `ステークホルダー承認`,
  ];
};
```

---

## 7. 将来 AI に差し替える場合

1. **OpenAI**

   ```ts
   import OpenAI from "openai";
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   export const decomposeAI = async (title: string, level: 1 | 2) => {
     const prompt = `「${title}」を${level === 1 ? "タスク" : "サブタスク"}に6つ分解して箇条書きで出力`;
     const res = await openai.chat.completions.create({ … });
     return parseBullets(res.choices[0].message.content);
   };
   ```
2. **lib/decompose-service.ts** を `export const decompose = isProd ? decomposeAI : mockDecompose;` に変更するだけで OK。

---

### ✔️ これで `{}` ボタンを押すと

* **Project** → 即時 Task 群が生成されリストに追加
* **Task** → SubTask が生成 & Task が展開状態で表示

今後 AI 呼び出しに切り替えても **UI 側の改変は不要** です。






# 実装チェックリスト

> **目的**: Projects 画面の「{ } 分解」ボタンを押した際、
>
> * プロジェクト → 直下のタスク群
> * タスク → 直下のサブタスク群
>   を即時に生成して UI に反映させる。さらに将来 AI コーチングで
>   本ロジックを差し替えられるよう拡張ポイントを用意する。

---

## 0. 事前準備

* [x] `feat/decompose-button` ブランチを切る
* [x] 最新 `main` をマージ & lint が緑であることを確認

## 1. アーキテクチャ設計

* [x] 分解ロジックを **サービス層** (`lib/decompose-service.ts`) に切り出す
* [x] UI からは **React Hook** (`hooks/use-decompose.ts`) 経由で呼ぶ図を設計
* [x] モック実装と将来 AI 実装を **Strategy Pattern** で差し替え可能にする

## 2. コード実装

### 2‑1  共通フック

* [x] `hooks/use-decompose.ts` を作成
* [x] 引数: `(title: string, level: 1 | 2)` で戻り値 `Promise<string[]>`

### 2‑2  モックサービス

* [x] `lib/decompose-service.ts` に `mockDecompose` を実装
* [x] 後で `openaiDecompose` に差し替えられるよう export 位置を計画

### 2‑3  ボタンイベントの伝播

* [x] `components/task-item-with-menu.tsx` に `onBreakdown(id, level, title)` Props を追加
* [x] `{}` クリックでこのコールバックを呼ぶ
* [x] `task-group.tsx` でタスク → 親コンポへ引き上げる

### 2‑4  状態更新

* [x] `app/projects/page.tsx` に `handleBreakdown` を実装
* [x] `useDecompose` を await → 配列を state にマージ
* [x] Project → tasks 生成, Task → subtasks 生成 の両パスを実装

## 3. UI / UX

* [x] 生成後 **対象ノードを自動展開**して結果がすぐ見えるようにする
* [x] トーストで「6 個のタスクを追加しました」と通知
* [x] 分解中は `{}` アイコンを `animate-spin` に置き換えローディング示唆

## 4. テスト

* [ ] **Unit**: `use-decompose` がモック配列を返す
* [ ] **Integration**: `handleBreakdown` が state のネストを正しく増やす
* [ ] **E2E (Playwright)**: ユーザがボタンクリック → 新タスクが DOM に現れる

## 5. ドキュメント

* [ ] `README_decompose.md` を作成し設計と将来 AI 差し替え手順を記載

## 6. レビュー & マージ

* [ ] PR に SS / GIF を添付して UX を共有
* [ ] CI 緑 + Reviewer OK → `main` へマージ
* [ ] タグ `v0.3.0` を打ち、Vercel で preview を確認

---

### 備考

* 今はモックで固定配列。**OpenAI 連携**は別チケット (`AI‑101`) で実装。
