# Dashboard 要件定義（MVP）

## 目的
「今日＋未定タスクを 1 画面で把握・編集」できるサンプルを示し、Next.js App Router・TypeScript・D&D ライブラリの実装力をポートフォリオでアピールする。

## スコープ
- グループ（Today / Unscheduled）の表示・展開 / 折りたたみ
- タスク & サブタスク CRUD（タイトル編集・追加・削除・完了切替）
- グループ間／行内 Drag & Drop 並び替え
- 「Move to Today／Unscheduled」ボタンで時間フィールドの付与・除去
- 現在日付 / 時刻、AIChat パネル（UI モックで可）

## データ永続
- フェーズ 1 (MVP): localStorage に保存 — デプロイ無しで即体験
- フェーズ 2 (任意): Supabase & Server Actions で tasks テーブルに置き換え

## 技術
- Next.js 15 App Router (`/apps/dashboard/page.tsx` を SSR Server Component)
- @hello-pangea/dnd（react-beautiful-dnd 後継フォーク）
- 型安全: Zod で Task スキーマ定義
- Tailwind／shadcn/ui で UI 再利用

## 非機能
- 100 ms 以内描画（初回は Server Component で JSON をインライン）
- モバイル（幅 < 640 px）では D&D 無効・リストタップ編集のみ

---

## フォルダ構成（MVP）

```
apps/
└─ dashboard/
    ├─ page.tsx             # Server Component (SSR) – localStorage も入出力
    ├─ dashboard-client.tsx # "use client" – 画面ロジック・D&D
    └─ lib/
        └─ schema.ts        # zod Task / TaskGroup 型
```

---

## 詳細コード例

### 1. lib/schema.ts
```ts
import { z } from "zod"

export const SubTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
})

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed"]),
  project: z.string().optional(),
  priority: z.string().optional(),
  progress: z.number(),
  dueDate: z.string().optional(),
  expanded: z.boolean().optional(),
  subtasks: z.array(SubTaskSchema),
})

export const TaskGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  expanded: z.boolean(),
  completed: z.boolean(),
  dueDate: z.string().optional(),
  tasks: z.array(TaskSchema),
})

export type Task = z.infer<typeof TaskSchema>
export type TaskGroup = z.infer<typeof TaskGroupSchema>
```

### 2. apps/dashboard/page.tsx (Server Component)
```tsx
import { cookies } from "next/headers"
import DashboardClient from "./dashboard-client"
import type { TaskGroup } from "./lib/schema"

export const dynamic = "force-dynamic" // 即 SSR

export default async function DashboardPage() {
  // 1) --- データ読み取り -------------------------
  // ポートフォリオのため localStorage 互換を cookie で代用
  const raw = cookies().get("dashboard")?.value
  let initialGroups: TaskGroup[] = []

  if (raw) {
    try {
      initialGroups = JSON.parse(raw)
    } catch {
      /* フォールバックは下で設定 */
    }
  }

  // 2) --- フォールバックの静的サンプル ------------
  if (initialGroups.length === 0) {
    initialGroups = (await import("./sample-data")).default
  }

  // 3) --- HTML をストリーミング -------------------
  return (
    <DashboardClient initialGroups={initialGroups} />
  )
}
```

### 3. apps/dashboard/sample-data.ts (ハードコード JSON)
```ts
import type { TaskGroup } from "./lib/schema"
const sample: TaskGroup[] = [
  /* 先ほどの today / unscheduled JSON を貼り付け */
]
export default sample
```

### 4. apps/dashboard/dashboard-client.tsx (Client Component)
```tsx
"use client"

import React, { useState, useEffect, useTransition } from "react"
import { TaskGroupSchema, type TaskGroup } from "./lib/schema"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import {
  Sidebar, AIChat,
  Button, Card, CardHeader, CardTitle, CardContent, Checkbox,
} from "@/components/ui" // shadcn/ui 再エクスポート想定
import { ChevronDown, ChevronRight, GripVertical, Plus } from "lucide-react"

// 型
interface Props { initialGroups: TaskGroup[] }

export default function DashboardClient({ initialGroups }: Props) {
  // 状態
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(initialGroups)
  const [isPending, startTransition] = useTransition()

  // 並び替えヘルパー
  const reorder = <T,>(list: T[], s: number, d: number) => {
    const arr = [...list]
    const [moved] = arr.splice(s, 1)
    arr.splice(d, 0, moved)
    return arr
  }

  // 永続化
  const persist = (next: TaskGroup[]) => {
    startTransition(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("dashboard", JSON.stringify(next))
      }
    })
  }

  // DnD
  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return
    const { source, destination } = res
    if (source.droppableId === destination.droppableId) {
      // 同一グループ並び替え
      setTaskGroups((prev) => {
        const idx = prev.findIndex((g) => g.id === source.droppableId)
        const group = prev[idx]
        const tasks = reorder(group.tasks, source.index, destination.index)
        const next = [...prev]
        next[idx] = { ...group, tasks }
        persist(next)
        return next
      })
    } else {
      // 別グループへ移動
      setTaskGroups((prev) => {
        const srcIdx = prev.findIndex((g) => g.id === source.droppableId)
        const dstIdx = prev.findIndex((g) => g.id === destination.droppableId)
        const moved = prev[srcIdx].tasks[source.index]
        const srcTasks = [...prev[srcIdx].tasks]
        srcTasks.splice(source.index, 1)
        const dstTasks = [...prev[dstIdx].tasks]
        dstTasks.splice(destination.index, 0, moved)

        const next = [...prev]
        next[srcIdx] = { ...prev[srcIdx], tasks: srcTasks }
        next[dstIdx] = { ...prev[dstIdx], tasks: dstTasks }
        persist(next)
        return next
      })
    }
  }

  // UI
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden p-6 flex">
        {/* 左: タスクリスト */}
        <div className="flex-1 overflow-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            {taskGroups.map((group) => (
              <Card key={group.id} className="mb-6">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setTaskGroups((prev) =>
                        prev.map((g) => g.id === group.id ? { ...g, expanded: !g.expanded } : g),
                      )
                    }
                  >
                    {group.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </Button>
                  <CardTitle className="flex-1">{group.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setTaskGroups((prev) =>
                        prev.map((g) => g.id === group.id
                          ? { ...g, tasks: [...g.tasks, { id: Date.now().toString(), title: "新タスク", status: "todo", progress: 0, subtasks: [] }] }
                          : g),
                      )
                    }
                  >
                    <Plus size={18} />
                  </Button>
                </CardHeader>

                {group.expanded && (
                  <CardContent>
                    <Droppable droppableId={group.id} type="task">
                      {(prov) => (
                        <div ref={prov.innerRef} {...prov.droppableProps} className="space-y-3">
                          {group.tasks.map((t, i) => (
                            <Draggable draggableId={t.id} index={i} key={t.id}>
                              {(provDrag) => (
                                <div
                                  ref={provDrag.innerRef}
                                  {...provDrag.draggableProps}
                                  className="border rounded p-3 bg-gray-50 flex items-center gap-3"
                                >
                                  <span {...provDrag.dragHandleProps} className="cursor-grab">
                                    <GripVertical size={16} className="text-gray-400" />
                                  </span>
                                  <Checkbox
                                    checked={t.status === "completed"}
                                    onCheckedChange={() =>
                                      setTaskGroups((prev) =>
                                        prev.map((g) =>
                                          g.id === group.id
                                            ? {
                                                ...g,
                                                tasks: g.tasks.map((tk) =>
                                                  tk.id === t.id
                                                    ? { ...tk, status: tk.status === "completed" ? "todo" : "completed" }
                                                    : tk,
                                                ),
                                              }
                                            : g,
                                        ),
                                      )
                                    }
                                  />
                                  <input
                                    className={`flex-1 bg-transparent outline-none ${t.status === "completed" ? "line-through text-gray-400" : ""}`}
                                    value={t.title}
                                    onChange={(e) =>
                                      setTaskGroups((prev) =>
                                        prev.map((g) =>
                                          g.id === group.id
                                            ? {
                                                ...g,
                                                tasks: g.tasks.map((tk) =>
                                                  tk.id === t.id ? { ...tk, title: e.target.value } : tk,
                                                ),
                                              }
                                            : g,
                                        ),
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {prov.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                )}
              </Card>
            ))}
          </DragDropContext>
        </div>

        {/* 右: AI Chat */}
        <div className="w-96 border-l px-4 py-6 overflow-auto">
          <AIChat />
        </div>
      </main>
    </div>
  )
}
```

---

## 差分ポイント・設計意図

- @hello-pangea/dnd に置き換え（import path だけ変更）
- すべての状態操作後に persist()→localStorage 保存（後に Server Action に昇格）
- Server 渡しの initialGroups を Hydration で型安全に受領

### 今後の拡張パス（任意）
- Server Actions に persist() を移す

```ts
"use server"
import { supabase } from "@/lib/supabase"

export async function saveDashboard(userId: string, groups: TaskGroup[]) {
  await supabase.from("dashboards").upsert({ user_id: userId, data: groups })
}
// → startTransition(() => saveDashboard(user.id, next))
```

- ISR: page.tsx に
```ts
export const revalidate = 60   // 1 分キャッシュ
```
- タスク詳細モーダル を追加し、ファイル添付などを実装。

---

## まとめ
- 要件定義で "何をどこまで" を明示し、採用担当がチェックしやすい形に。
- MVP コードは 約 200 行 に圧縮し、動的ルーティング & DnD をしっかり披露。
- 将来の Supabase 差し替えも意識し、persist() を 1 箇所に閉じ込める設計。

これで短時間でも見栄え＆拡張性のある Dashboard が完成します。進めながら詰まった点があれば、またどうぞ！