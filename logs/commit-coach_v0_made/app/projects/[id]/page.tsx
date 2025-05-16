"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { TaskGroup } from "@/components/task-group"
import { AICoachSidebar } from "@/components/ai-coach-sidebar"
import { getProjectData, type ProjectData } from "@/lib/project-utils"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProject() {
      try {
        const projectData = await getProjectData(projectId)
        setProject(projectData)
      } catch (error) {
        console.error("プロジェクトの読み込みに失敗しました", error)
        setError("プロジェクトの読み込みに失敗しました")
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId])

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">エラー</h2>
            <p className="text-gray-600">{error || "プロジェクトが見つかりませんでした"}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 overflow-auto">
          <div className="w-full max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold"># {project.projectTitle}</h1>
              <Input
                type="date"
                className="w-40"
                placeholder="日付を選択"
                value={project.dueDate || ""}
                onChange={() => {}}
              />
            </div>

            <div className="space-y-4">
              {/* タスクグループのリスト */}
              {project.taskGroups.map((group, index) => (
                <TaskGroup
                  key={group.id}
                  id={group.id}
                  title={group.title}
                  tasks={group.tasks || []}
                  dueDate={group.dueDate}
                  prefix={index === 0 ? "##" : "###"}
                  defaultExpanded={index === 0}
                />
              ))}

              {/* 新しいタスクグループを追加ボタン */}
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="border-dashed">
                  <Plus className="mr-2 h-4 w-4" />
                  新しいタスクグループを追加
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* AIコーチサイドバー */}
      <AICoachSidebar />
    </div>
  )
}
