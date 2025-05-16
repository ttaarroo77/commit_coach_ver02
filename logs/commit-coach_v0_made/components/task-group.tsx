// components > task-group.tsx

"use client"

import { useState, useEffect, useRef } from "react"
import { TaskItemWithMenu } from "./task-item-with-menu"

interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface Task {
  id: string
  title: string
  completed: boolean
  expanded?: boolean // 展開状態を追加
  subtasks: SubTask[]
}

interface TaskGroupProps {
  id: string
  title: string
  tasks: Task[]
  defaultExpanded?: boolean
  onDelete?: () => void
  onAddTask?: () => void
  onBreakdown?: () => void
  onToggleExpand?: () => void
  // タスク ID を受け取って親へ渡す
  onAddSubtask?: (taskId: string) => void
  // タスクの展開状態を切り替え
  onToggleTaskExpand?: (taskId: string) => void
  // タイトル変更ハンドラを追加
  onTitleChange?: (newTitle: string) => void
  // タスクタイトル変更ハンドラを追加
  onTaskTitleChange?: (taskId: string, newTitle: string) => void
  // サブタスクタイトル変更ハンドラを追加
  onSubtaskTitleChange?: (taskId: string, subtaskId: string, newTitle: string) => void
}

export function TaskGroup({
  id,
  title,
  tasks,
  defaultExpanded = false,
  onDelete,
  onAddTask,
  onBreakdown,
  onToggleExpand,
  onAddSubtask,
  onToggleTaskExpand,
  onTitleChange,
  onTaskTitleChange,
  onSubtaskTitleChange,
}: TaskGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  // 完了状態は props から計算（全タスク完了なら true）
  const isCompleted = tasks.length > 0 && tasks.every((t) => t.completed)
  // 前回のタスク数を記録するためのref
  const prevTaskCountRef = useRef<number>(tasks.length)

  // defaultExpanded が変更されたら isExpanded を更新
  useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded])

  // タスクが追加されたら自動的に展開 - 修正版
  useEffect(() => {
    const prevCount = prevTaskCountRef.current
    prevTaskCountRef.current = tasks.length

    // タスク数が 0→1+ になったときだけ自動展開
    if (prevCount === 0 && tasks.length > 0) {
      setIsExpanded(true)
    }
  }, [tasks.length]) // isExpandedを依存配列から除外

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)
    // 親コンポーネントにも通知
    onToggleExpand?.()
  }

  // 完了チェックは親が持つのが理想だが、当面は読み取り専用に
  const toggleCompleted = () => {}

  // タスクを追加するたびに展開するラッパー
  const handleAddTask = () => {
    if (!isExpanded) setIsExpanded(true)
    onAddTask?.()
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      {/* プロジェクトヘッダー - expanded プロパティを追加 */}
      <TaskItemWithMenu
        id={id}
        title={title}
        completed={isCompleted}
        level={1}
        expanded={isExpanded} // ここに expanded プロパティを追加
        onToggle={toggleCompleted}
        onDelete={onDelete}
        onAddSubtask={handleAddTask}
        onBreakdown={onBreakdown}
        onToggleExpand={toggleExpanded}
        onTitleChange={onTitleChange}
      />

      {/* タスクリスト - 展開時のみ表示 */}
      {isExpanded && (
        <div className="border-t">
          {tasks.map((task) => (
            <div key={task.id}>
              {/* タスク */}
              <TaskItemWithMenu
                id={task.id}
                title={task.title}
                completed={task.completed}
                level={2}
                expanded={task.expanded}
                projectTitle={title}
                onDelete={() => console.log(`タスク削除: ${task.id}`)}
                onAddSubtask={() => onAddSubtask?.(task.id)}
                onBreakdown={() => console.log(`タスク分解: ${task.id}`)}
                onToggleExpand={() => onToggleTaskExpand?.(task.id)}
                onTitleChange={(newTitle) => onTaskTitleChange?.(task.id, newTitle)}
              />

              {/* サブタスク - タスクが展開されている場合のみ表示 */}
              {task.expanded &&
                task.subtasks.map((subtask) => (
                  <TaskItemWithMenu
                    key={subtask.id}
                    id={subtask.id}
                    title={subtask.title}
                    completed={subtask.completed}
                    level={3}
                    projectTitle={title}
                    taskTitle={task.title}
                    onDelete={() => console.log(`サブタスク削除: ${subtask.id}`)}
                    onTitleChange={(newTitle) => onSubtaskTitleChange?.(task.id, subtask.id, newTitle)}
                  />
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
