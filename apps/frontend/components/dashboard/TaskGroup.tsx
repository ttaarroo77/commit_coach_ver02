import { useState } from "react"
import { Droppable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Trash2,
  Mic,
  SplitSquareVertical,
  Clock,
  RefreshCw,
} from "lucide-react"
import { TaskCard } from "./TaskCard"
import { EditableText } from "./EditableText"
import type { TaskGroup } from "@/types/dashboard"

interface TaskGroupProps {
  group: TaskGroup
  onToggleGroup: (groupId: string) => void
  onDeleteTask: (groupId: string, taskId: string) => void
  onAddTask: (groupId: string) => void
  onUpdateGroupTitle: (groupId: string, newTitle: string) => void
  onSortTasks: (order: "asc" | "desc" | "none") => void
  sortOrder: "asc" | "desc" | "none"
}

export function TaskGroup({
  group,
  onToggleGroup,
  onDeleteTask,
  onAddTask,
  onUpdateGroupTitle,
  onSortTasks,
  sortOrder,
}: TaskGroupProps) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const iconStyle = "h-4 w-4 text-gray-300"

  return (
    <Card key={group.id} className="overflow-hidden">
      <CardHeader
        className="p-4 bg-gray-50"
        onMouseEnter={() => setHoveredGroup(group.id)}
        onMouseLeave={() => setHoveredGroup(null)}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={() => onToggleGroup(group.id)}
          >
            {group.expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>

          <div className="w-6"></div>
          <div className="w-6"></div>

          <CardTitle className="text-lg font-bold flex-1">
            <EditableText
              value={group.title}
              onChange={(newTitle) => onUpdateGroupTitle(group.id, newTitle)}
              prefix="## "
              className={group.completed ? "line-through text-gray-400" : ""}
            />
          </CardTitle>

          <div className="flex items-center gap-1 w-48 relative">
            <div
              className={`absolute right-0 flex items-center gap-1 transition-opacity ${hoveredGroup === group.id ? "opacity-100" : "opacity-0"
                }`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onDeleteTask(group.id, group.tasks[0]?.id || "")}
                title="タスクグループ削除"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { }} title="音声入力">
                <Mic className={iconStyle} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { }} title="AI分解機能">
                <SplitSquareVertical className={iconStyle} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onAddTask(group.id)}
                title="項目追加"
              >
                <Plus className={iconStyle} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { }} title="ダッシュボードに追加">
                <Clock className={iconStyle} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onSortTasks(sortOrder === "asc" ? "desc" : "asc")}
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
          <Droppable droppableId={group.id} type="task" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-4 relative ${snapshot.isDraggingOver ? "bg-gray-50/50 rounded-lg p-2" : ""}`}
              >
                {group.tasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} groupId={group.id} />
                ))}
                {provided.placeholder}
                {group.tasks.length === 0 && (
                  <div className="flex justify-center my-4">
                    <Button
                      variant="outline"
                      className="border-dashed text-gray-400 hover:text-gray-600"
                      onClick={() => onAddTask(group.id)}
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
  )
} 