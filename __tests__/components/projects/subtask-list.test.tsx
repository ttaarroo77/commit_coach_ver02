import { render, screen, fireEvent } from '@testing-library/react'
import { SubtaskList } from '@/components/projects/subtask-list'

describe('SubtaskList', () => {
  const mockSubtasks = [
    { id: '1', title: 'サブタスク1', completed: false },
    { id: '2', title: 'サブタスク2', completed: true }
  ]

  const mockOnUpdate = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('サブタスクが正しく表示されること', () => {
    render(
      <SubtaskList
        subtasks={mockSubtasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('サブタスク1')).toBeInTheDocument()
    expect(screen.getByText('サブタスク2')).toBeInTheDocument()
  })

  it('完了したサブタスクは取り消し線が表示されること', () => {
    render(
      <SubtaskList
        subtasks={mockSubtasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const completedLabel = screen.getByText('サブタスク2')
    expect(completedLabel).toHaveClass('text-muted-foreground', 'line-through')
  })

  it('サブタスクの完了状態を切り替えられること', () => {
    render(
      <SubtaskList
        subtasks={mockSubtasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(checkbox)

    expect(mockOnUpdate).toHaveBeenCalledWith('1', true)
  })

  it('サブタスクを削除できること', () => {
    render(
      <SubtaskList
        subtasks={mockSubtasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getAllByRole('button')[0]
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })
}) 