import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, SearchIcon } from "lucide-react"
import { TaskFormModal } from "./task-form-modal"

interface ProjectHeaderProps {
  projectId: string
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 検索機能の実装
  }

  const handleTaskCreate = (task: {
    title: string
    description?: string
    status: string
    priority: string
    dueDate: string | null
  }) => {
    // TODO: タスク作成APIの呼び出し
    setIsTaskModalOpen(false)
  }

  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-96 items-center space-x-2">
          <Input
            type="search"
            placeholder="タスクを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon" variant="ghost">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center"
          >
            <PlusIcon className="mr-1 h-4 w-4" />
            新規タスク
          </Button>
        </div>
      </div>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskCreate}
      />
    </div>
  )
} 