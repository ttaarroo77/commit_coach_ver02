"use client"

import { DragDropContext, DroppableProps, DropResult } from "react-beautiful-dnd"
import { TaskGroup } from "./TaskGroup"
import type { TaskGroup as TaskGroupType } from "@/types/dashboard"

interface TaskGroupListProps {
  taskGroups: TaskGroupType[]
  sortOrder: "asc" | "desc" | "none"
  onDragEnd: (result: DropResult) => void
  onToggleGroup: (groupId: string) => void
  onDeleteTask: (groupId: string, taskId: string) => void
  onAddTask: (groupId: string, taskTitle?: string) => void
  onUpdateGroupTitle: (groupId: string, newTitle: string) => void
  onSortTasks: (order: "asc" | "desc" | "none") => void
}

export function TaskGroupList({
  taskGroups,
  sortOrder,
  onDragEnd,
  onToggleGroup,
  onDeleteTask,
  onAddTask,
  onUpdateGroupTitle,
  onSortTasks,
}: TaskGroupListProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-6">
        {taskGroups.map((group) => (
          <TaskGroup
            key={group.id}
            group={group}
            onToggleGroup={onToggleGroup}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
            onUpdateGroupTitle={onUpdateGroupTitle}
            onSortTasks={onSortTasks}
            sortOrder={sortOrder}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
