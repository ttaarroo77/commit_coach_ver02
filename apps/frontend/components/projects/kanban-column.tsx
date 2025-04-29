import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Task } from "@/types"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  children: React.ReactNode
}

export function KanbanColumn({ id, title, tasks, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <Card className="flex flex-col h-full min-w-[300px] bg-background">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {tasks.length} タスク
        </p>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-4 space-y-4 overflow-y-auto",
          isOver && "bg-accent/50"
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </Card>
  )
} 