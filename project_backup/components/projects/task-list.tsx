import { useState, useMemo } from "react"
import { TaskFilters, TaskStatus, TaskPriority } from "./task-filters"
import { TaskDetailModal } from "./task-detail-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate: string | null
  completed: boolean
  assignee?: {
    id: string
    name: string
  }
  subtasks?: {
    id: string
    title: string
    completed: boolean
  }[]
}

interface TaskListProps {
  tasks: Task[]
  onCreateTask: () => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask
}: TaskListProps) {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all' as TaskStatus,
    priority: 'all' as TaskPriority
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 検索フィルター
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        false

      // ステータスフィルター
      const matchesStatus = filters.status === 'all' || task.status === filters.status

      // 優先度フィルター
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, filters])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">タスク一覧</h2>
        <Button onClick={onCreateTask}>
          <Plus className="h-4 w-4 mr-2" />
          新規タスク
        </Button>
      </div>

      <TaskFilters
        onFilterChange={setFilters}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="bg-card text-card-foreground rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTask(task)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {task.assignee?.name || '未割り当て'}
                  </span>
                  {task.dueDate && (
                    <span className="text-sm text-muted-foreground">
                      期限: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                  }`}>
                  {task.status === 'todo' ? '未着手' :
                    task.status === 'in-progress' ? '進行中' : '完了'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${task.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                    task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {task.priority === 'low' ? '低' :
                    task.priority === 'medium' ? '中' : '高'}
                </span>
              </div>
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    サブタスク: {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      )}
    </div>
  )
}