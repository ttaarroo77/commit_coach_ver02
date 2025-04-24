import { useState } from "react"
import type { TaskGroup, Task, SubTask, TaskStatus, TaskPriority, PRIORITY_MAP } from "@/types/dashboard"
import { useDragAndDrop } from "./useDragAndDrop"

// 納期が過ぎているかチェックする関数
const isDateOverdue = (date?: string): boolean => {
  if (!date) return false
  const dueDate = new Date(date)
  const now = new Date()
  return dueDate < now
}

export function useTaskManagement(initialGroups: TaskGroup[]) {
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(initialGroups)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")

  // ドラッグ&ドロップのロジックを別フックに分離
  const { handleDragEnd } = useDragAndDrop({ taskGroups, setTaskGroups })

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

  // タスクの完了状態を切り替える
  const toggleTaskStatus = (groupId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          const updatedTasks = group.tasks.map((task) => {
            if (task.id === taskId) {
              const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed'
              return {
                ...task,
                status: newStatus,
                progress: newStatus === 'completed' ? 100 : 0,
                subtasks: task.subtasks.map((subtask) => ({
                  ...subtask,
                  completed: newStatus === 'completed',
                })),
              }
            }
            return task
          })

          const sortedTasks = [...updatedTasks].sort((a, b) => {
            if (a.status === 'completed' && b.status !== 'completed') return 1
            if (a.status !== 'completed' && b.status === 'completed') return -1
            return 0
          })

          return { ...group, tasks: sortedTasks }
        }
        return group
      }),
    )
  }

  // サブタスクの完了状態を切り替える
  const toggleSubtaskCompleted = (groupId: string, taskId: string, subtaskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          const updatedTasks = group.tasks.map((task) => {
            if (task.id === taskId) {
              const updatedSubtasks = task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
              )
              const progress = calculateProgress(updatedSubtasks)
              const newStatus: TaskStatus = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'todo'
              return {
                ...task,
                subtasks: updatedSubtasks,
                progress,
                status: newStatus,
              }
            }
            return task
          })
          return { ...group, tasks: updatedTasks }
        }
        return group
      }),
    )
  }

  // 進捗率を計算
  const calculateProgress = (subtasks: SubTask[]) => {
    if (subtasks.length === 0) return 0
    const completedCount = subtasks.filter((subtask) => subtask.completed).length
    return Math.round((completedCount / subtasks.length) * 100)
  }

  // 新しいタスクを追加
  const addTask = (groupId: string, taskTitle: string = "新しいタスク") => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      status: 'todo',
      projectId: 'default-project', // 必須フィールドにデフォルト値を設定
      priority: 'medium',          // デフォルト優先度
      progress: 0,
      subtasks: [],
      expanded: true,
      createdAt: new Date().toISOString(), // 必須フィールド
      updatedAt: new Date().toISOString()  // 必須フィールド
    }

    if (groupId === "today") {
      const now = new Date()
      const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      newTask.startTime = startTime
      newTask.endTime = endTime
    }

    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, tasks: [...group.tasks, newTask] } : group)),
    )
  }

  // 新しいサブタスクを追加
  const addSubtask = (groupId: string, taskId: string, subtaskTitle: string = "新しいサブタスク") => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: subtaskTitle,
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

  // グループタイトルを更新
  const updateGroupTitle = (groupId: string, newTitle: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, title: newTitle } : group)),
    )
  }

  // タスクを削除
  const deleteTask = (groupId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, tasks: group.tasks.filter((task) => task.id !== taskId) }
          : group
      ),
    )
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
                ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId) }
                : task
            ),
          }
          : group
      ),
    )
  }

  return {
    taskGroups,
    sortOrder,
    isDateOverdue,
    sortTasksByDueDate,
    toggleTaskGroup,
    toggleTask,
    updateTaskTitle,
    updateSubtaskTitle,
    updateGroupTitle,
    toggleTaskStatus,
    toggleSubtaskCompleted,
    addTask,
    addSubtask,
    deleteTask,
    deleteSubtask,
    handleDragEnd,
  }
} 