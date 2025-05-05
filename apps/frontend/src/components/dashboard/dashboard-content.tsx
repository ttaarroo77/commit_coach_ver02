"use client";

import { useState } from 'react';
import { AIChat } from '@/components/ai-chat';
import { TaskSummaryCard } from '@/components/dashboard/task-summary-card';
import { Clock } from '@/components/dashboard/clock';
import { MiniCalendar } from '@/components/dashboard/mini-calendar';
import { TaskBoard } from '@/components/dashboard/task-board';
import { TaskFormModal } from '@/components/dashboard/task-form-modal';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { User, Settings, Calendar, CheckCircle, Plus } from 'lucide-react';

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
  const { todayTasks, upcomingTasks, taskCounts, isLoading, isError, toggleTaskStatus, deleteTask, mutate } = useTasks();
  // 認証情報を取得
  const { user } = useAuth();
  
  // タスクフォームモーダルの状態管理
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  
  // 日付が選択されたときの処理
  const handleDateSelect = (date: string) => {
    console.log(`選択された日付: ${date}`);
    // 将来的には選択された日付でフィルタリングする
    // 今後の実装: const { mutate } = useTasks({ dueDate: date });
  };
  
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
    } catch (error) {
      console.error('タスク保存エラー:', error);
    }
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
      {/* ユーザー情報カード - モバイルでは上部に表示 */}
      <motion.div 
        className="lg:col-span-3 bg-white rounded-lg border shadow-sm p-4 lg:p-6 mb-2 order-1 lg:order-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium">
                {user?.user_metadata?.name || 'ユーザー'} さん、こんにちは！
              </h2>
              <p className="text-sm text-gray-500">
                今日のタスク: {todayTasks.length}件 / 期限間近: {upcomingTasks.length}件
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>進行中</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* 左カラム: 今日のタスクと期限間近タスク */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {isLoading ? (
            <>
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TaskSummaryCard 
                  title="今日のタスク" 
                  icon="clock" 
                  tasks={todayTasks.length > 0 ? todayTasks : []}
                  onToggleTaskStatus={toggleTaskStatus}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <TaskSummaryCard 
                  title="期限間近のタスク" 
                  icon="alert" 
                  tasks={upcomingTasks.length > 0 ? upcomingTasks : []}
                  onToggleTaskStatus={toggleTaskStatus}
                />
              </motion.div>
            </>
          )}
        </div>
        
        {/* タスク管理セクション */}
        <div className="relative">
          {isLoading ? (
            <motion.div 
              className="bg-white rounded-lg border p-4 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            </motion.div>
          ) : (
            <TaskBoard onEditTask={handleOpenEditTaskModal} />
          )}
          
          {/* 新規タスク作成ボタン */}
          <motion.button
            className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors z-10"
            onClick={handleOpenCreateTaskModal}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </div>
      </div>
      
      {/* 右カラム: AIチャット、時計、カレンダー */}
      <div className="space-y-4 sm:space-y-6 order-3 lg:order-3 mb-4 lg:mb-0">
        {/* モバイルではAIチャットを小さく表示 */}
        <motion.div 
          className="h-[250px] sm:h-[300px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AIChat />
        </motion.div>
        
        {/* 時計とカレンダーをモバイルでは横並びに */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Clock />
          </motion.div>
          
          {isLoading ? (
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-4">
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <MiniCalendar 
                taskCounts={taskCounts}
                onDateSelect={handleDateSelect}
              />
            </motion.div>
          )}
        </div>
        
        {/* 進捗サマリーカード */}
        <motion.div 
          className="bg-white rounded-lg border shadow-sm p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-medium">今週の進捗</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>タスク完了率</span>
                <span className="font-medium">
                  {isLoading ? '計算中...' : 
                    `${Math.round((todayTasks.filter(t => t.status === 'completed').length / Math.max(todayTasks.length, 1)) * 100)}%`}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ 
                    width: isLoading ? '0%' : 
                      `${Math.round((todayTasks.filter(t => t.status === 'completed').length / Math.max(todayTasks.length, 1)) * 100)}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="pt-2 border-t text-xs text-gray-500">
              <div className="flex justify-between">
                <span>今週のコミット</span>
                <span className="font-medium">12件</span>
              </div>
            </div>
          </div>
        </motion.div>
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
