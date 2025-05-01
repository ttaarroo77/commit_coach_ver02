import { useState, memo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Task, TaskPriority } from "../../types/task"
import { CalendarIcon, GripVertical, UserIcon } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { TaskDetailModal } from "./task-detail-modal"
import { cn } from "../../lib/utils"

interface TaskCardProps {
  task: Task
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void
  isDragging?: boolean
}

function TaskCardComponent({ task, onUpdateTask, isDragging: externalIsDragging }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease',
    opacity: isDragging || externalIsDragging ? 0.5 : 1,
    zIndex: isDragging || externalIsDragging ? 10 : 1
  }

  // 優先度に応じたバッジのスタイルを定義
  const priorityColors = {
    high: "destructive",
    medium: "warning",
    low: "default"
  } as const

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        data-testid={`task-${task.id}`}
        className={cn(
          "p-4 hover:shadow-md transition-all cursor-pointer",
          isDragging || externalIsDragging 
            ? "shadow-lg ring-2 ring-primary/20 bg-primary/5" 
            : "hover:translate-y-[-2px] hover:bg-accent/50"
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <h3 className="font-medium">{task.title}</h3>
          </div>
          <Badge variant={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>

        <div className="mt-2 text-sm text-muted-foreground">
          {task.description && (
            <p className="line-clamp-2 mb-2">{task.description}</p>
          )}

          <div className="flex items-center gap-4">
            {task.due_date && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {format(new Date(task.due_date), "M/d", { locale: ja })}
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

      <TaskDetailModal
        task={{
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.due_date || null,
          completed: task.status === 'completed',
          subtasks: task.subtasks
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onUpdateTask || (() => {})}
        onDelete={() => console.log('Delete task:', task.id)}
      />
    </>
  )
}

// タスクカードをメモ化して不要な再レンダリングを防止
export const TaskCard = memo(TaskCardComponent, (prevProps, nextProps) => {
  // タスクのIDが同じで、内容が変わっていない場合は再レンダリングしない
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.due_date === nextProps.task.due_date &&
    prevProps.isDragging === nextProps.isDragging
  );
});