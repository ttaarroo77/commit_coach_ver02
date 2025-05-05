"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '@/types/task';
import { TaskColumn } from './task-column';
import { TaskItem } from './sortable-task-item';
import { useTasks } from '@/hooks/use-tasks';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

// タスクのステータスの定義
const TASK_STATUS = {
  TODO: 'todo' as const,
  IN_PROGRESS: 'in-progress' as const,
  COMPLETED: 'completed' as const,
};

// タスクステータスの型
type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

// タスクステータスの表示名
const STATUS_LABELS = {
  [TASK_STATUS.TODO]: '未着手',
  [TASK_STATUS.IN_PROGRESS]: '進行中',
  [TASK_STATUS.COMPLETED]: '完了',
};

// ステータスごとのスタイル設定
const STATUS_STYLES = {
  [TASK_STATUS.TODO]: {
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-700',
    badgeBg: 'bg-gray-200',
    badgeText: 'text-gray-800',
  },
  [TASK_STATUS.IN_PROGRESS]: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
  },
  [TASK_STATUS.COMPLETED]: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
  },
};

interface TaskBoardProps {
  onEditTask?: (task: Task) => void;
}

export function TaskBoard({ onEditTask }: TaskBoardProps) {
  // タスクデータの取得
  const { tasks, mutate } = useTasks();
  
  // フィルタリング状態
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  // フィルタリングロジック
  useEffect(() => {
    if (!tasks) return;
    
    let result = [...tasks];
    
    // 検索クエリによるフィルタリング
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    // 優先度によるフィルタリング
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, priorityFilter]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // センサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px動かすとドラッグ開始
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ステータスごとにタスクを分類（フィルタリング適用）
  const tasksToUse = filteredTasks.length > 0 || searchQuery || priorityFilter !== 'all' ? filteredTasks : tasks;
  const todoTasks = tasksToUse.filter(task => task.status === TASK_STATUS.TODO);
  const inProgressTasks = tasksToUse.filter(task => task.status === TASK_STATUS.IN_PROGRESS);
  const completedTasks = tasksToUse.filter(task => task.status === TASK_STATUS.COMPLETED);

  // ドラッグ開始時の処理
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const draggedTask = tasks.find(task => task.id === active.id);
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  }, [tasks]);

  // ドラッグ終了時の処理
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    // ドラッグ元とドラッグ先が同じ場合は何もしない
    if (active.id === over.id) {
      setActiveTask(null);
      return;
    }

    // ドラッグ元のタスク
    const draggedTask = tasks.find(task => task.id === active.id);
    if (!draggedTask) {
      setActiveTask(null);
      return;
    }

    // ドラッグ先がタスクの場合（並べ替え）
    if (over.id.toString().includes('task-')) {
      const targetTaskId = over.id.toString().replace('task-', '');
      const targetTask = tasks.find(task => task.id === targetTaskId);
      
      if (targetTask && draggedTask.status === targetTask.status) {
        // 同じステータス内での並べ替え
        const statusTasks = tasks.filter(task => task.status === draggedTask.status);
        const oldIndex = statusTasks.findIndex(task => task.id === draggedTask.id);
        const newIndex = statusTasks.findIndex(task => task.id === targetTaskId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newStatusTasks = arrayMove(statusTasks, oldIndex, newIndex);
          
          // オプティミスティックUI更新
          const newTasks = tasks.map(task => {
            if (task.status !== draggedTask.status) return task;
            const updatedTask = newStatusTasks.find(t => t.id === task.id);
            return updatedTask || task;
          });
          
          mutate(newTasks, false);
          
          // APIリクエスト（実際のアプリケーションではここでAPIを呼び出す）
          // const response = await fetch(`/api/tasks/${draggedTask.id}/reorder`, {...});
        }
      } else if (targetTask) {
        // 異なるステータス間での移動
        const updatedTask = { ...draggedTask, status: targetTask.status };
        
        // オプティミスティックUI更新
        const newTasks = tasks.map(task => 
          task.id === draggedTask.id ? updatedTask : task
        );
        
        mutate(newTasks, false);
        
        // APIリクエスト
        try {
          const response = await fetch(`/api/tasks/${draggedTask.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: targetTask.status }),
          });
          
          if (!response.ok) {
            throw new Error('タスクの更新に失敗しました');
          }
          
          // データを再検証
          mutate();
        } catch (error) {
          console.error('タスク更新エラー:', error);
          // エラー時に元のデータに戻す
          mutate();
        }
      }
    }
    // ドラッグ先がカラムの場合（ステータス変更）
    else if (over.id.toString().includes('column-')) {
      const newStatus = over.id.toString().replace('column-', '');
      
      if (draggedTask.status !== newStatus) {
        // newStatusが有効なステータスか確認
        const validStatus = Object.values(TASK_STATUS).includes(newStatus as TaskStatus) 
          ? newStatus as TaskStatus 
          : TASK_STATUS.TODO;
          
        const updatedTask = { ...draggedTask, status: validStatus };
        
        // オプティミスティックUIアップデート
        const newTasks = tasks.map(task => 
          task.id === draggedTask.id ? updatedTask : task
        );
        
        mutate(newTasks, false);
        
        // APIリクエスト
        try {
          const response = await fetch(`/api/tasks/${draggedTask.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: validStatus }),
          });
          
          if (!response.ok) {
            throw new Error('タスクの更新に失敗しました');
          }
          
          // データを再検証
          mutate();
        } catch (error) {
          console.error('タスク更新エラー:', error);
          // エラー時に元のデータに戻す
          mutate();
        }
      }
    }
    
    setActiveTask(null);
  }, [tasks, mutate]);

  // 新しいタスクの作成
  const handleCreateTask = async (status: TaskStatus) => {
    const newTask: Partial<Task> = {
      title: '新しいタスク',
      description: '',
      status,
      priority: 'medium',
      progress: 0,
      subtasks: [],
    };
    
    try {
      // APIリクエスト
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      
      if (!response.ok) {
        throw new Error('タスクの作成に失敗しました');
      }
      
      // データを再検証
      mutate();
    } catch (error) {
      console.error('タスク作成エラー:', error);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg border shadow-sm p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ボードヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-lg font-medium">タスク管理</h2>
        
        {/* フィルターコントロール */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* 検索ボックス */}
          <div className="relative flex-grow sm:max-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タスクを検索..."
              className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          {/* 優先度フィルター */}
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-10 pr-8 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-white"
              >
                <option value="all">すべての優先度</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>
          
          {/* 新規タスク作成ボタン */}
          <button 
            className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded transition-colors"
            onClick={() => handleCreateTask(TASK_STATUS.TODO)}
          >
            新規タスク作成
          </button>
        </div>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {Object.values(TASK_STATUS).map((status) => (
            <TaskColumn
              key={status}
              id={`column-${status}`}
              title={STATUS_LABELS[status]}
              tasks={status === TASK_STATUS.TODO ? todoTasks : 
                     status === TASK_STATUS.IN_PROGRESS ? inProgressTasks : 
                     completedTasks}
              status={status}
              styles={STATUS_STYLES[status]}
              onCreateTask={() => handleCreateTask(status)}
              onTaskClick={onEditTask}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? <TaskItem task={activeTask} isOverlay={true} /> : null}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}
