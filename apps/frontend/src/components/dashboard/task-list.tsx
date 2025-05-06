"use client";

import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { TaskListItem } from './task-list-item';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useDashboardTasks, type DashboardTask } from "@/hooks/useDashboardTasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Trash2 } from "lucide-react"

interface TaskListProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onCreateTask: () => void;
  onStatusToggle: (taskId: string) => void;
  onOrderChange?: (taskIds: string[]) => void;
  isDraggable?: boolean;
}

export function TaskList({
  title,
  tasks,
  onTaskClick,
  onCreateTask,
  onStatusToggle,
  onOrderChange,
  isDraggable = false
}: TaskListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState<Task[]>(tasks);

  // 親からのタスクリストが変更されたら、内部状態も更新
  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  // DnDセンサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // タスクグループの展開/折りたたみを切り替える
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // 新しい順序でタスクを並べ替え
      const oldIndex = items.findIndex(task => task.id === active.id);
      const newIndex = items.findIndex(task => task.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // 親コンポーネントに新しい順序を通知
      if (onOrderChange) {
        onOrderChange(newItems.map(task => task.id));
      }
    }
  };

  const { tasks: dashboardTasks, isLoading, error, updateTask, deleteTask } = useDashboardTasks()

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (dashboardTasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          タスクがありません。プロジェクトからタスクを追加してください。
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {dashboardTasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={(checked) => {
                  updateTask(task.id, {
                    status: checked ? 'completed' : 'pending',
                  })
                }}
              />
              <CardTitle className="text-lg flex-1">
                <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>
                  {task.title}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {task.startTime} - {task.endTime}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              プロジェクト: {task.project}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
