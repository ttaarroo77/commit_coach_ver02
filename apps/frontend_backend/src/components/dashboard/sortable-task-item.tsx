"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/task';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

interface SortableTaskItemProps {
  id: string;
  task: Task;
  onClick?: () => void;
}

export function SortableTaskItem({ id, task, onClick }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 優先度に基づくスタイル
  const priorityStyles = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-blue-50 border-blue-200',
  };

  // 期限切れかどうかをチェック
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  // 期限日の表示形式を整える
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
    }).format(date);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        border rounded-md p-3 bg-white shadow-sm cursor-grab
        hover:shadow-md transition-shadow
        ${task.priority && priorityStyles[task.priority as keyof typeof priorityStyles] || ''}
      `}
    >
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium line-clamp-2">{task.title}</h3>
        
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            {task.dueDate && (
              <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
          
          {task.priority === 'high' && (
            <span className="inline-flex items-center text-xs text-red-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>優先</span>
            </span>
          )}
        </div>
        
        {task.subtasks.length > 0 && (
          <div className="pt-1 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>サブタスク</span>
              <span>
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}
        
        {task.project && (
          <div className="pt-1">
            <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {task.project}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ドラッグオーバーレイ用のタスクアイテムコンポーネント
interface TaskItemProps {
  task: Task;
  isOverlay?: boolean;
  onClick?: () => void;
}

export function TaskItem({ task, isOverlay = false, onClick }: TaskItemProps) {
  // 優先度に基づくスタイル
  const priorityStyles = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-blue-50 border-blue-200',
  };

  // 期限切れかどうかをチェック
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  // 期限日の表示形式を整える
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
    }).format(date);
  };

  return (
    <div
      className={`
        border rounded-md p-3 bg-white shadow-sm
        ${isOverlay ? 'shadow-md' : 'hover:shadow-md transition-shadow'}
        ${task.priority && priorityStyles[task.priority as keyof typeof priorityStyles] || ''}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium line-clamp-2">{task.title}</h3>
        
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            {task.dueDate && (
              <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
          
          {task.priority === 'high' && (
            <span className="inline-flex items-center text-xs text-red-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>優先</span>
            </span>
          )}
        </div>
        
        {task.subtasks.length > 0 && (
          <div className="pt-1 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>サブタスク</span>
              <span>
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}
        
        {task.project && (
          <div className="pt-1">
            <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {task.project}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
