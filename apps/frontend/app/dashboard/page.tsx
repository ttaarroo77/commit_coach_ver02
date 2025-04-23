"use client"

import { useState, useEffect } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { Clock } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { AIChat } from "@/components/ai-chat"
import { TaskGroup } from "@/components/dashboard/TaskGroup"
import { useTaskManagement } from "@/hooks/useTaskManagement"
import { useTaskData } from "@/hooks/useTaskData"

// 初期データはuseTaskDataフックから取得するため、ここでは空の配列を設定
import type { TaskGroup as TaskGroupType } from "@/types/dashboard"
const initialTaskGroups: TaskGroupType[] = []

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { taskGroups: fetchedTaskGroups, isLoading } = useTaskData()

  const {
    taskGroups,
    sortOrder,
    sortTasksByDueDate,
    toggleTaskGroup,
    toggleTask,
    updateTaskTitle,
    updateSubtaskTitle,
    toggleTaskStatus,
    toggleSubtaskCompleted,
    addTask,
    addSubtask,
    deleteTask,
    deleteSubtask,
    handleDragEnd,
  } = useTaskManagement(fetchedTaskGroups.length > 0 ? fetchedTaskGroups : initialTaskGroups)

  // 現在時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1分ごとに更新

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
  }

  if (!mounted) {
    return null
  }
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-2 text-sm text-gray-500">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            {/* ヘッダー部分 */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">ダッシュボード</h1>
                <p className="text-sm text-gray-500">{formatDateDisplay(currentTime)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">現在時刻</p>
                  <p className="text-2xl font-bold">{formatTimeDisplay(currentTime)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#31A9B8] text-white flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* タスクグループのリスト - ドラッグ&ドロップコンテキスト */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="space-y-6">
                {taskGroups.map((group) => (
                  <TaskGroup
                    key={group.id}
                    group={group}
                    onToggleGroup={toggleTaskGroup}
                    onDeleteTask={deleteTask}
                    onAddTask={addTask}
                    onUpdateGroupTitle={(groupId, newTitle) => {
                      // TODO: Implement updateGroupTitle
                    }}
                    onSortTasks={sortTasksByDueDate}
                    sortOrder={sortOrder}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>

          {/* AIコーチング */}
          <div className="w-96 border-l bg-gray-50 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">AIコーチング</h2>
            </div>
            <AIChat />
          </div>
        </main>
      </div>
    </div>
  )
}
