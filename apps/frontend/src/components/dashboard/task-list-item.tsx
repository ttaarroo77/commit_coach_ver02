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
  onStatusToggle?: (taskId: string) => void;
}

export function TaskListItem({ task, onClick, onStatusToggle }: TaskListItemProps) {
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
      className={`flex items-center px-1 py-1 transition-all cursor-pointer ${isCompleted ? 'opacity-65' : ''}`}
      onClick={onClick}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', x: 1 }}
      whileTap={{ scale: 0.99, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
      transition={{ duration: 0.1, ease: 'easeInOut' }}
    >
      {/* チェックボックス */}
      <div className="mr-1">
        <button 
          className={`focus:outline-none ${isCompleted ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onStatusToggle) {
              onStatusToggle(task.id);
            }
          }}
        >
          <motion.div
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {isCompleted ? 
              <CheckCircle className="h-3 w-3" /> : 
              <Circle className="h-3 w-3" />}
          </motion.div>
        </button>
      </div>
      
      {/* タスク情報 */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center">
          <motion.h3 
            className={`text-[10px] font-normal truncate ${isCompleted ? 'text-gray-400' : 'text-gray-700'}`}
            animate={{ textDecoration: isCompleted ? 'line-through' : 'none' }}
            transition={{ duration: 0.2 }}
          >
            {task.title}
          </motion.h3>
          
          {/* サブタスク数バッジ */}
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="ml-1 text-[8px] bg-gray-100 text-gray-500 px-0.5 rounded-[2px]">
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          )}
        </div>
        
        {/* タスクのメタ情報 */}
        <div className="flex items-center mt-0.5 text-[8px] space-x-1.5">
          {/* プロジェクトタグ */}
          {task.project && (
            <span className={`px-0.5 rounded-[2px] ${getProjectTagColor()}`}>
              {task.project}
            </span>
          )}
          
          {/* 期限 */}
          {task.dueDate && (
            <span 
              className={`flex items-center ${
                isOverdue() ? 'text-red-500' : 
                isDueToday() ? 'text-amber-500' : 
                'text-gray-400'
              }`}
            >
              {isOverdue() ? 
                <AlertCircle className="h-2 w-2 mr-0.5" /> : 
                isDueToday() ? 
                  <Clock className="h-2 w-2 mr-0.5" /> : 
                  <Calendar className="h-2 w-2 mr-0.5" />
              }
              {formatDueDate()}
            </span>
          )}
          
          {/* 優先度 */}
          <span className={`${getPriorityStyle()} text-[7px]`}>
            {task.priority === 'high' ? '高' : 
             task.priority === 'medium' ? '中' : 
             '低'}
          </span>
        </div>
      </div>
      
      {/* 時間表示（オプション） */}
      {task.dueDate && (
        <div className="text-[10px] text-gray-400 ml-1 hidden sm:block">
          {format(new Date(task.dueDate), 'HH:mm', { locale: ja })}
        </div>
      )}
    </motion.div>
  );
}
