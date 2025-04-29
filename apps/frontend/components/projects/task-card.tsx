import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Task } from "@/types"
import { CalendarIcon, UserIcon } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const priorityColors = {
    high: "destructive",
    medium: "warning",
    low: "default"
  } as const

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`task-${task.id}`}
      className="p-4 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium">{task.title}</h3>
        <Badge variant={priorityColors[task.priority]}>
          {task.priority}
        </Badge>
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        {task.description && (
          <p className="line-clamp-2 mb-2">{task.description}</p>
        )}

        <div className="flex items-center gap-4">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {format(new Date(task.dueDate), "M/d", { locale: ja })}
              </span>
            </div>
          )}

          {task.assignee && (
            <div className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 