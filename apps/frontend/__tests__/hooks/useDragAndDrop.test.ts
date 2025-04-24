import { renderHook, act } from '@testing-library/react'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { TaskGroup } from '@/types/dashboard'
import { DropResult } from 'react-beautiful-dnd'

describe('useDragAndDrop', () => {
  // テスト用のモックデータ
  const mockTaskGroups: TaskGroup[] = [
    {
      id: 'group-1',
      title: '今日のタスク',
      expanded: true,
      tasks: [
        { id: 'task-1', title: 'タスク1', completed: false, due: new Date().toISOString() },
        { id: 'task-2', title: 'タスク2', completed: true, due: new Date().toISOString() }
      ]
    },
    {
      id: 'today',
      title: '今日',
      expanded: true,
      tasks: [
        { id: 'task-3', title: 'タスク3', completed: false, due: new Date().toISOString() }
      ]
    },
    {
      id: 'unscheduled',
      title: '未スケジュール',
      expanded: true,
      tasks: []
    }
  ]

  const setTaskGroups = jest.fn()

  it('should not change task groups when destination is null', () => {
    const { result } = renderHook(() => useDragAndDrop({
      taskGroups: mockTaskGroups,
      setTaskGroups
    }))

    const dropResult: DropResult = {
      draggableId: 'task-1',
      type: 'task',
      source: {
        droppableId: 'group-1',
        index: 0
      },
      destination: null,
      reason: 'CANCEL',
      mode: 'FLUID'
    }

    act(() => {
      result.current.handleDragEnd(dropResult)
    })

    expect(setTaskGroups).not.toHaveBeenCalled()
  })

  it('should not change task groups when source and destination are the same', () => {
    const { result } = renderHook(() => useDragAndDrop({
      taskGroups: mockTaskGroups,
      setTaskGroups
    }))

    const dropResult: DropResult = {
      draggableId: 'task-1',
      type: 'task',
      source: {
        droppableId: 'group-1',
        index: 0
      },
      destination: {
        droppableId: 'group-1',
        index: 0
      },
      reason: 'DROP',
      mode: 'FLUID'
    }

    act(() => {
      result.current.handleDragEnd(dropResult)
    })

    expect(setTaskGroups).not.toHaveBeenCalled()
  })

  it('should reorder tasks within the same group', () => {
    const { result } = renderHook(() => useDragAndDrop({
      taskGroups: mockTaskGroups,
      setTaskGroups
    }))

    const dropResult: DropResult = {
      draggableId: 'task-1',
      type: 'task',
      source: {
        droppableId: 'group-1',
        index: 0
      },
      destination: {
        droppableId: 'group-1',
        index: 1
      },
      reason: 'DROP',
      mode: 'FLUID'
    }

    act(() => {
      result.current.handleDragEnd(dropResult)
    })

    expect(setTaskGroups).toHaveBeenCalled()
    // setTaskGroupsが呼び出された時の引数を取得
    const setterFunction = setTaskGroups.mock.calls[0][0]
    // 関数を実行してその結果を取得
    const updatedGroups = setterFunction(mockTaskGroups)
    
    // group-1のタスクが並び替えられていることを確認
    const updatedGroup = updatedGroups.find(g => g.id === 'group-1')
    expect(updatedGroup?.tasks[0].id).toBe('task-2')
    expect(updatedGroup?.tasks[1].id).toBe('task-1')
  })

  it('should move task between different groups', () => {
    setTaskGroups.mockClear()
    
    const { result } = renderHook(() => useDragAndDrop({
      taskGroups: mockTaskGroups,
      setTaskGroups
    }))

    const dropResult: DropResult = {
      draggableId: 'task-1',
      type: 'task',
      source: {
        droppableId: 'group-1',
        index: 0
      },
      destination: {
        droppableId: 'unscheduled',
        index: 0
      },
      reason: 'DROP',
      mode: 'FLUID'
    }

    act(() => {
      result.current.handleDragEnd(dropResult)
    })

    expect(setTaskGroups).toHaveBeenCalled()
    
    // 直接呼び出された引数を検証
    const updatedGroups = setTaskGroups.mock.calls[0][0]
    
    // 元のグループからタスクが削除されていることを確認
    const sourceGroup = updatedGroups.find((g: TaskGroup) => g.id === 'group-1')
    expect(sourceGroup?.tasks.length).toBe(1)
    expect(sourceGroup?.tasks[0].id).toBe('task-2')
    
    // 移動先のグループにタスクが追加されていることを確認
    const destGroup = updatedGroups.find((g: TaskGroup) => g.id === 'unscheduled')
    expect(destGroup?.tasks.length).toBe(1)
    expect(destGroup?.tasks[0].id).toBe('task-1')
    // 未スケジュールに移動したので時間情報がないことを確認
    expect(destGroup?.tasks[0].startTime).toBeUndefined()
    expect(destGroup?.tasks[0].endTime).toBeUndefined()
  })

  it('should set start and end time when moving task to today group', () => {
    setTaskGroups.mockClear()
    
    const { result } = renderHook(() => useDragAndDrop({
      taskGroups: mockTaskGroups,
      setTaskGroups
    }))

    const dropResult: DropResult = {
      draggableId: 'task-1',
      type: 'task',
      source: {
        droppableId: 'group-1',
        index: 0
      },
      destination: {
        droppableId: 'today',
        index: 0
      },
      reason: 'DROP',
      mode: 'FLUID'
    }

    // 日時をモック化して一貫性のあるテストにする
    const mockDate = new Date('2025-04-24T10:30:00')
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string)

    act(() => {
      result.current.handleDragEnd(dropResult)
    })

    expect(setTaskGroups).toHaveBeenCalled()
    
    // 直接渡された引数を取得
    const updatedGroups = setTaskGroups.mock.calls[0][0]
    
    // 移動先のグループにタスクが追加されていることを確認
    const destGroup = updatedGroups.find((g: TaskGroup) => g.id === 'today')
    expect(destGroup?.tasks.length).toBe(2)
    expect(destGroup?.tasks[0].id).toBe('task-1')
    // 今日のタスクに移動したので時間情報が設定されていることを確認
    expect(destGroup?.tasks[0].startTime).toBe('10:30')
    expect(destGroup?.tasks[0].endTime).toBe('11:30')

    // モックを元に戻す
    jest.restoreAllMocks()
  })

  it('should handle unknown group ids gracefully', () => {
    setTaskGroups.mockClear()
    
    const { result } = renderHook(() => useDragAndDrop({
      taskGroups: mockTaskGroups,
      setTaskGroups
    }))

    const dropResult: DropResult = {
      draggableId: 'task-1',
      type: 'task',
      source: {
        droppableId: 'non-existent-group',
        index: 0
      },
      destination: {
        droppableId: 'today',
        index: 0
      },
      reason: 'DROP',
      mode: 'FLUID'
    }

    act(() => {
      result.current.handleDragEnd(dropResult)
    })

    // 存在しないグループIDなので処理されないこと
    expect(setTaskGroups).not.toHaveBeenCalled()
  })
})
