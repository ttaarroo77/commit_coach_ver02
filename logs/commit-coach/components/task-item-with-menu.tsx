"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Trash2, Plus, Clock, Braces, ChevronDown, ChevronRight } from "lucide-react"
import { addProjectToDashboard, addTaskToDashboard, addSubtaskToDashboard } from "@/lib/dashboard-utils"
import { toast } from "@/components/ui/use-toast"
import { EditableText } from "./editable-text"
import { cn } from "@/lib/utils"

interface TaskItemProps {
  id: string
  title: string
  completed: boolean
  level: number // 1: プロジェクト, 2: タスク, 3: サブタスク
  expanded?: boolean // 展開状態を追加
  projectTitle?: string
  taskTitle?: string
  onToggle?: () => void
  onDelete?: () => void
  onAddSubtask?: () => void
  onBreakdown?: () => void
  onToggleExpand?: () => void // 展開状態切り替え関数を追加
  onTitleChange?: (newTitle: string) => void // タイトル変更ハンドラを追加
}

export function TaskItemWithMenu({
  id,
  title,
  completed,
  level,
  expanded,
  projectTitle,
  taskTitle,
  onToggle,
  onDelete,
  onAddSubtask,
  onBreakdown,
  onToggleExpand,
  onTitleChange,
}: TaskItemProps) {
  // isHovered 状態を削除

  // レベルに応じたプレフィックスを設定
  const getPrefix = () => {
    switch (level) {
      case 1:
        return "## "
      case 2:
        return "### "
      case 3:
        return ""
      default:
        return ""
    }
  }

  // インデントを計算
  const getIndentClass = () => {
    switch (level) {
      case 1:
        return "pl-4"
      case 2:
        return "pl-8"
      case 3:
        return "pl-12"
      default:
        return "pl-4"
    }
  }

  // ダッシュボードに追加する処理
  const handleAddToDashboard = () => {
    try {
      if (level === 1) {
        // プロジェクトをダッシュボードに追加（階層構造を維持）
        addProjectToDashboard(id, title)
        toast({
          title: "ダッシュボードに追加しました",
          description: `プロジェクト「${title}」とその階層構造を今日のタスクに追加しました`,
        })
      } else if (level === 2) {
        // タスクをダッシュボードに追加（サブタスクも含めて）
        addTaskToDashboard(id, title, projectTitle)
        toast({
          title: "ダッシュボードに追加しました",
          description: `タスク「${title}」とそのサブタスクを今日のタスクに追加しました`,
        })
      } else if (level === 3) {
        // サブタスクをダッシュボードに追加
        addSubtaskToDashboard(id, title, taskTitle, projectTitle)
        toast({
          title: "ダッシュボードに追加しました",
          description: `サブタスク「${title}」を今日のタスクに追加しました`,
        })
      }
    } catch (error) {
      console.error("ダッシュボードへの追加に失敗しました", error)
      toast({
        title: "エラー",
        description: "ダッシュボードへの追加に失敗しました",
        variant: "destructive",
      })
    }
  }

  // サブタスク追加時に自動的に展開するラッパー
  const handleAddSubtask = () => {
    if (onToggleExpand && !expanded) {
      onToggleExpand()
    }
    onAddSubtask?.()
  }

  // onToggleExpand が確実に呼び出されるようにします
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation() // イベントの伝播を停止
    onToggleExpand?.()
  }

  return (
    <div
      className={cn("flex items-center py-2 hover:bg-gray-50 group", getIndentClass())}
      // onMouseEnter と onMouseLeave を削除
    >
      {/* 展開/折りたたみボタン - レベル3（サブタスク）以外に表示 */}
      {expanded !== undefined && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleToggleExpand}
          aria-label={expanded ? "折りたたむ" : "展開する"}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      )}

      <input type="checkbox" className="mr-3" checked={completed} onChange={onToggle || (() => {})} />

      {/* 編集可能なタイトル */}
      <div className="flex-1">
        <EditableText
          value={title}
          onChange={onTitleChange || (() => {})}
          prefix={level < 3 ? getPrefix() : ""}
          isCompleted={completed}
        />
      </div>

      {/* メニューボタン - CSS のみでホバー時に表示 */}
      <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-36">
        {/* 削除ボタン */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* タスク分解ボタン - レベル3（サブタスク）以外に表示 */}
        {level < 3 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            onClick={onBreakdown}
          >
            <Braces className="h-4 w-4" />
          </Button>
        )}

        {/* 下レイヤー追加ボタン - レベル3（サブタスク）以外に表示 */}
        {level < 3 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
            onClick={handleAddSubtask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        {/* ダッシュボード追加ボタン */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
          onClick={handleAddToDashboard}
        >
          <Clock className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
