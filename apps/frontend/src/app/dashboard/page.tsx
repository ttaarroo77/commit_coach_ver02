"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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

interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface Task {
  id: string
  title: string
  startTime?: string
  endTime?: string
  status: "todo" | "in-progress" | "completed"
  project?: string
  priority?: string
  progress: number
  subtasks: SubTask[]
  expanded?: boolean
  dueDate?: string
}

// 型キャスト用のヘルパー関数
const asTaskStatus = (status: string): "todo" | "in-progress" | "completed" => {
  if (status === "todo" || status === "in-progress" || status === "completed") {
    return status;
  }
  return "todo";
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
const formatTimeDisplay = (date: Date): string => {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const formatDateDisplay = (date: Date) => {
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
}

// 共通のアイコンスタイル
const iconStyle = "h-4 w-4 text-gray-300"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")

  // IDを生成する関数（クライアントサイドのみで実行）
  const generateId = (prefix: string) => {
    if (typeof window === 'undefined') {
      return `${prefix}-placeholder`;
    }
    return `${prefix}-${Date.now()}`;
  };

  // タスクグループ
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([
    {
      id: "today",
      title: "今日のタスク",
      expanded: true,
      completed: false,
      tasks: [
        {
          id: "1",
          title: "朝のミーティング",
          startTime: "09:00",
          endTime: "10:00",
          status: "completed",
          project: "チーム管理",
          priority: "中",
          progress: 100,
          expanded: false,
          subtasks: [
            { id: "1-1", title: "議事録作成", completed: true },
            { id: "1-2", title: "タスク割り当て", completed: true },
          ],
        },
        {
          id: "2",
          title: "ログイン機能の実装",
          startTime: "10:00",
          endTime: "13:00",
          status: "completed",
          project: "ウェブアプリ開発",
          priority: "高",
          progress: 100,
          expanded: false,
          subtasks: [
            { id: "2-1", title: "UI設計", completed: true },
            { id: "2-2", title: "バックエンド連携", completed: true },
            { id: "2-3", title: "テスト", completed: true },
          ],
        },
        {
          id: "3",
          title: "ランチミーティング",
          startTime: "13:00",
          endTime: "14:00",
          status: "completed",
          project: "チーム管理",
          priority: "低",
          progress: 100,
          expanded: false,
          subtasks: [],
        },
        {
          id: "4",
          title: "APIエンドポイントの実装",
          startTime: "14:00",
          endTime: "16:00",
          status: "in-progress",
          project: "ウェブアプリ開発",
          priority: "高",
          progress: 50,
          expanded: false,
          subtasks: [
            { id: "4-1", title: "認証エンドポイント", completed: true },
            { id: "4-2", title: "ユーザー管理API", completed: false },
            { id: "4-3", title: "データ取得API", completed: false },
          ],
        },
        {
          id: "5",
          title: "ダッシュボード画面のデザイン",
          startTime: "16:00",
          endTime: "18:00",
          status: "todo",
          project: "デザインプロジェクト",
          priority: "中",
          progress: 0,
          expanded: false,
          subtasks: [
            { id: "5-1", title: "ワイヤーフレーム作成", completed: false },
            { id: "5-2", title: "コンポーネント設計", completed: false },
            { id: "5-3", title: "レスポンシブ対応", completed: false },
          ],
        },
      ],
    },
    {
      id: "unscheduled",
      title: "未定のタスク",
      expanded: true,
      completed: false,
      tasks: [
        {
          id: "6",
          title: "レスポンシブデザインの実装",
          status: "todo",
          project: "ウェブアプリ開発",
          priority: "中",
          progress: 0,
          expanded: false,
          subtasks: [
            { id: "6-1", title: "モバイル対応", completed: false },
            { id: "6-2", title: "タブレット対応", completed: false },
          ],
        },
        {
          id: "7",
          title: "ユーザー設定画面の作成",
          status: "todo",
          project: "ウェブアプリ開発",
          priority: "低",
          progress: 0,
          expanded: false,
          subtasks: [
            { id: "7-1", title: "プロフィール編集機能", completed: false },
            { id: "7-2", title: "パスワード変更機能", completed: false },
            { id: "7-3", title: "通知設定機能", completed: false },
          ],
        },
        {
          id: "8",
          title: "テスト計画書の作成",
          status: "todo",
          project: "QA",
          priority: "高",
          progress: 0,
          expanded: false,
          subtasks: [
            { id: "8-1", title: "テスト範囲の定義", completed: false },
            { id: "8-2", title: "テストケースの作成", completed: false },
          ],
        },
      ],
    },
  ])

  // ホバー状態を管理する状態変数
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const [hoveredTask, setHoveredTask] = useState<{ groupId: string; taskId: string } | null>(null)

  // クライアントサイドレンダリングのための状態
  const [isMounted, setIsMounted] = useState(false)

  // クライアントサイドでのみレンダリングを行うための効果
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 現在時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // タスクグループの展開/折りたたみを切り替える
  const toggleTaskGroup = (groupId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, expanded: !group.expanded } : group)),
    )
  }

  // タスクを追加
  const addTask = (groupId: string) => {
    const newTask: Task = {
      id: generateId('task'),
      title: "新しいタスク",
      status: "todo",
      progress: 0,
      subtasks: [],
      expanded: true,
    }
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, tasks: [...group.tasks, newTask] } : group)),
    )
  }

  // タスクグループの削除（例: 最初のタスクを削除）
  const deleteTask = (groupId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, tasks: group.tasks.filter((task) => task.id !== taskId) } : group,
      ),
    )
  }

  // タスクを期限順にソートする
  const sortTasksByDueDate = (order: "asc" | "desc" | "none") => {
    setSortOrder(order)
    if (order === "none") return
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        const sortedTasks = [...group.tasks].sort((a, b) => {
          if (a.status === "completed" && b.status !== "completed") return 1
          if (a.status !== "completed" && b.status === "completed") return -1
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          const dateA = new Date(a.dueDate)
          const dateB = new Date(b.dueDate)
          return order === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
        })
        return { ...group, tasks: sortedTasks }
      }),
    )
  }

  // ドラッグ&ドロップの処理
  const handleDragEnd = (result: any) => {
    const { source, destination, type } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return
    if (type === "task") {
      if (source.droppableId === destination.droppableId) {
        const groupId = source.droppableId
        const group = taskGroups.find((g) => g.id === groupId)
        if (!group) return
        const reorderedTasks = reorder(group.tasks, source.index, destination.index)
        setTaskGroups((prevGroups) => prevGroups.map((g) => (g.id === groupId ? { ...g, tasks: reorderedTasks } : g)))
      } else {
        const sourceGroupId = source.droppableId
        const destGroupId = destination.droppableId
        const sourceGroup = taskGroups.find((g) => g.id === sourceGroupId)
        const destGroup = taskGroups.find((g) => g.id === destGroupId)
        if (!sourceGroup || !destGroup) return
        const taskToMove = { ...sourceGroup.tasks[source.index] }
        if (destGroupId === "today" && !taskToMove.startTime) {
          const now = new Date()
          taskToMove.startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
          taskToMove.endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
        }
        if (destGroupId === "unscheduled") {
          delete taskToMove.startTime
          delete taskToMove.endTime
        }
        const updatedGroups = taskGroups.map((group) => {
          if (group.id === sourceGroupId) {
            return {
              ...group,
              tasks: group.tasks.filter((_: any, index: number) => index !== source.index),
            }
          }
          if (group.id === destGroupId) {
            const newTasks = [...group.tasks]
            newTasks.splice(destination.index, 0, taskToMove)
            return {
              ...group,
              tasks: newTasks,
            }
          }
          return group
        })
        setTaskGroups(updatedGroups)
      }
    }
  }

  // タスクの展開/折りたたみを切り替える
  const toggleTask = (groupId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map((task) => (task.id === taskId ? { ...task, expanded: !task.expanded } : task)),
          }
          : group,
      ),
    )
  }

  // タスクタイトルを更新
  const updateTaskTitle = (groupId: string, taskId: string, newTitle: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task)),
          }
          : group,
      ),
    )
  }

  // サブタスクのホバー状態
  const [hoveredSubtask, setHoveredSubtask] = useState<{ groupId: string; taskId: string; subtaskId: string } | null>(null)

  // サブタスクの完了状態を切り替える
  const toggleSubtaskCompleted = (groupId: string, taskId: string, subtaskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
                  ),
                }
                : task,
            ),
          }
          : group,
      ),
    )
  }

  // サブタスクタイトルを更新
  const updateSubtaskTitle = (groupId: string, taskId: string, subtaskId: string, newTitle: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId ? { ...subtask, title: newTitle } : subtask,
                  ),
                }
                : task,
            ),
          }
          : group,
      ),
    )
  }

  // サブタスク削除
  const deleteSubtask = (groupId: string, taskId: string, subtaskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
                }
                : task,
            ),
          }
          : group,
      ),
    )
  }

  // タスクの完了状態を切り替える
  const toggleTaskStatus = (groupId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          const updatedTasks = group.tasks.map((task) => {
            if (task.id === taskId) {
              const newStatus = task.status === "completed" ? "todo" : "completed"
              return {
                ...task,
                status: newStatus as "todo" | "in-progress" | "completed",
                progress: newStatus === "completed" ? 100 : 0,
                subtasks: task.subtasks.map((subtask) => ({
                  ...subtask,
                  completed: newStatus === "completed",
                })),
              }
            }
            return task
          })
          const sortedTasks = [...updatedTasks].sort((a, b) => {
            if (a.status === "completed" && b.status !== "completed") return 1
            if (a.status !== "completed" && b.status === "completed") return -1
            return 0
          })
          return { ...group, tasks: sortedTasks }
        }
        return group
      }),
    )
  }

  // 未定のタスクを今日のタスクに移動
  const moveToToday = (taskId: string) => {
    const unscheduledGroup = taskGroups.find((group) => group.id === "unscheduled")
    const todayGroup = taskGroups.find((group) => group.id === "today")
    if (!unscheduledGroup || !todayGroup) return
    const taskToMove = unscheduledGroup.tasks.find((task) => task.id === taskId)
    if (!taskToMove) return
    const now = new Date()
    const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    const updatedTask = { ...taskToMove, startTime, endTime }
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === "today") {
          return { ...group, tasks: [...group.tasks, updatedTask] }
        } else if (group.id === "unscheduled") {
          return { ...group, tasks: group.tasks.filter((task) => task.id !== taskId) }
        }
        return group
      }),
    )
  }

  // 今日のタスクを未定のタスクに移動
  const moveToUnscheduled = (taskId: string) => {
    const todayGroup = taskGroups.find((group) => group.id === "today")
    const unscheduledGroup = taskGroups.find((group) => group.id === "unscheduled")
    if (!todayGroup || !unscheduledGroup) return
    const taskToMove = todayGroup.tasks.find((task) => task.id === taskId)
    if (!taskToMove) return
    const { startTime, endTime, ...updatedTask } = taskToMove
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === "unscheduled") {
          return { ...group, tasks: [...group.tasks, updatedTask as Task] }
        } else if (group.id === "today") {
          return { ...group, tasks: group.tasks.filter((task) => task.id !== taskId) }
        }
        return group
      }),
    )
  }

  // サブタスクを追加
  const addSubtask = (groupId: string, taskId: string) => {
    const newSubtask: SubTask = {
      id: generateId('subtask'),
      title: "新しいサブタスク",
      completed: false,
    }
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === taskId ? { ...task, subtasks: [...task.subtasks, newSubtask] } : task,
            ),
          }
          : group,
      ),
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

                        {/* チェックボックス（ダッシュボードでは非表示だが、余白は確保） */}
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
                            className={group.completed ? "line-through text-gray-400" : ""}
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
                              onClick={() => deleteTask(group.id, group.tasks[0]?.id || "")}
                              title="タスクグループ削除"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            {/* 音声入力ボタンをコメントアウト
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => { }}
                              title="音声入力"
                            >
                              <Mic className={iconStyle} />
                            </Button>
                            */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => { }}
                              title="AI分解機能"
                            >
                              <SplitSquareVertical className={iconStyle} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => addTask(group.id)}
                              title="項目追加"
                            >
                              <Plus className={iconStyle} />
                            </Button>
                            {/* ダッシュボードに追加ボタンをコメントアウト
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => { }}
                              title="ダッシュボードに追加"
                            >
                              <Clock className={iconStyle} />
                            </Button>
                            */}

                            {/* 一時的に、更新ボタンをコメントアウト */}
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => sortTasksByDueDate(sortOrder === "asc" ? "desc" : "asc")}
                              title="更新"
                            >
                              <RefreshCw className={`h-4 w-4 ${sortOrder !== "none" ? "text-[#31A9B8]" : iconStyle}`} />
                            </Button> */}

                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="他メニュー">
                              <MoreHorizontal className={iconStyle} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    {group.expanded && (
                      <CardContent className="p-4">
                        <Droppable droppableId={group.id} type="task" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                          {(provided: any, snapshot: any) => (
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
                                  {(provided: any, snapshot: any) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                        zIndex: snapshot.isDragging ? 10 : 1,
                                        position: snapshot.isDragging ? "relative" : "static",
                                        pointerEvents: snapshot.isDragging ? "none" : "auto",
                                      }}
                                      className={snapshot.isDragging ? "" : ""}
                                    >
                                      <div
                                        className={`border rounded-md ${snapshot.isDragging ? "shadow-lg bg-gray-50" : ""}`}
                                      >
                                        {/* 中タスク */}
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
                                                  onClick={() => deleteTask(group.id, task.id)}
                                                  title="タスク削除"
                                                >
                                                  <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                                {/* 音声入力ボタンをコメントアウト
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() => { }}
                                                  title="音声入力"
                                                >
                                                  <Mic className={iconStyle} />
                                                </Button>
                                                */}
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() => { }}
                                                  title="AI分解機能"
                                                >
                                                  <SplitSquareVertical className={iconStyle} />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() => addSubtask(group.id, task.id)}
                                                  title="項目追加"
                                                >
                                                  <Plus className={iconStyle} />
                                                </Button>
                                                {/* ダッシュボードに追加ボタンをコメントアウト
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() => { }}
                                                  title="ダッシュボードに追加"
                                                >
                                                  <Clock className={iconStyle} />
                                                </Button>
                                                */}

                                                {/* 一時的に、更新ボタンをコメントアウト */}
                                                {/* <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() =>
                                                    sortTasksByDueDate(sortOrder === "asc" ? "desc" : "asc")
                                                  }
                                                  title="更新"
                                                >
                                                  <RefreshCw className={iconStyle} />
                                                </Button> */}


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
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  title="他メニュー"
                                                >
                                                  <MoreHorizontal className={iconStyle} />
                                                </Button>
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

                                              {group.id === "today" && (
                                                <div className="text-xs text-gray-500 min-w-[80px] text-right">
                                                  {task.startTime} - {task.endTime}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* 小タスク（サブタスク） */}
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
                                                      isOverdue={
                                                        !subtask.completed &&
                                                        task.status !== "completed" &&
                                                        isDateOverdue(task.dueDate)
                                                      }
                                                    />
                                                  </span>

                                                  {/* メニューアイコン - 常に領域を確保し、ホバー時のみ表示 */}
                                                  <div className="flex items-center gap-1 w-32 relative">
                                                    <div
                                                      className={`absolute right-0 flex items-center gap-1 transition-opacity ${hoveredSubtask &&
                                                        hoveredSubtask.groupId === group.id &&
                                                        hoveredSubtask.taskId === task.id &&
                                                        hoveredSubtask.subtaskId === subtask.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                        }`}
                                                    >
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => deleteSubtask(group.id, task.id, subtask.id)}
                                                        title="サブタスク削除"
                                                      >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                      </Button>
                                                      {/* 音声入力ボタンをコメントアウト
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => { }}
                                                        title="音声入力"
                                                      >
                                                        <Mic className={iconStyle} />
                                                      </Button>
                                                      */}
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        title="他メニュー"
                                                      >
                                                        <MoreHorizontal className={iconStyle} />
                                                      </Button>
                                                    </div>
                                                  </div>
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
              {/* <h2 className="text-lg font-semibold">AIコーチング</h2> */}
            </div>
            <AIChat />
          </div>
        </main>
      </div>
    </div>
  )
}
