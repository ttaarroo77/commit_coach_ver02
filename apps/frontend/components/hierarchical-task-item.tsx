"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { TrashIcon, ChevronDownIcon, ChevronRightIcon, PlusIcon } from "@/components/client-icons"
import { EditableText } from "@/components/editable-text"
import { EditableTime } from "@/components/editable-time"

interface HierarchicalTaskItemProps {
  id: string
  title: string
  completed?: boolean
  level?: number
  expanded: boolean
  hasChildren?: boolean
  startTime?: string
  endTime?: string
  onToggleExpand?: () => void
  onToggleComplete?: () => void
  onDelete?: () => void
  onAddChild?: () => void
  onTitleChange?: (title: string) => void
  onTimeChange?: (startTime: string, endTime: string) => void
  dragHandleProps?: any
  className?: string
  // サブタスク用の時間管理フラグ（コメントアウト）
  /*
  isSubtask?: boolean
  */
}

export function HierarchicalTaskItem({
  id,
  title,
  completed = false,
  level = 1,
  expanded,
  hasChildren = false,
  startTime,
  endTime,
  onToggleExpand,
  onToggleComplete,
  onDelete,
  onAddChild,
  onTitleChange,
  onTimeChange,
  dragHandleProps,
  className = "",
}: HierarchicalTaskItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  const indentClass = level === 1 ? "pl-2" : level === 2 ? "pl-6" : "pl-10"

  return (
    <div
      className={`flex items-center p-2 border-b last:border-b-0 ${indentClass} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 展開/折りたたみボタン */}
      {level < 3 && onToggleExpand ? (
        <Button variant="ghost" size="sm" className="p-0 h-6 w-6 mr-2" onClick={onToggleExpand}>
          {expanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
        </Button>
      ) : (
        <div className="w-8"></div>
      )}

      {/* ドラッグハンドル */}
      {dragHandleProps && <div {...dragHandleProps} className="cursor-grab mr-2"></div>}

      {/* チェックボックス */}
      {onToggleComplete && <Checkbox checked={completed} onCheckedChange={onToggleComplete} className="mr-2" />}

      {/* タイトル */}
      <div className={`flex-1 ${completed ? "line-through text-gray-400" : ""}`}>
        {onTitleChange ? <EditableText value={title} onChange={onTitleChange} /> : <span>{title}</span>}
      </div>

      {/* 時間表示 */}
      {onTimeChange && (
        <div className="ml-2">
          <EditableTime startTime={startTime} endTime={endTime} onTimeChange={onTimeChange} />
        </div>
      )}

      {/*
// サブタスク用の時間表示（現在は非表示）
// isSubtask が true の場合でも時間編集を可能にするコード
// 必要になったら以下のコメントを解除して使用
// {isSubtask && onTimeChange && (
//   <div className="ml-2">
//     <EditableTime
//       startTime={startTime}
//       endTime={endTime}
//       onTimeChange={onTimeChange}
//       className="text-xs opacity-75" // サブタスク用のスタイル
//     />
//   </div>
// )}
*/}

      {/* アクションボタン */}
      <div className={`flex items-center gap-1 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
        {onAddChild && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onAddChild} title="項目追加">
            <PlusIcon className="h-4 w-4 text-gray-400" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onDelete} title="削除">
            <TrashIcon className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  )
}
