"use client";

import { useState } from 'react';
import { AIChat } from '@/components/ai-chat';
import { TaskFormModal } from '@/components/dashboard/task-form-modal';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Filter, Search } from 'lucide-react';
import { TaskList } from './task-list';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// APIが実装されるまでのフォールバック用モックデータ
const fallbackTasks: Task[] = [
  {
    id: '1',
    title: 'ログイン機能の実装',
    description: 'ユーザー認証システムの実装',
    status: 'in-progress',
    priority: 'high',
    progress: 50,
    dueDate: new Date().toISOString().split('T')[0],
    subtasks: [
      { id: '1-1', title: 'UI設計', completed: true },
      { id: '1-2', title: 'バックエンド連携', completed: false },
    ],
    project: 'Auth',
  },
  {
    id: '2',
    title: 'ダッシュボードのレイアウト調整',
    description: 'レスポンシブデザインの適用',
    status: 'todo',
    priority: 'medium',
    progress: 0,
    dueDate: new Date().toISOString().split('T')[0],
    subtasks: [],
    project: 'UI',
  },
];

export function DashboardContent() {
  // SWRを使用してタスクデータを取得
  const { tasks, todayTasks, upcomingTasks, isLoading, isError, toggleTaskStatus, deleteTask, mutate } = useTasks();
  // 認証情報を取得
  const { user } = useAuth();
  
  // タスクフォームモーダルの状態管理
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  
  // 現在の日付を取得
  const today = new Date();
  const formattedDate = format(today, 'yyyy年MM月dd日EEEE', { locale: ja });
  
  // タスク作成モーダルを開く
  const handleOpenCreateTaskModal = () => {
    setSelectedTask(undefined);
    setIsTaskFormOpen(true);
  };
  
  // タスク編集モーダルを開く
  const handleOpenEditTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };
  
  // タスクフォーム送信時の処理
  const handleTaskFormSubmit = async (data: any) => {
    try {
      if (selectedTask) {
        // タスク編集
        const response = await fetch(`/api/tasks/${selectedTask.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('タスクの更新に失敗しました');
        }
      } else {
        // 新規タスク作成
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('タスクの作成に失敗しました');
        }
      }
      
      // データを再取得
      mutate();
      // モーダルを閉じる
      setIsTaskFormOpen(false);
    } catch (error) {
      console.error('タスク保存エラー:', error);
    }
  };
  
  // タスクのステータス変更処理
  const handleToggleTaskStatus = async (taskId: string) => {
    await toggleTaskStatus(taskId);
  };
  
  // エラー状態の表示
  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 text-red-800 rounded-lg p-4 mb-4">
          <p>データの読み込み中にエラーが発生しました。</p>
          <p className="text-sm">しばらく経ってから再度お試しください。</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* ダッシュボードヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">ダッシュボード</h1>
          <p className="text-gray-500 text-sm mt-1">{formattedDate}</p>
        </div>
        
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button 
            onClick={handleOpenCreateTaskModal}
            className="flex items-center px-3 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>新規タスク</span>
          </button>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム: タスクリスト */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <>
              {/* 今日のタスク */}
              <TaskList
                title="## 今日のタスク"
                tasks={todayTasks}
                onTaskClick={handleOpenEditTaskModal}
                onCreateTask={handleOpenCreateTaskModal}
              />
              
              {/* 今後のタスク */}
              <TaskList
                title="## 今後のタスク"
                tasks={tasks.filter(task => {
                  if (!task.dueDate) return false;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dueDate = new Date(task.dueDate);
                  dueDate.setHours(0, 0, 0, 0);
                  return dueDate > today;
                })}
                onTaskClick={handleOpenEditTaskModal}
                onCreateTask={handleOpenCreateTaskModal}
              />
            </>
          )}
        </div>
        
        {/* 右カラム: AIコーチング */}
        <div className="space-y-6">
          <motion.div 
            className="bg-white rounded-lg border shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-medium">AIコーチング</h2>
            </div>
            <div className="h-[400px]">
              <AIChat />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* 新規タスク作成ボタン - モバイルでは固定表示 */}
      <div className="fixed bottom-6 right-6 z-10 sm:hidden">
        <motion.button
          className="w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
          onClick={handleOpenCreateTaskModal}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-5 w-5" />
        </motion.button>
      </div>
      
      {/* タスクフォームモーダル */}
      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskFormSubmit}
        onDelete={deleteTask}
        task={selectedTask}
      />
    </div>
  );
}
