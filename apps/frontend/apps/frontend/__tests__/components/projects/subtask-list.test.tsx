import { render, screen, fireEvent } from '@testing-library/react'
import { SubtaskList } from '@/components/projects/subtask-list'

describe('SubtaskList', () => {
  const mockSubtasks = [
    { id: '1', title: 'サブタスク1', completed: false },
    { id: '2', title: 'サブタスク2', completed: true }
  ]

  const mockOnUpdate = jest.fn()
  const mockOnAdd = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('サブタスクが正しく表示されること', () => {
    render(<SubtaskList subtasks={mockSubtasks} onUpdate={mockOnUpdate} />)

    expect(screen.getByText('サブタスク1')).toBeInTheDocument()
    expect(screen.getByText('サブタスク2')).toBeInTheDocument()
    expect(screen.getByText('(1/2)')).toBeInTheDocument()
  })

  it('折りたたみ機能が動作すること', () => {
    render(<SubtaskList subtasks={mockSubtasks} onUpdate={mockOnUpdate} />)

    const toggleButton = screen.getByText('サブタスク').parentElement
    fireEvent.click(toggleButton!)

    expect(screen.queryByText('サブタスク1')).not.toBeInTheDocument()
    expect(screen.queryByText('サブタスク2')).not.toBeInTheDocument()

    fireEvent.click(toggleButton!)

    expect(screen.getByText('サブタスク1')).toBeInTheDocument()
    expect(screen.getByText('サブタスク2')).toBeInTheDocument()
  })

  it('サブタスクの完了状態を切り替えられること', () => {
    render(<SubtaskList subtasks={mockSubtasks} onUpdate={mockOnUpdate} />)

    const checkbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(checkbox)

    expect(mockOnUpdate).toHaveBeenCalledWith([
      { id: '1', title: 'サブタスク1', completed: true },
      { id: '2', title: 'サブタスク2', completed: true }
    ])
  })

  it('新しいサブタスクを追加できること', () => {
    render(
      <SubtaskList
        subtasks={mockSubtasks}
        onUpdate={mockOnUpdate}
        onAdd={mockOnAdd}
      />
    )

    const input = screen.getByPlaceholderText('新しいサブタスク')
    fireEvent.change(input, { target: { value: '新しいタスク' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnAdd).toHaveBeenCalledWith('新しいタスク')
    expect(input).toHaveValue('')
  })

  it('空のサブタスクは追加できないこと', () => {
    render(
      <SubtaskList
        subtasks={mockSubtasks}
        onUpdate={mockOnUpdate}
        onAdd={mockOnAdd}
      />
    )

    const input = screen.getByPlaceholderText('新しいサブタスク')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnAdd).not.toHaveBeenCalled()
  })
}) 