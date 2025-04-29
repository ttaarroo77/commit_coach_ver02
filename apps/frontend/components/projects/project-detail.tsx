import { useState } from "react"
import { DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Project, Task } from "@/types"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"

interface ProjectDetailProps {
  project: Project
  tasks: Task[]
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void
}

export function ProjectDetail({ project, tasks, onUpdateTask }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState("board")
  const [localTasks, setLocalTasks] = useState(tasks)

  // タスクをステータスでグループ化
  const taskGroups = {
    todo: localTasks.filter(t => t.status === "todo"),
    inProgress: localTasks.filter(t => t.status === "in-progress"),
    done: localTasks.filter(t => t.status === "done")
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeTask = localTasks.find(t => t.id === active.id)
    const overTask = localTasks.find(t => t.id === over.id)

    if (!activeTask || !overTask) return

    // 異なるカラム間のドラッグ
    if (activeTask.status !== overTask.status) {
      setLocalTasks(tasks => {
        return tasks.map(task => {
          if (task.id === activeTask.id) {
            return { ...task, status: overTask.status }
          }
          return task
        })
      })

      onUpdateTask?.(activeTask.id, { status: overTask.status })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    // 同じカラム内での並び替え
    if (active.id !== over.id) {
      setLocalTasks(tasks => {
        const oldIndex = tasks.findIndex(t => t.id === active.id)
        const newIndex = tasks.findIndex(t => t.id === over.id)
        return arrayMove(tasks, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <div className="flex gap-2">
          {/* プロジェクト操作ボタンをここに追加 */}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="board">ボード</TabsTrigger>
          <TabsTrigger value="list">リスト</TabsTrigger>
          <TabsTrigger value="timeline">タイムライン</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-6">
          <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KanbanColumn id="todo" title="ToDo" tasks={taskGroups.todo}>
                {taskGroups.todo.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </KanbanColumn>

              <KanbanColumn id="in-progress" title="進行中" tasks={taskGroups.inProgress}>
                {taskGroups.inProgress.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </KanbanColumn>

              <KanbanColumn id="done" title="完了" tasks={taskGroups.done}>
                {taskGroups.done.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </KanbanColumn>
            </div>
          </DndContext>
        </TabsContent>

        <TabsContent value="list">
          {/* リスト表示を実装予定 */}
        </TabsContent>

        <TabsContent value="timeline">
          {/* タイムライン表示を実装予定 */}
        </TabsContent>

        <TabsContent value="settings">
          {/* プロジェクト設定を実装予定 */}
        </TabsContent>
      </Tabs>
    </div>
  )
} 