import { render, screen, fireEvent } from '@testing-library/react'
import { TaskList } from '@/components/projects/task-list'

const mockTasks = [
  {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-03-20',
    completed: false,
    assignee: {
      id: '1',
      name: 'ユーザー1'
    },
    subtasks: [
      { id: '1-1', title: 'サブタスク1', completed: true },
      { id: '1-2', title: 'サブタスク2', completed: false }
    ]
  },
  {
    id: '2',
    title: 'タスク2',
    status: 'in-progress',
    priority: 'medium',
    dueDate: null,
    completed: false
  },
  {
    id: '3',
    title: '完了タスク',
    status: 'done',
    priority: 'low',
    dueDate: '2024-03-15',
    completed: true
  }
]

describe('TaskList', () => {
  const mockOnCreateTask = jest.fn()
  const mockOnUpdateTask = jest.fn()
  const mockOnDeleteTask = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('タスク一覧が正しく表示される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCreateTask={mockOnCreateTask}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク1の説明')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
    expect(screen.getByText('完了タスク')).toBeInTheDocument()
  })

  it('新規タスクボタンをクリックできる', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCreateTask={mockOnCreateTask}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    const createButton = screen.getByRole('button', { name: /新規タスク/i })
    fireEvent.click(createButton)

    expect(mockOnCreateTask).toHaveBeenCalled()
  })

  it('タスクの検索フィルターが機能する', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCreateTask={mockOnCreateTask}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    const searchInput = screen.getByPlaceholderText('タスクを検索...')
    fireEvent.change(searchInput, { target: { value: 'タスク1' } })

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument()
    expect(screen.queryByText('完了タスク')).not.toBeInTheDocument()
  })

  it('ステータスフィルターが機能する', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCreateTask={mockOnCreateTask}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    // ステータスフィルターを「完了」に設定
    const statusButton = screen.getByRole('combobox', { name: /すべて/i })
    fireEvent.click(statusButton)
    const doneOption = screen.getByRole('option', { name: /完了/i })
    fireEvent.click(doneOption)

    expect(screen.queryByText('タスク1')).not.toBeInTheDocument()
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument()
    expect(screen.getByText('完了タスク')).toBeInTheDocument()
  })

  it('優先度フィルターが機能する', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCreateTask={mockOnCreateTask}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    // 優先度フィルターを「高」に設定
    const priorityButton = screen.getByRole('combobox', { name: /すべて/i })
    fireEvent.click(priorityButton)
    const highPriorityOption = screen.getByRole('option', { name: /高/i })
    fireEvent.click(highPriorityOption)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument()
    expect(screen.queryByText('完了タスク')).not.toBeInTheDocument()
  })

  it('タスクをクリックすると詳細モーダルが表示される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCreateTask={mockOnCreateTask}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    const taskCard = screen.getByText('タスク1').closest('div')
    fireEvent.click(taskCard!)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('タスク1の説明')).toBeInTheDocument()
  })

  it('サブタスクの進捗が正しく表示される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCreateTask={mockOnCreateTask}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('サブタスク: 1/2')).toBeInTheDocument()
  })
}) 