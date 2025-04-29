import { useState } from "react"
import { SubtaskList } from "./subtask-list"
import { TaskStatus } from "./task-status"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Pencil, X, Check, Trash2 } from "lucide-react"

interface TaskDetailModalProps {
  task: {
    id: string
    title: string
    description?: string
    dueDate: string | null
    completed: boolean
    subtasks?: {
      id: string
      title: string
      completed: boolean
    }[]
  }
  isOpen: boolean
  onClose: () => void
  onUpdate: (taskId: string, updates: Partial<TaskDetailModalProps['task']>) => void
  onDelete: (taskId: string) => void
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description || '')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleSave = () => {
    onUpdate(task.id, {
      title: editedTitle,
      description: editedDescription || undefined
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTitle(task.title)
    setEditedDescription(task.description || '')
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setIsDeleteDialogOpen(false)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center justify-between">
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="タスクのタイトル"
                  className="text-lg font-semibold"
                />
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="タスクの説明"
                  className="resize-none"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    キャンセル
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Check className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <DialogTitle className="text-lg">{task.title}</DialogTitle>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">ステータスと期限</h3>
              <TaskStatus
                dueDate={task.dueDate}
                completed={task.completed}
                onUpdateDueDate={(newDueDate) => {
                  onUpdate(task.id, { dueDate: newDueDate })
                }}
                onUpdateStatus={(newStatus) => {
                  onUpdate(task.id, { completed: newStatus })
                }}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">サブタスク</h3>
              <SubtaskList
                subtasks={task.subtasks || []}
                onUpdate={(updatedSubtasks) => {
                  onUpdate(task.id, { subtasks: updatedSubtasks })
                }}
                onAdd={(title) => {
                  const newSubtask = {
                    id: `new-${Date.now()}`,
                    title,
                    completed: false
                  }
                  onUpdate(task.id, {
                    subtasks: [...(task.subtasks || []), newSubtask]
                  })
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>タスクを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消すことができません。タスクとそのサブタスクがすべて削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}