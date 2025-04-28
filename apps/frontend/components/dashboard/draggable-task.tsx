'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, SubTask } from './task-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { EditableText, isDateOverdue } from './editable-text';
import { ChevronDown, ChevronRight, Plus, Trash2, MoreHorizontal, GripVertical } from 'lucide-react';

interface DraggableTaskProps {
  task: Task;
  onToggleTask: (taskId: string) => void;
  onUpdateTaskTitle: (taskId: string, title: string) => void;
  onUpdateSubtaskTitle: (taskId: string, subtaskId: string, title: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onToggleSubtaskCompleted: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export function DraggableTask({
  task,
  onToggleTask,
  onUpdateTaskTitle,
  onUpdateSubtaskTitle,
  onToggleTaskStatus,
  onToggleSubtaskCompleted,
  onAddSubtask,
  onDeleteTask,
  onDeleteSubtask
}: DraggableTaskProps) {
  // プロジェクトごとの色を返す関数
  const getProjectColor = (project: string) => {
    switch (project) {
      case 'チーム管理':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'ウェブアプリ開発':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'デザインプロジェクト':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'QA':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="border rounded-md mb-3"
      {...attributes}
    >
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-t-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div 
              className="cursor-grab active:cursor-grabbing touch-none"
              {...listeners}
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <Checkbox 
              checked={task.status === 'completed'} 
              onCheckedChange={() => onToggleTaskStatus(task.id)}
              className="h-5 w-5"
            />
            <div className="flex-1">
              <EditableText
                value={task.title}
                onChange={(value) => onUpdateTaskTitle(task.id, value)}
                className={task.status === 'completed' ? 'line-through text-gray-500' : ''}
              />
              
              <div className="flex flex-wrap gap-2 mt-1">
                {task.project && (
                  <span className={`text-xs px-2 py-0.5 rounded ${getProjectColor(task.project)}`}>
                    {task.project}
                  </span>
                )}
                
                {task.priority && (
                  <span className={`text-xs px-2 py-0.5 rounded 
                    ${task.priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                      : task.priority === 'medium' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                    {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                  </span>
                )}
                
                {task.dueDate && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    isDateOverdue(task.dueDate) && task.status !== 'completed'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onToggleTask(task.id)}
              >
                {task.expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500"
                onClick={() => onDeleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>進捗: {task.progress}%</span>
            <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
          </div>
          <Progress value={task.progress} className="h-1.5" />
        </div>
      </div>
      
      {task.expanded && (
        <div className="p-3 border-t">
          <div className="space-y-2">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox 
                    checked={subtask.completed} 
                    onCheckedChange={() => onToggleSubtaskCompleted(task.id, subtask.id)}
                    className="h-4 w-4"
                  />
                  <EditableText
                    value={subtask.title}
                    onChange={(value) => onUpdateSubtaskTitle(task.id, subtask.id, value)}
                    className={subtask.completed ? 'line-through text-gray-500 text-sm' : 'text-sm'}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-500"
                  onClick={() => onDeleteSubtask(task.id, subtask.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-xs"
            onClick={() => onAddSubtask(task.id)}
          >
            <Plus className="h-3 w-3 mr-1" />
            サブタスクを追加
          </Button>
        </div>
      )}
    </div>
  );
}
