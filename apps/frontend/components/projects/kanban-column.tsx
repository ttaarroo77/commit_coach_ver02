import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { memo } from "react"
import { Task } from "../../types/task"
import { cn } from "../../lib/utils"
import { Card } from "../../components/ui/card"

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  children: React.ReactNode
}

function KanbanColumnComponent({ id, title, tasks, children }: KanbanColumnProps) {
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

// カンバン列をメモ化して不要な再レンダリングを防止
export const KanbanColumn = memo(KanbanColumnComponent, (prevProps, nextProps) => {
  // IDとタイトルが同じで、タスク数が同じ場合は再レンダリングしない
  if (prevProps.id !== nextProps.id || prevProps.title !== nextProps.title) {
    return false;
  }
  
  // タスク数が異なる場合は再レンダリング
  if (prevProps.tasks.length !== nextProps.tasks.length) {
    return false;
  }
  
  // タスクIDの配列を比較
  const prevIds = prevProps.tasks.map(t => t.id).sort();
  const nextIds = nextProps.tasks.map(t => t.id).sort();
  
  return prevIds.every((id, index) => id === nextIds[index]);
});