import { TaskGroup, Task } from "@/types/dashboard"
import { DropResult } from "react-beautiful-dnd"

// 配列内の要素を並び替える汎用関数
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

interface UseDragAndDropProps {
  taskGroups: TaskGroup[]
  setTaskGroups: React.Dispatch<React.SetStateAction<TaskGroup[]>>
}

export function useDragAndDrop({ taskGroups, setTaskGroups }: UseDragAndDropProps) {
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
        // 同じグループ内での並び替え
        const groupId = source.droppableId
        const group = taskGroups.find((g) => g.id === groupId)
        if (!group) return

        const reorderedTasks = reorder(group.tasks, source.index, destination.index)
        setTaskGroups((prevGroups) => prevGroups.map((g) => (g.id === groupId ? { ...g, tasks: reorderedTasks } : g)))
      } else {
        // 異なるグループ間での移動
        const sourceGroupId = source.droppableId
        const destGroupId = destination.droppableId

        const sourceGroup = taskGroups.find((g) => g.id === sourceGroupId)
        const destGroup = taskGroups.find((g) => g.id === destGroupId)

        if (!sourceGroup || !destGroup) return

        const taskToMove = { ...sourceGroup.tasks[source.index] }

        // 今日のタスクに移動する場合は開始・終了時間を設定
        if (destGroupId === "today" && !taskToMove.startTime) {
          const now = new Date()
          taskToMove.startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
          taskToMove.endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
        }

        // 未スケジュールタスクに移動する場合は時間情報を削除
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
    } else if (type === "subtask") {
      // サブタスクのドラッグ&ドロップ（将来的な拡張用）
      // ここにサブタスクのドラッグ&ドロップロジックを実装
    }
  }

  return {
    handleDragEnd,
  }
}
