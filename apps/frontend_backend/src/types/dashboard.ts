import { Task } from './task'
import { Project } from './project'

export type DashboardItem = {
  id: string
  type: 'task' | 'project'
  itemId: string
  position: number
  createdAt: Date
  updatedAt: Date
  task?: Task
  project?: Project
}
