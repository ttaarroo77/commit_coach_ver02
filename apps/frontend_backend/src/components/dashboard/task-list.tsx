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

  return (
    <div className="overflow-hidden">
      {/* タイトルがある場合のみヘッダーを表示 */}
      {title && (
        <div className="flex items-center justify-between py-0.5 px-1.5 cursor-pointer" onClick={toggleExpand}>
          <div className="flex items-center">
            {isExpanded ? 
              <ChevronDown className="h-2 w-2 mr-1 text-gray-400" /> : 
              <ChevronRight className="h-2 w-2 mr-1 text-gray-400" />
            }
            <h2 className="text-[8px] font-medium text-gray-700">{title}</h2>
          </div>
          <span className="text-[7px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded-[2px]">
            {items.length}
          </span>
        </div>
      )}
      
      {/* タスクリスト */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {isDraggable ? (
              // ドラッグ＆ドロップ可能なリスト
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="divide-y divide-gray-50">
                    {items.map((task) => (
                      <TaskListItem
                        key={task.id}
                        task={task}
                        onClick={() => onTaskClick(task)}
                        onStatusToggle={onStatusToggle}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              // 通常のリスト（ドラッグ不可）
              <div className="divide-y divide-gray-50">
                {items.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onStatusToggle={onStatusToggle}
                  />
                ))}
              </div>
            )}
            
            {/* タスクが一つもない場合 */}
            {items.length === 0 && (
              <div className="py-2 text-center">
                <p className="text-[8px] text-gray-400">タスクがありません</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
