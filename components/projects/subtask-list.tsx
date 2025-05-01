import { useState } from "react"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Subtask {
  id: string
  title: string
  completed: boolean
}

interface SubtaskListProps {
  subtasks: Subtask[]
  onUpdate: (subtasks: Subtask[]) => void
  onAdd?: (title: string) => void
  className?: string
}

export function SubtaskList({
  subtasks,
  onUpdate,
  onAdd,
  className
}: SubtaskListProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const completedCount = subtasks.filter(st => st.completed).length

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    onUpdate(updatedSubtasks)
  }

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim() && onAdd) {
      onAdd(newSubtaskTitle.trim())
      setNewSubtaskTitle("")
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-transparent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1" />
          )}
          <span className="font-medium">サブタスク</span>
          <span className="ml-2 text-sm text-muted-foreground">
            ({completedCount}/{subtasks.length})
          </span>
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-2 pl-6">
          {subtasks.map(subtask => (
            <div
              key={subtask.id}
              className="flex items-center gap-2 group"
            >
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleToggleSubtask(subtask.id)}
                className="rounded border-input"
                aria-label={`サブタスク「${subtask.title}」の完了状態`}
              />
              <span
                className={cn(
                  "text-sm",
                  subtask.completed && "line-through text-muted-foreground"
                )}
              >
                {subtask.title}
              </span>
            </div>
          ))}

          {onAdd && (
            <div className="flex items-center gap-2">
              <Input
                size="sm"
                placeholder="新しいサブタスク"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddSubtask()
                  }
                }}
                className="h-8 text-sm"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleAddSubtask}
                disabled={!newSubtaskTitle.trim()}
                className="h-8 w-8"
                aria-label="サブタスクを追加"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 