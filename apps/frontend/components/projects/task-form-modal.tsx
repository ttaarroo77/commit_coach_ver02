import { useState, useCallback, memo, useEffect } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Task, TaskStatus, TaskPriority } from "@/types"

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
  defaultValues?: {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    due_date?: string | undefined
    project_id: string
  }
}

function TaskFormModalComponent({ isOpen, onClose, onSubmit, defaultValues }: TaskFormModalProps) {
  const [title, setTitle] = useState(defaultValues?.title || "")
  const [description, setDescription] = useState(defaultValues?.description || "")
  const [status, setStatus] = useState<TaskStatus>(defaultValues?.status || "backlog")
  const [priority, setPriority] = useState<TaskPriority>(defaultValues?.priority || "medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(defaultValues?.due_date ? new Date(defaultValues.due_date) : undefined)
  
  // defaultValues が変更されたときにフォームをリセット
  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title || "")
      setDescription(defaultValues.description || "")
      setStatus(defaultValues.status || "backlog")
      setPriority(defaultValues.priority || "medium")
      setDueDate(defaultValues.due_date ? new Date(defaultValues.due_date) : undefined)
    }
  }, [defaultValues])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!defaultValues?.project_id) {
      console.error('プロジェクトIDが指定されていません')
      return
    }
    
    onSubmit({
      title,
      description: description || undefined,
      status,
      priority,
      due_date: dueDate?.toISOString() || undefined,
      project_id: defaultValues.project_id,
      subtasks: []
    })
    
    resetForm()
    onClose()
  }, [title, description, status, priority, dueDate, defaultValues?.project_id, onSubmit, onClose])

  const resetForm = useCallback(() => {
    setTitle(defaultValues?.title || "")
    setDescription(defaultValues?.description || "")
    setStatus(defaultValues?.status || "backlog")
    setPriority(defaultValues?.priority || "medium")
    setDueDate(defaultValues?.due_date ? new Date(defaultValues.due_date) : undefined)
  }, [defaultValues])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規タスクの作成</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              タイトル
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトルを入力"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              説明
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの説明を入力"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                ステータス
              </label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">未着手</SelectItem>
                  <SelectItem value="in_progress">進行中</SelectItem>
                  <SelectItem value="review">レビュー中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                優先度
              </label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              期限
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dueDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    format(dueDate, "yyyy年M月d日", { locale: ja })
                  ) : (
                    "期限を選択"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onClose()
              }}
            >
              キャンセル
            </Button>
            <Button type="submit">作成</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// デフォルトエクスポートに変更
export default memo(TaskFormModalComponent);

// 名前付きエクスポートも提供
export const TaskFormModal = memo(TaskFormModalComponent); 