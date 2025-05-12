"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
// @ts-ignore
import type { DropResult } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar } from "@/components/sidebar"
import { AIChat } from "@/components/ai-chat"
import { DatePicker } from "@/components/date-picker"
import {
  ChevronDown,
  ChevronRight,
  Mic,
  Clock,
  Plus,
  MoreHorizontal,
  SplitSquareVertical,
  Trash2,
  GripVertical,
  RefreshCw,
} from "lucide-react"
import { useDashboardTasks } from '@/hooks/useDashboardTasks';
import { v4 as uuidv4 } from 'uuid';

interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface Task {
  id: string
  title: string
  completed: boolean
  expanded: boolean
  subtasks: SubTask[]
  dueDate?: string // 納期（日付と時刻）
}

interface TaskGroup {
  id: string
  title: string
  expanded: boolean
  tasks: Task[]
  dueDate?: string // 納期（日付と時刻）
  completed: boolean
}

// ProjectTemplatePropsインターフェースを更新
interface ProjectTemplateProps {
  projectTitle: string
  taskGroups: TaskGroup[]
  dueDate?: string // プロジェクト全体の納期
  projectColor?: string // プロジェクトの色を追加
}

// EditableTextPropsインターフェースに isOverdue プロパティを追加
interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  prefix?: string
  isOverdue?: boolean
}

// EditableTextコンポーネントを更新して isOverdue プロパティを処理
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

// 納期表示コンポーネント
const DueDate = ({ date, className = "" }: { date?: string; className?: string }) => {
  if (!date) return null

  const dueDate = new Date(date)
  const now = new Date()
  const isOverdue = dueDate < now
  const isNearDue = !isOverdue && dueDate.getTime() - now.getTime() < 86400000 * 3 // 3日以内

  const formattedDate = dueDate.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })
  const formattedTime = dueDate.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className={`text-xs ${isOverdue ? "text-[#CF3721]" : isNearDue ? "text-[#F5BE41]" : "text-gray-500"}`}>
      <Clock className="h-4 w-4" />
      <span className="text-xs whitespace-nowrap">
        {formattedDate} {formattedTime}
      </span>
    </div>
  )
}

// 配列内の要素を並び替える汎用関数
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// ProjectTemplate関数の引数を更新
export default function ProjectTemplate({
  projectTitle: initialProjectTitle,
  taskGroups: initialTaskGroups,
  dueDate: initialDueDate,
  projectColor = "#31A9B8", // デフォルト色を設定
}: ProjectTemplateProps) {
  const {
    tasks: dashboardTasks,
    isLoading,
    error,
    addTask: addDashboardTask,
    updateTask: updateDashboardTask,
    deleteTask: deleteDashboardTask,
    reorderTasks
  } = useDashboardTasks();

  // 既存のコードの中で、ProjectTemplate関数の先頭付近に以下の状態変数を追加
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")

  const [projectTitle, setProjectTitle] = useState(initialProjectTitle)
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(
    initialTaskGroups.map((group) => ({
      ...group,
      completed: group.completed || false,
      tasks: group.tasks.map((task) => ({
        ...task,
        completed: task.completed || false,
      })),
    })),
  )
  const [projectDueDate, setProjectDueDate] = useState(initialDueDate || "")
  const [projectCompleted, setProjectCompleted] = useState(false)

  // ホバー状態を管理する状態変数
  const [hoveredProject, setHoveredProject] = useState(false)
  // 削除確認モーダルの状態
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const [hoveredTask, setHoveredTask] = useState<{ groupId: string; taskId: string } | null>(null)
  const [hoveredSubtask, setHoveredSubtask] = useState<{ groupId: string; taskId: string; subtaskId: string } | null>(
    null,
  )

  // IDを生成する関数（クライアントサイドのみで実行）
  const generateId = (prefix: string) => {
    return `${prefix}-${uuidv4()}`;
  };

  // プロジェクト全体の完了状態を更新
  useEffect(() => {
    const allGroupsCompleted = taskGroups.length > 0 && taskGroups.every((group) => group.completed)
    setProjectCompleted(allGroupsCompleted)
  }, [taskGroups])

  // タスクを期限順にソートする
  const sortTasksByDueDate = (order: "asc" | "desc" | "none") => {
    setSortOrder(order)

    if (order === "none") return

    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        // タスクを期限でソート
        const sortedTasks = [...group.tasks].sort((a, b) => {
          // 完了したタスクは常に下部に
          if (a.completed && !b.completed) return 1
          if (!a.completed && b.completed) return -1

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
      }),
    )
  }

  // タスクグループの完了状態を更新
  const updateTaskGroupCompletionStatus = (groupId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          const allTasksCompleted = group.tasks.length > 0 && group.tasks.every((task) => task.completed)
          return { ...group, completed: allTasksCompleted }
        }
        return group
      }),
    )
  }

  // タスクの完了状態を更新（サブタスクの状態に基づく）
  const updateTaskCompletionStatus = (groupId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          const updatedTasks = group.tasks.map((task) => {
            if (task.id === taskId) {
              const allSubtasksCompleted =
                task.subtasks.length > 0 && task.subtasks.every((subtask) => subtask.completed)
              return { ...task, completed: allSubtasksCompleted }
            }
            return task
          })
          return { ...group, tasks: updatedTasks }
        }
        return group
      }),
    )

    // タスクグループの状態も更新
    updateTaskGroupCompletionStatus(groupId)
  }

  // ドラッグ&ドロップの処理
  // @ts-ignore
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

    // タスクグループの並び替え
    if (type === "taskGroup") {
      const reorderedGroups = reorder(taskGroups, source.index, destination.index)
      setTaskGroups(reorderedGroups)
      return
    }

    // タスクの並び替え
    if (type === "task") {
      // 同じグループ内でのタスクの並び替え
      if (source.droppableId === destination.droppableId) {
        const groupId = source.droppableId
        const group = taskGroups.find((g) => g.id === groupId)
        if (!group) return

        const reorderedTasks = reorder(group.tasks, source.index, destination.index)

        setTaskGroups((prevGroups) => prevGroups.map((g) => (g.id === groupId ? { ...g, tasks: reorderedTasks } : g)))
      } else {
        // 異なるグループ間でのタスクの移動
        const sourceGroupId = source.droppableId
        const destGroupId = destination.droppableId

        const sourceGroup = taskGroups.find((g) => g.id === sourceGroupId)
        const destGroup = taskGroups.find((g) => g.id === destGroupId)

        if (!sourceGroup || !destGroup) return

        // 移動するタスクを取得
        const [movedTask] = sourceGroup.tasks.splice(source.index, 1)

        // 移動先グループにタスクを追加
        destGroup.tasks.splice(destination.index, 0, movedTask)

        setTaskGroups([...taskGroups])

        // 移動後にタスクグループの完了状態を更新
        updateTaskGroupCompletionStatus(sourceGroupId)
        updateTaskGroupCompletionStatus(destGroupId)
      }
    }
  }

  // タスクグループの展開/折りたたみを切り替える
  const toggleTaskGroup = (groupId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, expanded: !group.expanded } : group)),
    )
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

  // プロジェクト全体の完了状態を切り替える
  const toggleProjectCompleted = () => {
    const newCompletedState = !projectCompleted
    setProjectCompleted(newCompletedState)

    // すべてのタスクグループとタスクの完了状態も同期
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        completed: newCompletedState,
        tasks: group.tasks.map((task) => ({
          ...task,
          completed: newCompletedState,
          subtasks: task.subtasks.map((subtask) => ({
            ...subtask,
            completed: newCompletedState,
          })),
        })),
      })),
    )
  }

  // タスクグループの完了状態を切り替える関数を修正
  const toggleTaskGroupCompleted = (groupId: string) => {
    setTaskGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((group) => {
        if (group.id === groupId) {
          const newCompletedState = !group.completed
          return {
            ...group,
            completed: newCompletedState,
            tasks: group.tasks.map((task) => ({
              ...task,
              completed: newCompletedState,
              subtasks: task.subtasks.map((subtask) => ({
                ...subtask,
                completed: newCompletedState,
              })),
            })),
          }
        }
        return group
      })

      // 完了したタスクグループを下部に移動
      return [...updatedGroups].sort((a, b) => {
        if (a.completed && !b.completed) return 1
        if (!a.completed && b.completed) return -1
        return 0
      })
    })

    // 現在のソート順が設定されている場合は再適用
    if (sortOrder !== "none") {
      setTimeout(() => sortTasksByDueDate(sortOrder), 0)
    }
  }

  // タスクの完了状態を切り替える関数を修正
  const toggleTaskCompleted = (groupId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          // タスクの完了状態を切り替え
          const updatedTasks = group.tasks.map((task) => {
            if (task.id === taskId) {
              const newCompletedState = !task.completed
              return {
                ...task,
                completed: newCompletedState,
                // サブタスクも同期して更新
                subtasks: task.subtasks.map((subtask) => ({
                  ...subtask,
                  completed: newCompletedState,
                })),
              }
            }
            return task
          })

          // 完了したタスクを下部に移動
          const sortedTasks = [...updatedTasks].sort((a, b) => {
            if (a.completed && !b.completed) return 1
            if (!a.completed && b.completed) return -1
            return 0
          })

          return { ...group, tasks: sortedTasks }
        }
        return group
      }),
    )

    // タスクグループの状態も更新
    updateTaskGroupCompletionStatus(groupId)

    // 現在のソート順が設定されている場合は再適用
    if (sortOrder !== "none") {
      setTimeout(() => sortTasksByDueDate(sortOrder), 0)
    }
  }

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

    // サブタスクの変更後にタスクとタスクグループの状態を更新
    setTimeout(() => {
      updateTaskCompletionStatus(groupId, taskId)
    }, 0)
  }

  // プロジェクトタイトルを更新
  const updateProjectTitle = (newTitle: string) => {
    setProjectTitle(newTitle)
  }

  // プロジェクト納期を更新
  const updateProjectDueDate = (newDueDate: string) => {
    setProjectDueDate(newDueDate)
  }

  // タスクグループタイトルを更新
  const updateTaskGroupTitle = (groupId: string, newTitle: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, title: newTitle } : group)),
    )
  }

  // タスクグループ納期を更新
  const updateTaskGroupDueDate = (groupId: string, newDueDate: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, dueDate: newDueDate } : group)),
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

  // タスク納期を更新
  const updateTaskDueDate = (groupId: string, taskId: string, newDueDate: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.map((task) => (task.id === taskId ? { ...task, dueDate: newDueDate } : task)),
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

  // タスクグループを削除
  const deleteTaskGroup = (groupId: string) => {
    setTaskGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId))
  }

  // タスクを削除
  const deleteTask = (groupId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            tasks: group.tasks.filter((task) => task.id !== taskId),
          }
          : group,
      ),
    )

    // タスク削除後にタスクグループの完了状態を更新
    updateTaskGroupCompletionStatus(groupId)
  }

  // サブタスクを削除
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

    // サブタスク削除後にタスクとタスクグループの完了状態を更新
    updateTaskCompletionStatus(groupId, taskId)
  }

  // 新しいタスクグループを追加
  const addTaskGroup = () => {
    const newTaskGroup: TaskGroup = {
      id: generateId('group'),
      title: "新しいタスクグループ",
      expanded: true,
      tasks: [],
      dueDate: "", // デフォルトは空
      completed: false,
    }

    setTaskGroups((prevGroups) => [...prevGroups, newTaskGroup])
  }

  // 新しい中タスクを追加
  const addTask = (groupId: string) => {
    const newTask: Task = {
      id: generateId('task'),
      title: "新しいタスク",
      completed: false,
      expanded: true,
      subtasks: [],
      dueDate: "", // デフォルトは空
    }

    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, tasks: [...group.tasks, newTask] } : group)),
    )

    // タスク追加後にタスクグループの完了状態を更新
    updateTaskGroupCompletionStatus(groupId)
  }

  // 新しい小タスクを追加
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

    // サブタスク追加後にタスクとタスクグループの完了状態を更新
    updateTaskCompletionStatus(groupId, taskId)
  }

  // スケジュール追加関数を更新
  const addToSchedule = async (groupId: string, taskId: string) => {
    const taskGroup = taskGroups.find(group => group.id === groupId);
    const task = taskGroup?.tasks.find(t => t.id === taskId);

    if (!task || !taskGroup) return;

    try {
      await addDashboardTask({
        title: task.title,
        description: task.title,
        status: 'pending',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(), // 1時間後
        projectId: groupId,
        projectName: taskGroup.title,
        priority: 'medium',
      });
    } catch (err) {
      console.error('タスクの追加に失敗しました:', err);
    }
  };

  const addSubtaskToSchedule = async (groupId: string, taskId: string, subtaskId: string) => {
    const taskGroup = taskGroups.find(group => group.id === groupId);
    const task = taskGroup?.tasks.find(t => t.id === taskId);
    const subtask = task?.subtasks.find(s => s.id === subtaskId);

    if (!subtask || !task || !taskGroup) return;

    try {
      await addDashboardTask({
        title: subtask.title,
        description: `${task.title} - ${subtask.title}`,
        status: 'pending',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(), // 1時間後
        projectId: groupId,
        projectName: taskGroup.title,
        priority: 'medium',
      });
    } catch (err) {
      console.error('サブタスクの追加に失敗しました:', err);
    }
  };

  const addProjectToSchedule = async () => {
    try {
      await addDashboardTask({
        title: projectTitle,
        description: 'プロジェクト全体',
        status: 'pending',
        startTime: new Date().toISOString(),
        endTime: projectDueDate || new Date(Date.now() + 86400000).toISOString(), // 納期または1日後
        projectId: 'project',
        projectName: projectTitle,
        priority: 'high',
      });
    } catch (err) {
      console.error('プロジェクトの追加に失敗しました:', err);
    }
  };

  const addTaskGroupToSchedule = async (groupId: string) => {
    const taskGroup = taskGroups.find(group => group.id === groupId);

    if (!taskGroup) return;

    try {
      await addDashboardTask({
        title: taskGroup.title,
        description: 'タスクグループ全体',
        status: 'pending',
        startTime: new Date().toISOString(),
        endTime: taskGroup.dueDate || new Date(Date.now() + 86400000).toISOString(), // 納期または1日後
        projectId: groupId,
        projectName: taskGroup.title,
        priority: 'medium',
      });
    } catch (err) {
      console.error('タスクグループの追加に失敗しました:', err);
    }
  };

  // 音声機能を一時的にコメントアウト
  // 音声入力を開始
  // const startVoiceInput = () => {
  //   // 実際の実装では、ここで音声入力APIを呼び出す
  //   alert("音声入力を開始します")
  // }

  // タスクを分解
  const decomposeTask = (groupId: string, taskId: string) => {
    // 実際の実装では、ここでAIを使ってタスクを分解するロジックを実装
    alert("AIによるタスク分解を開始します")
  }

  // 音声機能を一時的にコメントアウト
  // プロジェクトレベルの音声入力
  // const startProjectVoiceInput = () => {
  //   alert(`プロジェクト「${projectTitle}」の音声入力を開始します`)
  // }

  // プロジェクトレベルのタスク分解
  const decomposeProject = () => {
    alert(`プロジェクト「${projectTitle}」をAIで分解します`)
  }

  // プロジェクトを削除
  const deleteProject = () => {
    // 確認ダイアログを表示
    setShowDeleteConfirm(true)
  }

  // プロジェクト削除の確認
  const confirmDeleteProject = () => {
    // URLからプロジェクトIDを取得
    const path = window.location.pathname
    const projectId = path.split("/projects/")[1]

    if (projectId) {
      // カスタムイベントを発行してサイドバーに通知 - 連携サービス部分をコメントアウト
      /*
      const event = new CustomEvent("projectDeleted", {
        detail: { projectId },
      })
      window.dispatchEvent(event)
      */

      // 確認ダイアログを閉じる
      setShowDeleteConfirm(false)

      // 削除後はダッシュボードに戻る
      window.location.href = "/dashboard"
    } else {
      alert("プロジェクトIDが特定できませんでした。")
      setShowDeleteConfirm(false)
    }
  }

  // 削除確認をキャンセル
  const cancelDeleteProject = () => {
    setShowDeleteConfirm(false)
  }

  // 音声機能を一時的にコメントアウト
  // タスクグループレベルの音声入力
  // const startGroupVoiceInput = (groupId: string) => {
  //   const group = taskGroups.find((g) => g.id === groupId)
  //   alert(`タスクグループ「${group?.title}」の音声入力を開始します`)
  // }

  // タスクグループレベルのタスク分解
  const decomposeGroup = (groupId: string) => {
    const group = taskGroups.find((g) => g.id === groupId)
    alert(`タスクグループ「${group?.title}」をAIで分解します`)
  }

  // 共通のアイコンスタイル
  const iconStyle = "h-4 w-4 text-gray-300"

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto p-6">
              <div
                className="mb-6 flex items-center justify-between"
                onMouseEnter={() => setHoveredProject(true)}
                onMouseLeave={() => setHoveredProject(false)}
              >
                <div className="flex items-center flex-1 gap-4">
                  {/* 展開/折りたたみボタン - プロジェクトレベルでは非表示 */}
                  <div className="w-6"></div>

                  {/* プロジェクトレベルのチェックボックス */}
                  <Checkbox checked={projectCompleted} onCheckedChange={toggleProjectCompleted} />

                  {/* プロジェクトタイトル */}
                  <h1 className="text-2xl font-bold flex-1">
                    <EditableText
                      value={projectTitle}
                      onChange={updateProjectTitle}
                      prefix="# "
                      className={`${projectCompleted ? "line-through text-gray-400" : ""}`}
                      isOverdue={!projectCompleted && isDateOverdue(projectDueDate)}
                    />
                  </h1>

                  {/* メニューアイコン - 常に領域を確保し、ホバー時のみ表示 */}
                  <div className="flex items-center gap-1 w-48 relative">
                    <div
                      className={`absolute right-0 flex items-center gap-1 transition-opacity ${hoveredProject ? "opacity-100" : "opacity-0"}`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => deleteProject()}
                        title="プロジェクト削除"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>

                      {/* // 音声機能を一時的にコメントアウト */}
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={startProjectVoiceInput}
                        title="音声入力"
                      >
                        <Mic className={iconStyle} />
                      </Button> */}


                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={decomposeProject}
                        title="AI分解機能"
                      >
                        <SplitSquareVertical className={iconStyle} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => addProjectToSchedule()}
                        title="項目追加"
                      >
                        <Plus className={iconStyle} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => addProjectToSchedule()}
                        title="ダッシュボードに追加"
                      >
                        <Clock className={iconStyle} />
                      </Button>

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

                  {/* 納期入力 - 常に右端に固定 */}
                  <div className="flex items-center min-w-[200px]">
                    <DatePicker value={projectDueDate} onChange={updateProjectDueDate} />
                  </div>
                </div>
              </div>

              {/* タスクグループのリスト - ドラッグ&ドロップコンテキスト */}
              <DragDropContext onDragEnd={handleDragEnd}>
                {/* @ts-ignore */}
                <Droppable droppableId="taskGroups" type="taskGroup" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                  {/* @ts-ignore */}
                  {(provided, snapshot) => (
                    <div
                      className={`space-y-6 relative ${snapshot.isDraggingOver ? "bg-gray-50/50 rounded-lg" : ""}`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        minHeight: snapshot.isDraggingOver ? "200px" : "auto",
                      }}
                    >
                      {taskGroups.map((group, groupIndex) => (
                        <Draggable key={group.id} draggableId={group.id} index={groupIndex}>
                          {/* @ts-ignore */}
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style,
                                // ドラッグ中のアイテムのスタイルを調整
                                opacity: snapshot.isDragging ? 0.8 : 1,
                                zIndex: snapshot.isDragging ? 10 : 1,
                                position: snapshot.isDragging ? "relative" : "static",
                                pointerEvents: snapshot.isDragging ? "none" : "auto",
                              }}
                            >
                              <Card className={`overflow-hidden ${snapshot.isDragging ? "shadow-lg" : ""}`}>
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
                                      {group.expanded ? (
                                        <ChevronDown className="h-5 w-5" />
                                      ) : (
                                        <ChevronRight className="h-5 w-5" />
                                      )}
                                    </Button>

                                    {/* ドラッグハンドル */}
                                    <div {...provided.dragHandleProps} className="cursor-grab">
                                      <GripVertical className="h-5 w-5 text-gray-400" />
                                    </div>

                                    {/* チェックボックス */}
                                    <Checkbox
                                      checked={group.completed}
                                      onCheckedChange={() => toggleTaskGroupCompleted(group.id)}
                                    />

                                    {/* タスクグループタイトル */}
                                    <CardTitle className="text-lg font-bold flex-1">
                                      <EditableText
                                        value={group.title}
                                        onChange={(newTitle) => updateTaskGroupTitle(group.id, newTitle)}
                                        prefix="## "
                                        className={group.completed ? "line-through text-gray-400" : ""}
                                        isOverdue={!group.completed && isDateOverdue(group.dueDate)}
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
                                          onClick={() => deleteTaskGroup(group.id)}
                                          title="タスクグループ削除"
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>

                                        {/* // 音声機能を一時的にコメントアウト */}
                                        {/* <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => startGroupVoiceInput(group.id)}
                                          title="音声入力"
                                        >
                                          <Mic className={iconStyle} />
                                        </Button> */}


                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => decomposeGroup(group.id)}
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
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => addTaskGroupToSchedule(group.id)}
                                          title="ダッシュボードに追加"
                                        >
                                          <Clock className={iconStyle} />
                                        </Button>

                                        {/* 一時的に、更新ボタンをコメントアウト */}
                                        {/* <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => sortTasksByDueDate(sortOrder === "asc" ? "desc" : "asc")}
                                          title="更新"
                                        >
                                          <RefreshCw
                                            className={`h-4 w-4 ${sortOrder !== "none" ? "text-[#31A9B8]" : iconStyle}`}
                                          />
                                        </Button> */}

                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="他メニュー">
                                          <MoreHorizontal className={iconStyle} />
                                        </Button>
                                      </div>
                                    </div>

                                    {/* 納期表示 - 常に右端に固定 */}
                                    <div className="flex items-center min-w-[200px]">
                                      <DatePicker
                                        value={group.dueDate || ""}
                                        onChange={(newDate) => updateTaskGroupDueDate(group.id, newDate)}
                                      />
                                    </div>
                                  </div>
                                </CardHeader>

                                {group.expanded && (
                                  <CardContent className="p-4">
                                    {/* @ts-ignore */}
                                    <Droppable droppableId={group.id} type="task" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                                      {/* @ts-ignore */}
                                      {(provided, snapshot) => (
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
                                              {/* @ts-ignore */}
                                              {(provided, snapshot) => (
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
                                                      onMouseEnter={() =>
                                                        setHoveredTask({ groupId: group.id, taskId: task.id })
                                                      }
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
                                                          checked={task.completed}
                                                          onCheckedChange={() => toggleTaskCompleted(group.id, task.id)}
                                                        />

                                                        {/* タスクタイトル */}
                                                        <span
                                                          className={`flex-1 ${task.completed ? "line-through text-gray-400" : ""}`}
                                                        >
                                                          <EditableText
                                                            value={task.title}
                                                            onChange={(newTitle) =>
                                                              updateTaskTitle(group.id, task.id, newTitle)
                                                            }
                                                            prefix="### "
                                                            className={
                                                              task.completed ? "line-through text-gray-400" : ""
                                                            }
                                                            isOverdue={!task.completed && isDateOverdue(task.dueDate)}
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

                                                            {/* // 音声機能を一時的にコメントアウト */}
                                                            {/* <Button
                                                              variant="ghost"
                                                              size="sm"
                                                              className="h-8 w-8 p-0"
                                                              onClick={() => startVoiceInput()}
                                                              title="音声入力"
                                                            >
                                                              <Mic className={iconStyle} />
                                                            </Button> */}

                                                            <Button
                                                              variant="ghost"
                                                              size="sm"
                                                              className="h-8 w-8 p-0"
                                                              onClick={() => decomposeTask(group.id, task.id)}
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
                                                            <Button
                                                              variant="ghost"
                                                              size="sm"
                                                              className="h-8 w-8 p-0"
                                                              onClick={() => addToSchedule(group.id, task.id)}
                                                              title="ダッシュボードに追加"
                                                            >
                                                              <Clock className={iconStyle} />
                                                            </Button>

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

                                                        {/* 納期表示 - 常に右端に固定 */}
                                                        <div className="flex items-center min-w-[200px]">
                                                          <DatePicker
                                                            value={task.dueDate || ""}
                                                            onChange={(newDate) =>
                                                              updateTaskDueDate(group.id, task.id, newDate)
                                                            }
                                                          />
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
                                                                    updateSubtaskTitle(
                                                                      group.id,
                                                                      task.id,
                                                                      subtask.id,
                                                                      newTitle,
                                                                    )
                                                                  }
                                                                  className={
                                                                    subtask.completed
                                                                      ? "line-through text-gray-400"
                                                                      : ""
                                                                  }
                                                                  isOverdue={
                                                                    !subtask.completed && isDateOverdue(task.dueDate)
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
                                                                    onClick={() =>
                                                                      deleteSubtask(group.id, task.id, subtask.id)
                                                                    }
                                                                    title="サブタスク削除"
                                                                  >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                  </Button>


                                                                  {/* 一時的に、更新ボタンをコメントアウト */}
                                                                  {/* <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    onClick={() => startVoiceInput()}
                                                                    title="音声入力"
                                                                  >
                                                                    <Mic className={iconStyle} />
                                                                  </Button> */}

                                                                  <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    onClick={() =>
                                                                      addSubtaskToSchedule(
                                                                        group.id,
                                                                        task.id,
                                                                        subtask.id,
                                                                      )
                                                                    }
                                                                    title="ダッシュボードに追加"
                                                                  >
                                                                    <Clock className={iconStyle} />
                                                                  </Button>
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
                                        </div>
                                      )}
                                    </Droppable>
                                  </CardContent>
                                )}
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {taskGroups.length === 0 && (
                        <div className="flex justify-center my-8">
                          <Button
                            variant="outline"
                            className="border-dashed text-gray-400 hover:text-gray-600"
                            onClick={addTaskGroup}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            最初のタスクグループを追加
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>

                {taskGroups.length > 0 && (
                  <div className="flex justify-center my-4">
                    <Button
                      variant="outline"
                      className="border-dashed text-gray-400 hover:text-gray-600"
                      onClick={addTaskGroup}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      新しいタスクグループを追加
                    </Button>
                  </div>
                )}
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

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">プロジェクトの削除</h3>
            <p className="mb-6">
              プロジェクト「{projectTitle}」を削除します。この操作は取り消せません。
              サイドバーからもこのプロジェクトが削除されます。
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelDeleteProject}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={confirmDeleteProject}>
                削除する
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
