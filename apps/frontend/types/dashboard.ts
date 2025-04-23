export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  startTime?: string
  endTime?: string
  status: "todo" | "in-progress" | "completed"
  project?: string
  priority?: string
  progress: number
  subtasks: SubTask[]
  expanded?: boolean
  dueDate?: string
}

export interface TaskGroup {
  id: string
  title: string
  expanded: boolean
  tasks: Task[]
  dueDate?: string
  completed: boolean
} 