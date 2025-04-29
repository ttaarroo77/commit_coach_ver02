import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Project, Task } from "@/types"
import { KanbanColumn } from "./kanban-column"

interface ProjectDetailProps {
  project: Project
  tasks: Task[]
}

export function ProjectDetail({ project, tasks }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState("board")

  // タスクをステータスでグループ化
  const taskGroups = {
    todo: tasks.filter(t => t.status === "todo"),
    inProgress: tasks.filter(t => t.status === "in-progress"),
    done: tasks.filter(t => t.status === "done")
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanColumn id="todo" title="ToDo" tasks={taskGroups.todo}>
              {taskGroups.todo.map(task => (
                <Card key={task.id} className="p-4">
                  <h3>{task.title}</h3>
                </Card>
              ))}
            </KanbanColumn>

            <KanbanColumn id="in-progress" title="進行中" tasks={taskGroups.inProgress}>
              {taskGroups.inProgress.map(task => (
                <Card key={task.id} className="p-4">
                  <h3>{task.title}</h3>
                </Card>
              ))}
            </KanbanColumn>

            <KanbanColumn id="done" title="完了" tasks={taskGroups.done}>
              {taskGroups.done.map(task => (
                <Card key={task.id} className="p-4">
                  <h3>{task.title}</h3>
                </Card>
              ))}
            </KanbanColumn>
          </div>
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