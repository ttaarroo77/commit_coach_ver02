import { useState } from "react"
import type { TaskGroup, Task, SubTask } from "@/types/dashboard"
import type { DropResult } from "react-beautiful-dnd"

// 配列内の要素を並び替える汎用関数
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

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
              const newStatus = task.status === "completed" ? "todo" : "completed"
              return {
                ...task,
                status: newStatus,
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
                  progress: calculateProgress(
                    task.subtasks.map((subtask) =>
                      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
                    ),
                  ),
                }
                : task,
            ),
          }
          : group,
      ),
    )
  }

  // 進捗率を計算
  const calculateProgress = (subtasks: SubTask[]) => {
    if (subtasks.length === 0) return 0
    const completedCount = subtasks.filter((subtask) => subtask.completed).length
    return Math.round((completedCount / subtasks.length) * 100)
  }

  // 新しいタスクを追加
  const addTask = (groupId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "新しいタスク",
      status: "todo",
      progress: 0,
      subtasks: [],
      expanded: true,
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
  const addSubtask = (groupId: string, taskId: string) => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
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
  }

  // ドラッグ&ドロップの処理
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

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
              tasks: group.tasks.filter((_, index) => index !== source.index),
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

  return {
    taskGroups,
    sortOrder,
    isDateOverdue,
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
  }
} 