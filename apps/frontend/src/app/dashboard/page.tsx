"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
// 簡略化した型定義
type DropResult = any
type DroppableProvided = any
type DroppableStateSnapshot = any
type DraggableProvided = any
type DraggableStateSnapshot = any
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar } from "@/components/sidebar"
import { AIChat } from "@/components/ai-chat"
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Plus,
  MoreHorizontal,
  Trash2,
  GripVertical,
  ArrowDown,
  ArrowUp,
  Mic,
  SplitSquareVertical,
  RefreshCw,
} from "lucide-react"
import { useDashboardTasks, type DashboardTask, type NewDashboardTask } from "@/hooks/useDashboardTasks"
import { Task } from "@/types/task"

interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface TaskGroup {
  id: string
  title: string
  expanded: boolean
  tasks: Task[]
  dueDate?: string
  completed: boolean
}

// EditableTextPropsインターフェースに isOverdue プロパティを追加
interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  prefix?: string
  isOverdue?: boolean
}

// 編集可能なテキストコンポーネント
const EditableText = ({ value, onChange, className = "", prefix = "", isOverdue = false }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      onChange(text)
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setText(value)
    }
  }

  // 期限切れのスタイルを適用
  const overdueStyle = isOverdue ? "font-bold text-[#CF3721] underline" : ""

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`bg-white border rounded px-2 py-1 w-full ${className} ${isOverdue ? "text-[#CF3721]" : ""}`}
    />
  ) : (
    <span className={`cursor-pointer ${className} ${overdueStyle}`} onClick={handleClick}>
      {prefix}
      {value}
    </span>
  )
}

// 納期が過ぎているかチェックする関数を追加
const isDateOverdue = (date?: string): boolean => {
  if (!date) return false
  const dueDate = new Date(date)
  const now = new Date()
  return dueDate < now
}

// 配列内の要素を並び替える汎用関数
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// プロジェクトごとの色を返す関数
const getProjectColor = (project: string) => {
  switch (project) {
    case "チーム管理":
      return "bg-[#31A9B8]/10 text-[#31A9B8]"
    case "ウェブアプリ開発":
      return "bg-[#258039]/10 text-[#258039]"
    case "デザインプロジェクト":
      return "bg-[#F5BE41]/10 text-[#F5BE41]"
    case "QA":
      return "bg-[#CF3721]/10 text-[#CF3721]"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// 日付・時刻フォーマット用関数を追加
const formatTimeDisplay = (date: Date) => {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
}

const formatDateDisplay = (date: Date) => {
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
}

// 共通のアイコンスタイル
const iconStyle = "h-4 w-4 text-gray-300"

// statusの型変換関数
const convertStatus = (status: DashboardTask['status']): Task['status'] => {
  switch (status) {
    case 'pending':
      return 'todo'
    case 'in_progress':
      return 'in_progress'
    case 'completed':
      return 'completed'
    default:
      return 'todo'
  }
}

// Task型のstatusからDashboardTask型のstatusへの変換関数
const convertToDashboardStatus = (status: Task['status']): DashboardTask['status'] => {
  switch (status) {
    case 'todo':
      return 'pending'
    case 'in_progress':
      return 'in_progress'
    case 'completed':
      return 'completed'
    default:
      return 'pending'
  }
}

// DashboardTaskからTask型への変換関数
const convertToTask = (dashboardTask: DashboardTask): Task => ({
  id: dashboardTask.id,
  title: dashboardTask.title,
  status: convertStatus(dashboardTask.status),
  project: dashboardTask.project,
  progress: 0, // デフォルト値
  subtasks: [], // デフォルト値
  startTime: dashboardTask.startTime,
  endTime: dashboardTask.endTime,
  created_at: dashboardTask.createdAt,
})

export default function DashboardPage() {
  const { tasks: dashboardTasks, isLoading, error, addTask: addDashboardTask, updateTask, deleteTask } = useDashboardTasks()

  // 日付・時刻の取得
  const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000) // 1分ごとに更新
    return () => clearInterval(timer)
  }, [])

  // ソート順
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")

  // DashboardTaskをTask型に変換
  const convertedTasks = dashboardTasks.map(convertToTask)

  // タスクを今日のタスクと未定のタスクに分類
  const todayTasks = convertedTasks.filter(task => task.startTime && task.endTime)
  const unscheduledTasks = convertedTasks.filter(task => !task.startTime || !task.endTime)

  // タスクグループ
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([
    {
      id: "today",
      title: "今日のタスク",
      expanded: true,
      completed: false,
      tasks: todayTasks,
    },
    {
      id: "unscheduled",
      title: "未定のタスク",
      expanded: true,
      completed: false,
      tasks: unscheduledTasks,
    },
  ])

  // convertedTasksが変更されたら、taskGroupsを更新
  useEffect(() => {
    const todayTasks = convertedTasks.filter(task => task.startTime && task.endTime)
    const unscheduledTasks = convertedTasks.filter(task => !task.startTime || !task.endTime)

    setTaskGroups([
      {
        id: "today",
        title: "今日のタスク",
        expanded: true,
        completed: false,
        tasks: todayTasks,
      },
      {
        id: "unscheduled",
        title: "未定のタスク",
        expanded: true,
        completed: false,
        tasks: unscheduledTasks,
      },
    ])
  }, [convertedTasks])

  // ホバー状態を管理する状態変数
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const [hoveredTask, setHoveredTask] = useState<{ groupId: string; taskId: string } | null>(null)
  const [hoveredSubtask, setHoveredSubtask] = useState<{ groupId: string; taskId: string; subtaskId: string } | null>(null)

  // タスクを期限順にソートする
  const sortTasksByDueDate = (order: "asc" | "desc" | "none") => {
    setSortOrder(order)

    if (order === "none") return

    setTaskGroups(prevGroups =>
      prevGroups.map(group => {
        // タスクを期限でソート
        const sortedTasks = [...group.tasks].sort((a, b) => {
          // 完了したタスクは常に下部に
          if (a.status === "completed" && b.status !== "completed") return 1
          if (a.status !== "completed" && b.status === "completed") return -1

          // 期限がないタスクは下部に
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1

          // 期限順にソート
          const dateA = new Date(a.dueDate)
          const dateB = new Date(b.dueDate)
          return order === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
        })

        return { ...group, tasks: sortedTasks }
      })
    )
  }

  // タスクグループの展開/折りたたみを切り替える
  const toggleTaskGroup = (groupId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group => (group.id === groupId ? { ...group, expanded: !group.expanded } : group))
    )
  }

  // タスクの展開/折りたたみを切り替える
  const toggleTask = (groupId: string, taskId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map(task => (task.id === taskId ? { ...task, expanded: !task.expanded } : task)),
          }
          : group
      )
    )
  }

  // タスクタイトルを更新
  const updateTaskTitle = (groupId: string, taskId: string, newTitle: string) => {
    // UIの更新
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map(task => (task.id === taskId ? { ...task, title: newTitle } : task)),
          }
          : group
      )
    )

    // バックエンドの更新
    updateTask(taskId, { title: newTitle })
  }

  // サブタスクタイトルを更新
  const updateSubtaskTitle = (groupId: string, taskId: string, subtaskId: string, newTitle: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.id === subtaskId ? { ...subtask, title: newTitle } : subtask
                  ),
                }
                : task
            ),
          }
          : group
      )
    )
  }

  // タスクの完了状態を切り替える
  const toggleTaskStatus = (groupId: string, taskId: string) => {
    // 現在のタスクを取得
    const currentTask = taskGroups.find(g => g.id === groupId)?.tasks.find(t => t.id === taskId)
    if (!currentTask) return

    // 新しいステータスを判定
    const newTaskStatus = currentTask.status === "completed" ? "todo" : "completed"
    const newDashboardStatus = convertToDashboardStatus(newTaskStatus)

    // UIの更新
    setTaskGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId) {
          // タスクの完了状態を切り替え
          const updatedTasks = group.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                status: newTaskStatus as Task["status"],
                progress: newTaskStatus === "completed" ? 100 : 0,
                // サブタスクも同期して更新
                subtasks: task.subtasks.map(subtask => ({
                  ...subtask,
                  completed: newTaskStatus === "completed",
                })),
              }
            }
            return task
          })

          // 完了したタスクを下部に移動
          const sortedTasks = [...updatedTasks].sort((a, b) => {
            if (a.status === "completed" && b.status !== "completed") return 1
            if (a.status !== "completed" && b.status === "completed") return -1
            return 0
          })

          return { ...group, tasks: sortedTasks }
        }
        return group
      }) as TaskGroup[]
    )

    // バックエンドの更新
    updateTask(taskId, { status: newDashboardStatus })
  }

  // サブタスクの完了状態を切り替える
  const toggleSubtaskCompleted = (groupId: string, taskId: string, subtaskId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
                  ),
                  progress: calculateProgress(
                    task.subtasks.map(subtask =>
                      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
                    )
                  ),
                }
                : task
            ),
          }
          : group
      )
    )
  }

  // 進捗率を計算
  const calculateProgress = (subtasks: SubTask[]) => {
    if (subtasks.length === 0) return 0
    const completedCount = subtasks.filter(subtask => subtask.completed).length
    return Math.round((completedCount / subtasks.length) * 100)
  }

  // 新しいタスクを追加
  const addTask = (groupId: string) => {
    const now = new Date()
    const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    const newDashboardTask: NewDashboardTask = {
      title: "新しいタスク",
      status: "pending",
      project: "未分類",
      startTime: groupId === "today" ? startTime : "",
      endTime: groupId === "today" ? endTime : "",
    }

    addDashboardTask(newDashboardTask)
  }

  // 新しいサブタスクを追加
  const addSubtask = (groupId: string, taskId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  subtasks: [
                    ...task.subtasks,
                    {
                      id: `subtask-${Date.now()}`,
                      title: "新しいサブタスク",
                      completed: false,
                    },
                  ],
                }
                : task
            ),
          }
          : group
      )
    )
  }

  // 未定のタスクを今日のタスクに移動
  const moveToToday = useCallback((taskId: string) => {
    // 現在のタスクを取得
    const task = taskGroups.find(group => group.id === "unscheduled")?.tasks.find(task => task.id === taskId)
    if (!task) return

    // 開始時間と終了時間を設定
    const now = new Date()
    const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    // バックエンドの更新
    updateTask(taskId, { startTime, endTime })

    // UIに移動完了のフィードバックを表示
    console.log(`タスク "${task.title}" を今日のタスクに移動しました`)

    // Optional: 通知などを表示
    // showNotification(`タスク "${task.title}" を今日のタスクに移動しました`);
  }, [taskGroups, updateTask])

  // 今日のタスクを未定のタスクに移動
  const moveToUnscheduled = useCallback((taskId: string) => {
    // 現在のタスクを取得
    const task = taskGroups.find(group => group.id === "today")?.tasks.find(task => task.id === taskId)
    if (!task) return

    // バックエンドの更新
    updateTask(taskId, { startTime: "", endTime: "" })

    // UIに移動完了のフィードバックを表示
    console.log(`タスク "${task.title}" を未定のタスクに移動しました`)

    // Optional: 通知などを表示
    // showNotification(`タスク "${task.title}" を未定のタスクに移動しました`);
  }, [taskGroups, updateTask])

  // ドラッグ&ドロップの処理
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result

    // ドロップ先がない場合（ドラッグがキャンセルされた場合）は何もしない
    if (!destination) {
      return
    }

    // 同じ位置にドロップされた場合は何もしない
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // タスクの並び替え
    if (type === "task") {
      // 同じグループ内でのタスクの並び替え
      if (source.droppableId === destination.droppableId) {
        const groupId = source.droppableId
        const group = taskGroups.find(g => g.id === groupId)
        if (!group) return

        const reorderedTasks = reorder(group.tasks, source.index, destination.index)

        setTaskGroups(prevGroups => prevGroups.map(g => (g.id === groupId ? { ...g, tasks: reorderedTasks } : g)))
      } else {
        // 異なるグループ間でのタスクの移動
        const sourceGroupId = source.droppableId
        const destGroupId = destination.droppableId

        const sourceGroup = taskGroups.find(g => g.id === sourceGroupId)
        const destGroup = taskGroups.find(g => g.id === destGroupId)

        if (!sourceGroup || !destGroup) return

        // 移動するタスクを取得
        const taskToMove = sourceGroup.tasks[source.index]

        // 今日のタスクに移動する場合は時間を設定
        if (destGroupId === "today" && !taskToMove.startTime) {
          moveToToday(taskToMove.id)
        }

        // 未定のタスクに移動する場合は時間を削除
        if (destGroupId === "unscheduled" && taskToMove.startTime) {
          moveToUnscheduled(taskToMove.id)
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div>読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
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
                {taskGroups.map((group, groupIndex) => (
                  <Card key={group.id} className="overflow-hidden">
                    <CardHeader
                      className="p-4 bg-gray-50"
                      onMouseEnter={() => setHoveredGroup(group.id)}
                      onMouseLeave={() => setHoveredGroup(null)}
                    >
                      <div className="flex items-center gap-4">
                        {/* 展開/折りたたみボタン - 左端に配置 */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-6 w-6"
                          onClick={() => toggleTaskGroup(group.id)}
                        >
                          {group.expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </Button>

                        {/* ドラッグハンドルの余白（ダッシュボードではドラッグ不可） */}
                        <div className="w-6"></div>

                        {/* チェックボックスの余白 */}
                        <div className="w-6"></div>

                        {/* タスクグループタイトル */}
                        <CardTitle className="text-lg font-bold flex-1">
                          <EditableText
                            value={group.title}
                            onChange={(newTitle) => {
                              setTaskGroups((prevGroups) =>
                                prevGroups.map((g) => (g.id === group.id ? { ...g, title: newTitle } : g)),
                              )
                            }}
                            prefix="## "
                          />
                        </CardTitle>

                        {/* メニューアイコン - 常に領域を確保し、ホバー時のみ表示 */}
                        <div className="flex items-center gap-1 w-48 relative">
                          <div
                            className={`absolute right-0 flex items-center gap-1 transition-opacity ${hoveredGroup === group.id ? "opacity-100" : "opacity-0"}`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => addTask(group.id)}
                              title="項目追加"
                            >
                              <Plus className={iconStyle} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => sortTasksByDueDate(sortOrder === "asc" ? "desc" : "asc")}
                              title="更新"
                            >
                              <RefreshCw className={`h-4 w-4 ${sortOrder !== "none" ? "text-[#31A9B8]" : iconStyle}`} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="他メニュー">
                              <MoreHorizontal className={iconStyle} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    {group.expanded && (
                      <CardContent className="p-4">
                        <Droppable droppableId={group.id} type="task">
                          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                            <div
                              className={`space-y-4 relative ${snapshot.isDraggingOver ? "bg-gray-50/50 rounded-lg p-2" : ""}`}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                minHeight: snapshot.isDraggingOver ? "50px" : "auto",
                              }}
                            >
                              {group.tasks.map((task, taskIndex) => (
                                <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                      }}
                                    >
                                      <div
                                        className={`border rounded-md ${snapshot.isDragging ? "shadow-lg bg-gray-50" : ""}`}
                                      >
                                        {/* タスク */}
                                        <div
                                          className="p-3 bg-gray-50 flex items-center"
                                          onMouseEnter={() => setHoveredTask({ groupId: group.id, taskId: task.id })}
                                          onMouseLeave={() => setHoveredTask(null)}
                                        >
                                          <div className="flex items-center flex-1 gap-4">
                                            {/* 展開/折りたたみボタン - 左端に配置 */}
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="p-0 h-6 w-6"
                                              onClick={() => toggleTask(group.id, task.id)}
                                            >
                                              {task.expanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                              ) : (
                                                <ChevronRight className="h-4 w-4" />
                                              )}
                                            </Button>

                                            {/* ドラッグハンドル */}
                                            <div {...provided.dragHandleProps} className="cursor-grab mr-2">
                                              <GripVertical className="h-4 w-4 text-gray-400" />
                                            </div>

                                            {/* チェックボックス */}
                                            <Checkbox
                                              checked={task.status === "completed"}
                                              onCheckedChange={() => toggleTaskStatus(group.id, task.id)}
                                            />

                                            {/* タスクタイトル */}
                                            <span
                                              className={`flex-1 ${task.status === "completed" ? "line-through text-gray-400" : ""}`}
                                            >
                                              <EditableText
                                                value={task.title}
                                                onChange={(newTitle) => updateTaskTitle(group.id, task.id, newTitle)}
                                                className={
                                                  task.status === "completed" ? "line-through text-gray-400" : ""
                                                }
                                                isOverdue={task.status !== "completed" && isDateOverdue(task.dueDate)}
                                              />
                                            </span>

                                            {/* メニューアイコン - 常に領域を確保し、ホバー時のみ表示 */}
                                            <div className="flex items-center gap-1 w-48 relative">
                                              <div
                                                className={`absolute right-0 flex items-center gap-1 transition-opacity ${hoveredTask &&
                                                  hoveredTask.groupId === group.id &&
                                                  hoveredTask.taskId === task.id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                                  }`}
                                              >
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() => deleteTask(task.id)}
                                                  title="タスク削除"
                                                >
                                                  <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() => addSubtask(group.id, task.id)}
                                                  title="サブタスク追加"
                                                >
                                                  <Plus className={iconStyle} />
                                                </Button>
                                                {group.id === "today" ? (
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => moveToUnscheduled(task.id)}
                                                    title="未定のタスクに移動"
                                                  >
                                                    <ArrowDown className="h-4 w-4" />
                                                  </Button>
                                                ) : (
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => moveToToday(task.id)}
                                                    title="今日のタスクに移動"
                                                  >
                                                    <ArrowUp className="h-4 w-4" />
                                                  </Button>
                                                )}
                                              </div>
                                            </div>

                                            {/* 時間表示とプロジェクトタグ - 常に右端に固定 */}
                                            <div className="flex items-center gap-2">
                                              {/* プロジェクトタグ */}
                                              {task.project && (
                                                <span
                                                  className={`text-xs px-2 py-1 rounded-full ${getProjectColor(task.project)}`}
                                                >
                                                  {task.project}
                                                </span>
                                              )}

                                              {task.startTime && task.endTime && (
                                                <div className="text-xs text-gray-500 min-w-[80px] text-right">
                                                  {task.startTime} - {task.endTime}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* サブタスク */}
                                        {task.expanded && task.subtasks.length > 0 && (
                                          <div className="p-3 pl-10 space-y-2 border-t">
                                            {task.subtasks.map((subtask) => (
                                              <div
                                                key={subtask.id}
                                                className="flex items-center"
                                                onMouseEnter={() =>
                                                  setHoveredSubtask({
                                                    groupId: group.id,
                                                    taskId: task.id,
                                                    subtaskId: subtask.id,
                                                  })
                                                }
                                                onMouseLeave={() => setHoveredSubtask(null)}
                                              >
                                                <div className="flex items-center flex-1 gap-4">
                                                  {/* 左側の余白（展開ボタンの代わり） */}
                                                  <div className="w-6"></div>

                                                  {/* ドラッグハンドルの余白 */}
                                                  <div className="w-6"></div>

                                                  {/* チェックボックス */}
                                                  <Checkbox
                                                    checked={subtask.completed}
                                                    onCheckedChange={() =>
                                                      toggleSubtaskCompleted(group.id, task.id, subtask.id)
                                                    }
                                                    className="mr-2"
                                                  />

                                                  {/* サブタスクタイトル */}
                                                  <span
                                                    className={`flex-1 ${subtask.completed ? "line-through text-gray-400" : ""}`}
                                                  >
                                                    <EditableText
                                                      value={subtask.title}
                                                      onChange={(newTitle) =>
                                                        updateSubtaskTitle(group.id, task.id, subtask.id, newTitle)
                                                      }
                                                      className={subtask.completed ? "line-through text-gray-400" : ""}
                                                    />
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {group.tasks.length === 0 && (
                                <div className="flex justify-center my-4">
                                  <Button
                                    variant="outline"
                                    className="border-dashed text-gray-400 hover:text-gray-600"
                                    onClick={() => addTask(group.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    タスクを追加
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </CardContent>
                    )}
                  </Card>
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
