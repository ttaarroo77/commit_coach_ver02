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
      description: 'タスク1の説明',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-03-01',
      project_id: 'project-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'タスク2',
      description: 'タスク2の説明',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-03-02',
      project_id: 'project-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

  it('ドラッグオーバー時にスタイルが変更されること', () => {
    // ドラッグオーバー状態のモック
    jest.spyOn(require('@dnd-kit/core'), 'useDroppable').mockReturnValue({
      setNodeRef: jest.fn(),
      isOver: true
    })

    render(
      <KanbanColumn id="todo" title="ToDo" tasks={mockTasks}>
        <div>タスク1</div>
        <div>タスク2</div>
      </KanbanColumn>
    )

    const column = screen.getByText('ToDo').closest('.card')
    expect(column).toHaveClass('bg-accent/50')
    expect(column).toHaveClass('ring-2')
    expect(column).toHaveClass('ring-inset')
    expect(column).toHaveClass('ring-primary/20')
  })

  it('メモ化が正しく機能すること', () => {
    const { rerender } = render(
      <KanbanColumn id="todo" title="ToDo" tasks={mockTasks}>
        <div>タスク1</div>
        <div>タスク2</div>
      </KanbanColumn>
    )

    // 同じpropsで再レンダリング
    rerender(
      <KanbanColumn id="todo" title="ToDo" tasks={mockTasks}>
        <div>タスク1</div>
        <div>タスク2</div>
      </KanbanColumn>
    )

    // タスクの順序が変わった場合
    const reorderedTasks = [...mockTasks].reverse()
    rerender(
      <KanbanColumn id="todo" title="ToDo" tasks={reorderedTasks}>
        <div>タスク2</div>
        <div>タスク1</div>
      </KanbanColumn>
    )

    // タスクが追加された場合
    const newTasks = [...mockTasks, {
      id: '3',
      title: 'タスク3',
      description: 'タスク3の説明',
      status: 'todo',
      priority: 'low',
      dueDate: '2024-03-03',
      project_id: 'project-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]
    rerender(
      <KanbanColumn id="todo" title="ToDo" tasks={newTasks}>
        <div>タスク1</div>
        <div>タスク2</div>
        <div>タスク3</div>
      </KanbanColumn>
    )
  })
})