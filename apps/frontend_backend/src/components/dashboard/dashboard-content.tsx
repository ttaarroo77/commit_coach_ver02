"use client";

import { useState } from 'react';
import { AIChat } from '@/components/ai-chat';
import { TaskFormModal } from '@/components/dashboard/task-form-modal';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Filter, Search, ChevronDown, ChevronRight } from 'lucide-react';
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
  const { tasks, isLoading, isError, toggleTaskStatus, deleteTask, mutate } = useTasks();
  // 認証情報を取得
  const { user } = useAuth();
  
  // タスクフォームモーダルの状態管理
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  
  // 現在の日付を取得
  const today = new Date();
  const formattedDate = format(today, 'yyyy/MM/dd (EEEE)', { locale: ja });
  const time = format(today, 'HH:mm', { locale: ja });
  
  // タスクのグループ化
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === todayDate.getTime();
  });
  
  // 未来のタスクをフィルタリング
  const futureTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() > todayDate.getTime();
  });
  
  // 展開状態を管理
  type GroupKey = 'today' | 'future';
  type ExpandedGroupsState = {
    [key in GroupKey]: boolean;
  };
  
  const [expandedGroups, setExpandedGroups] = useState<ExpandedGroupsState>({
    today: true,
    future: true
  });
  
  // グループの展開/折りたたみ切り替え
  const toggleGroup = (group: GroupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // タスクグループを管理するオブジェクト
  const taskGroups: Record<GroupKey, { title: string; tasks: Task[] }> = {
    today: {
      title: '今日のタスク',
      tasks: todayTasks
    },
    future: {
      title: '今後のタスク',
      tasks: futureTasks
    }
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
    <div className="flex h-full max-w-full overflow-hidden">
      {/* メインタスクリストエリア */}
      <div className="flex-1 overflow-auto px-3 py-2">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[10px] font-medium text-gray-800">ダッシュボード</h1>
            <div className="flex items-center">
              <p className="text-[9px] text-gray-500 font-medium">{formattedDate}</p>
              <p className="text-[9px] ml-1 font-medium text-[#31A9B8]">{time}</p>
            </div>
          </div>
          
          <motion.button 
            onClick={handleOpenCreateTaskModal}
            className="flex items-center px-1 py-0.5 bg-[#31A9B8] text-white rounded-[2px] text-[8px] hover:bg-[#2A95A2] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="h-2 w-2 mr-0.5" />
            <span>新規タスク</span>
          </motion.button>
        </div>
        
        {/* タスクリストエリア */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-white rounded-[2px] border shadow-sm p-1.5">
              <Skeleton className="h-3 w-20 mb-1.5" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <>
              {/* タスクグループを表示 */}
              {Object.entries(taskGroups).map(([key, group]) => (
                <div key={key} className="bg-white rounded-[2px] border overflow-hidden">
                  <div 
                    className="flex items-center justify-between py-0.5 px-1.5 border-b cursor-pointer"
                    onClick={() => toggleGroup(key as GroupKey)}
                  >
                    <div className="flex items-center">
                      {expandedGroups[key as GroupKey] ? 
                        <ChevronDown className="h-2.5 w-2.5 text-gray-400 mr-1" /> : 
                        <ChevronRight className="h-2.5 w-2.5 text-gray-400 mr-1" />
                      }
                      <h2 className="text-[8px] font-medium text-gray-700">{group.title}</h2>
                    </div>
                    <span className="text-[7px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded-[2px]">
                      {group.tasks.length}
                    </span>
                  </div>
                  
                  {expandedGroups[key as GroupKey] && (
                    <TaskList
                      title=""
                      tasks={group.tasks}
                      onTaskClick={handleOpenEditTaskModal}
                      onStatusToggle={handleToggleTaskStatus}
                      onCreateTask={handleOpenCreateTaskModal}
                    />
                  )}
                </div>
              ))}
              
              {/* タスクが一つもない場合 */}
              {tasks.length === 0 && (
                <div className="bg-white rounded-[2px] border p-2 text-center">
                  <p className="text-[8px] text-gray-500">タスクがまだありません</p>
                  <motion.button
                    onClick={handleOpenCreateTaskModal}
                    className="mt-1.5 flex items-center px-1.5 py-0.5 bg-[#31A9B8] text-white rounded-[2px] text-[8px] mx-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="h-2 w-2 mr-0.5" />
                    <span>新規タスクを作成</span>
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* AIコーチングエリア */}
      <div className="w-[250px] bg-white border-l border-gray-100 overflow-hidden flex flex-col">
        <div className="px-2 py-1 border-b border-gray-100">
          <h2 className="text-[10px] font-medium text-gray-700">AIコーチング</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <AIChat />
        </div>
      </div>
      
      {/* 新規タスク作成ボタン - モバイルでは固定表示 */}
      <div className="fixed bottom-3 right-3 z-10 md:hidden">
        <motion.button
          className="w-8 h-8 rounded-full bg-[#31A9B8] text-white shadow-sm flex items-center justify-center"
          onClick={handleOpenCreateTaskModal}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-3 w-3" />
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
