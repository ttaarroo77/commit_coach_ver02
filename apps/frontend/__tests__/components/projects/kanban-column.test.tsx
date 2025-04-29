import { render, screen } from '@testing-library/react'
import { KanbanColumn } from '@/components/projects/kanban-column'
import { Task } from '@/types'

// モックの設定
jest.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false
  })
}))

describe('KanbanColumn', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'タスク1',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString()
    },
    {
      id: '2',
      title: 'タスク2',
      status: 'todo',
      priority: 'high',
      dueDate: new Date().toISOString()
    }
  ]

  it('正しくレンダリングされること', () => {
    render(
      <KanbanColumn id="todo" title="ToDo" tasks={mockTasks}>
        <div>タスク1</div>
        <div>タスク2</div>
      </KanbanColumn>
    )

    expect(screen.getByText('ToDo')).toBeInTheDocument()
    expect(screen.getByText('2 タスク')).toBeInTheDocument()
    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
  })

  it('タスクが空の場合も正しくレンダリングされること', () => {
    render(
      <KanbanColumn id="todo" title="ToDo" tasks={[]}>
        <div>タスクがありません</div>
      </KanbanColumn>
    )

    expect(screen.getByText('ToDo')).toBeInTheDocument()
    expect(screen.getByText('0 タスク')).toBeInTheDocument()
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })
})