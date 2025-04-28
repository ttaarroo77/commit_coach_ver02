'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
  useDraggable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Task } from './task-group';
import { DraggableTask } from './draggable-task';
import { useDragContext } from './drag-context';

interface SortableTaskGroupProps {
  id: string;
  title: string;
  expanded: boolean;
  tasks: Task[];
  dueDate?: string;
  completed: boolean;
  onToggleExpand: (id: string) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTaskTitle: (taskId: string, title: string) => void;
  onUpdateSubtaskTitle: (taskId: string, subtaskId: string, title: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onToggleSubtaskCompleted: (taskId: string, subtaskId: string) => void;
  onAddTask: () => void;
  onAddSubtask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onTasksReordered: (tasks: Task[]) => void;
  onTaskMoved: (taskId: string, sourceGroupId: string, targetGroupId: string) => void;
}

export function SortableTaskGroup({
  id,
  title,
  expanded,
  tasks,
  onToggleExpand,
  onToggleTask,
  onUpdateTaskTitle,
  onUpdateSubtaskTitle,
  onToggleTaskStatus,
  onToggleSubtaskCompleted,
  onAddTask,
  onAddSubtask,
  onDeleteTask,
  onDeleteSubtask,
  onTasksReordered,
  onTaskMoved
}: SortableTaskGroupProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localActiveTask, setLocalActiveTask] = useState<Task | null>(null);
  const [localSourceGroupId, setLocalSourceGroupId] = useState<string | null>(null);
  
  // DragContextが利用可能な場合は使用し、そうでない場合はローカルの状態を使用
  let activeTask = localActiveTask;
  let setActiveTask = setLocalActiveTask;
  let sourceGroupId = localSourceGroupId;
  let setSourceGroupId = setLocalSourceGroupId;
  
  try {
    const dragContext = useDragContext();
    activeTask = dragContext.activeTask;
    setActiveTask = dragContext.setActiveTask;
    sourceGroupId = dragContext.sourceGroupId;
    setSourceGroupId = dragContext.setSourceGroupId;
  } catch (error) {
    // DragProviderが提供されていない場合は、ローカルの状態を使用
    console.log('DragProvider not found, using local state');
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8pxの移動で開始
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const draggedTask = tasks.find(task => task.id === active.id);
    if (draggedTask) {
      setActiveTask(draggedTask);
      setSourceGroupId(id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // 同じグループ内での並べ替え
      if (over.data.current?.type === 'task') {
        const oldIndex = tasks.findIndex(task => task.id === active.id);
        const newIndex = tasks.findIndex(task => task.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
          onTasksReordered(reorderedTasks);
        }
      }
    }
    
    setActiveId(null);
    setActiveTask(null);
    setSourceGroupId(null);
  };
  
  // ドラッグオーバー時の処理（グループ間移動用）
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    // グループ間の移動
    if (over && over.data.current?.type === 'group' && sourceGroupId && sourceGroupId !== id) {
      // タスクをグループ間で移動
      onTaskMoved(active.id as string, sourceGroupId, id);
      setSourceGroupId(id);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer" onClick={() => onToggleExpand(id)}>
        <CardTitle className="text-lg font-medium flex items-center">
          {expanded ? (
            <ChevronDown className="h-5 w-5 mr-2 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 mr-2 text-gray-500" />
          )}
          {title}
          <span className="ml-2 text-sm text-gray-500">({tasks.length})</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          onAddTask();
        }}>
          <Plus className="h-4 w-4 mr-1" />
          タスク追加
        </Button>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 px-4 pb-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <SortableContext
              items={tasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {/* グループ自体をドロップ対象として設定 */}
              <div
                data-group-id={id}
                data-type="group"
              >
              <div className="space-y-0">
                {tasks.map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onToggleTask={onToggleTask}
                    onUpdateTaskTitle={onUpdateTaskTitle}
                    onUpdateSubtaskTitle={onUpdateSubtaskTitle}
                    onToggleTaskStatus={onToggleTaskStatus}
                    onToggleSubtaskCompleted={onToggleSubtaskCompleted}
                    onAddSubtask={onAddSubtask}
                    onDeleteTask={onDeleteTask}
                    onDeleteSubtask={onDeleteSubtask}
                  />
                ))}
              </div>
              </div>
            </SortableContext>
            
            {/* ドラッグ中のオーバーレイ */}
            <DragOverlay>
              {activeId && activeTask ? (
                <div className="opacity-80">
                  <DraggableTask
                    task={activeTask}
                    onToggleTask={onToggleTask}
                    onUpdateTaskTitle={onUpdateTaskTitle}
                    onUpdateSubtaskTitle={onUpdateSubtaskTitle}
                    onToggleTaskStatus={onToggleTaskStatus}
                    onToggleSubtaskCompleted={onToggleSubtaskCompleted}
                    onAddSubtask={onAddSubtask}
                    onDeleteTask={onDeleteTask}
                    onDeleteSubtask={onDeleteSubtask}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          
          {tasks.length === 0 && (
            <div className="flex justify-center my-4">
              <Button
                variant="outline"
                className="border-dashed text-gray-400 hover:text-gray-600"
                onClick={onAddTask}
              >
                <Plus className="h-4 w-4 mr-2" />
                タスクを追加
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
