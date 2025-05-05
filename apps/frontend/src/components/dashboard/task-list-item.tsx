"use client";

import React from 'react';
import { Task } from '@/types/task';
import { CheckCircle, Circle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskListItemProps {
  task: Task;
  onClick?: () => void;
}

export function TaskListItem({ task, onClick }: TaskListItemProps) {
  // タスクの状態（完了/未完了）
  const isCompleted = task.status === 'completed';
  
  // 期限切れかどうかを判定
  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !isCompleted;
  };
  
  // 今日が期限かどうかを判定
  const isDueToday = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  };
  
  // 期限日の表示形式を整形
  const formatDueDate = () => {
    if (!task.dueDate) return '';
    const dueDate = new Date(task.dueDate);
    return format(dueDate, 'MM/dd', { locale: ja });
  };
  
  // プロジェクトタグの色を決定
  const getProjectTagColor = () => {
    switch (task.project) {
      case 'Auth':
        return 'bg-blue-100 text-blue-800';
      case 'UI':
        return 'bg-purple-100 text-purple-800';
      case 'Backend':
        return 'bg-green-100 text-green-800';
      case 'DevOps':
        return 'bg-orange-100 text-orange-800';
      case 'Security':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 優先度に応じたスタイルを取得
  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <motion.div
      className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${isCompleted ? 'opacity-70' : ''}`}
      onClick={onClick}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      whileTap={{ scale: 0.99 }}
    >
      {/* チェックボックス */}
      <div className="mr-3">
        <button 
          className={`focus:outline-none ${isCompleted ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={(e) => {
            e.stopPropagation();
            // ここでタスクの完了状態を切り替える処理を実装
          }}
        >
          {isCompleted ? 
            <CheckCircle className="h-5 w-5" /> : 
            <Circle className="h-5 w-5" />}
        </button>
      </div>
      
      {/* タスク情報 */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center">
          <h3 className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          
          {/* サブタスク数バッジ */}
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          )}
        </div>
        
        {/* タスクのメタ情報 */}
        <div className="flex items-center mt-1 text-xs space-x-3">
          {/* プロジェクトタグ */}
          {task.project && (
            <span className={`px-2 py-0.5 rounded-full ${getProjectTagColor()}`}>
              {task.project}
            </span>
          )}
          
          {/* 期限 */}
          {task.dueDate && (
            <span 
              className={`flex items-center ${
                isOverdue() ? 'text-red-600' : 
                isDueToday() ? 'text-amber-600' : 
                'text-gray-500'
              }`}
            >
              {isOverdue() ? 
                <AlertCircle className="h-3 w-3 mr-1" /> : 
                isDueToday() ? 
                  <Clock className="h-3 w-3 mr-1" /> : 
                  <Calendar className="h-3 w-3 mr-1" />
              }
              {formatDueDate()}
            </span>
          )}
          
          {/* 優先度 */}
          <span className={`${getPriorityStyle()}`}>
            {task.priority === 'high' ? '優先度: 高' : 
             task.priority === 'medium' ? '優先度: 中' : 
             '優先度: 低'}
          </span>
        </div>
      </div>
      
      {/* 時間表示（オプション） */}
      {task.dueDate && (
        <div className="text-xs text-gray-400 ml-2 hidden sm:block">
          {format(new Date(task.dueDate), 'HH:mm', { locale: ja })}
        </div>
      )}
    </motion.div>
  );
}
