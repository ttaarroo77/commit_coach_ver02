import { render, screen } from '@testing-library/react'
import { TaskGroupList } from '@/components/dashboard/TaskGroupList'
import { TaskGroup as TaskGroupType } from '@/types/dashboard'

// react-beautiful-dndのモック化
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
  Droppable: ({ children }: { children: Function }) => 
    children({ innerRef: jest.fn(), droppableProps: {}, placeholder: null }),
  Draggable: ({ children }: { children: Function }) => 
    children({ innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {} }),
}))

describe('TaskGroupList', () => {
  // テスト用のモックデータ
  const mockTaskGroups: TaskGroupType[] = [
    {
      id: 'group-1',
      title: 'タスクグループ1',
      expanded: true,
      tasks: [
        { id: 'task-1', title: 'タスク1', completed: false, due: new Date().toISOString() },
        { id: 'task-2', title: 'タスク2', completed: true, due: new Date().toISOString() }
      ]
    },
    {
      id: 'group-2',
      title: 'タスクグループ2',
      expanded: false,
      tasks: [
        { id: 'task-3', title: 'タスク3', completed: false, due: new Date().toISOString() }
      ]
    }
  ]

  // モックコールバック関数
  const mockCallbacks = {
    onDragEnd: jest.fn(),
    onToggleGroup: jest.fn(),
    onDeleteTask: jest.fn(),
    onAddTask: jest.fn(),
    onUpdateGroupTitle: jest.fn(),
    onSortTasks: jest.fn()
  }

  it('renders all task groups', () => {
    render(
      <TaskGroupList
        taskGroups={mockTaskGroups}
        sortOrder="none"
        {...mockCallbacks}
      />
    )
    
    // 各グループのタイトルが表示されていることを確認
    expect(screen.getByText('タスクグループ1')).toBeInTheDocument()
    expect(screen.getByText('タスクグループ2')).toBeInTheDocument()
  })

  it('passes correct props to TaskGroup components', () => {
    // TaskGroupコンポーネントをスパイして、正しいpropsが渡されるか確認
    const originalTaskGroup = require('@/components/dashboard/TaskGroup').TaskGroup
    jest.mock('@/components/dashboard/TaskGroup', () => ({
      TaskGroup: jest.fn(props => originalTaskGroup(props))
    }))
    
    const TaskGroupSpy = require('@/components/dashboard/TaskGroup').TaskGroup

    render(
      <TaskGroupList
        taskGroups={mockTaskGroups}
        sortOrder="asc"
        {...mockCallbacks}
      />
    )
    
    // TaskGroupが正しい回数で呼び出されることを確認
    expect(TaskGroupSpy).toHaveBeenCalledTimes(2)
    
    // 最初のTaskGroupの呼び出しが正しいpropsを持っていることを確認
    expect(TaskGroupSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        group: mockTaskGroups[0],
        sortOrder: 'asc',
        onToggleGroup: mockCallbacks.onToggleGroup,
        onDeleteTask: mockCallbacks.onDeleteTask,
        onAddTask: mockCallbacks.onAddTask,
        onUpdateGroupTitle: mockCallbacks.onUpdateGroupTitle,
        onSortTasks: mockCallbacks.onSortTasks
      }),
      expect.anything()
    )
  })

  it('handles empty task groups array', () => {
    render(
      <TaskGroupList
        taskGroups={[]}
        sortOrder="none"
        {...mockCallbacks}
      />
    )
    
    // 空のTaskGroupListが正しくレンダリングされること
    const container = screen.getByRole('generic')
    expect(container).toBeInTheDocument()
    expect(container.children).toHaveLength(0)
  })
})
