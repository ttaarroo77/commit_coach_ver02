"use client";

import React, { useState } from 'react';
import { Task } from '@/types/task';
import { TaskListItem } from './task-list-item';
import { Search, Filter, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onCreateTask?: () => void;
}

export function TaskList({ title, tasks, onTaskClick, onCreateTask }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(true);

  // フィルタリングされたタスク
  const filteredTasks = tasks.filter(task => {
    // 検索クエリによるフィルタリング
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 優先度によるフィルタリング
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  // タスクグループの展開/折りたたみを切り替える
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm mb-4">
      {/* ヘッダー */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <button 
            onClick={toggleExpand}
            className="flex items-center text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? <ChevronDown className="h-5 w-5 mr-1" /> : <ChevronRight className="h-5 w-5 mr-1" />}
            {title}
            <span className="ml-2 text-sm text-gray-500">({filteredTasks.length})</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {/* 検索ボックス */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="検索..."
                className="pl-8 pr-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-36 md:w-44"
              />
            </div>
            
            {/* 優先度フィルター */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-8 pr-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-white"
              >
                <option value="all">すべて</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            
            {/* 新規タスク作成ボタン */}
            {onCreateTask && (
              <button 
                onClick={onCreateTask}
                className="p-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* モバイル用の検索・フィルター (折りたたみ可能) */}
        <div className="mt-2 sm:hidden flex space-x-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索..."
              className="w-full pl-8 pr-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="pl-8 pr-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-white"
            >
              <option value="all">すべて</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* タスクリスト */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="divide-y">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick && onTaskClick(task)}
                  />
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">
                  {searchQuery || priorityFilter !== 'all' ? 
                    'フィルター条件に一致するタスクがありません' : 
                    'タスクがありません'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
