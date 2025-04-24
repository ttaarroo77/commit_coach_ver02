"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { AIChat } from "@/components/ai-chat"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { TaskGroupList } from "@/components/dashboard/TaskGroupList"
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
    updateGroupTitle,
    addTask,
    deleteTask,
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
            <DashboardHeader currentTime={currentTime} />

            {/* タスクグループのリスト - ドラッグ&ドロップコンテキスト */}
            <TaskGroupList
              taskGroups={taskGroups}
              sortOrder={sortOrder}
              onDragEnd={handleDragEnd}
              onToggleGroup={toggleTaskGroup}
              onDeleteTask={deleteTask}
              onAddTask={addTask}
              onUpdateGroupTitle={updateGroupTitle}
              onSortTasks={sortTasksByDueDate}
            />
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
