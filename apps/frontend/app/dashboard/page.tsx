'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus,
  RefreshCw,
  ArrowDown,
  ArrowUp,
  SplitSquareVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { AICoach } from '@/components/dashboard/ai-coach';
import { TaskGroup, Task as TaskType, SubTask } from '@/components/dashboard/task-group';
import { isDateOverdue } from '@/components/dashboard/editable-text';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  
  // タスクグループ
  const [taskGroups, setTaskGroups] = useState<{
    id: string;
    title: string;
    expanded: boolean;
    tasks: TaskType[];
    dueDate?: string;
    completed: boolean;
  }[]>([]);

  useEffect(() => {
    // 現在時刻の更新
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        setIsLoading(true);
        
        // ユーザー情報の取得
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        }
        
        // モックデータを使用してタスクグループを初期化
        const initialTaskGroups = [
          {
            id: 'today',
            title: '今日のタスク',
            expanded: true,
            tasks: [
              {
                id: '1',
                title: 'フロントエンド認証フロー実装',
                status: 'completed' as 'todo' | 'in-progress' | 'completed',
                project: 'ウェブアプリ開発',
                priority: 'high',
                progress: 100,
                subtasks: [
                  { id: '1-1', title: 'ログインページの実装', completed: true },
                  { id: '1-2', title: '新規登録ページの実装', completed: true },
                  { id: '1-3', title: 'パスワードリセットの実装', completed: true }
                ],
                expanded: false,
                dueDate: '2025-04-27'
              },
              {
                id: '2',
                title: 'ダッシュボード画面の実装',
                status: 'in-progress' as 'todo' | 'in-progress' | 'completed',
                project: 'ウェブアプリ開発',
                priority: 'high',
                progress: 50,
                subtasks: [
                  { id: '2-1', title: 'レイアウト設計', completed: true },
                  { id: '2-2', title: 'タスク一覧コンポーネント', completed: true },
                  { id: '2-3', title: 'AIコーチングコンポーネント', completed: false },
                  { id: '2-4', title: '統計情報の表示', completed: false }
                ],
                expanded: true,
                dueDate: '2025-04-28'
              }
            ],
            dueDate: '2025-04-27',
            completed: false
          },
          {
            id: 'upcoming',
            title: '今後のタスク',
            expanded: true,
            tasks: [
              {
                id: '3',
                title: 'タスク管理機能の実装',
                status: 'todo' as 'todo' | 'in-progress' | 'completed',
                project: 'ウェブアプリ開発',
                priority: 'medium',
                progress: 0,
                subtasks: [
                  { id: '3-1', title: 'タスク作成フォーム', completed: false },
                  { id: '3-2', title: 'タスク編集機能', completed: false },
                  { id: '3-3', title: 'タスク削除機能', completed: false }
                ],
                expanded: false,
                dueDate: '2025-04-30'
              },
              {
                id: '4',
                title: 'AIコーチング機能の実装',
                status: 'todo' as 'todo' | 'in-progress' | 'completed',
                project: 'ウェブアプリ開発',
                priority: 'medium',
                progress: 0,
                subtasks: [
                  { id: '4-1', title: 'AIチャットインターフェース', completed: false },
                  { id: '4-2', title: 'コミット提案機能', completed: false },
                  { id: '4-3', title: 'コード分析機能', completed: false }
                ],
                expanded: false,
                dueDate: '2025-05-05'
              }
            ],
            dueDate: undefined,
            completed: false
          },
          {
            id: 'completed',
            title: '完了したタスク',
            expanded: false,
            tasks: [
              {
                id: '5',
                title: '環境構築',
                status: 'completed' as 'todo' | 'in-progress' | 'completed',
                project: 'チーム管理',
                priority: 'high',
                progress: 100,
                subtasks: [
                  { id: '5-1', title: 'Next.js設定', completed: true },
                  { id: '5-2', title: 'Supabase接続', completed: true },
                  { id: '5-3', title: 'デプロイパイプライン', completed: true }
                ],
                expanded: false,
                dueDate: '2025-04-20'
              }
            ],
            dueDate: undefined,
            completed: true
          }
        ];
        
        setTaskGroups(initialTaskGroups);
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndTasks();
  }, []);
  
  // タスクを期限順にソートする
  const sortTasksByDueDate = (order: 'asc' | 'desc' | 'none') => {
    setSortOrder(order);
    
    if (order === 'none') {
      // 元の順序に戻す処理（ここでは簡略化のため省略）
      return;
    }
    
    setTaskGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        tasks: [...group.tasks].sort((a, b) => {
          if (!a.dueDate) return order === 'asc' ? 1 : -1;
          if (!b.dueDate) return order === 'asc' ? -1 : 1;
          
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();
          
          return order === 'asc' ? dateA - dateB : dateB - dateA;
        })
      }))
    );
  };
  
  // タスクグループの展開/折りたたみを切り替える
  const toggleTaskGroup = (groupId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId ? { ...group, expanded: !group.expanded } : group
      )
    );
  };
  
  // タスクの展開/折りたたみを切り替える
  const toggleTask = (groupId: string, taskId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId ? { ...task, expanded: !task.expanded } : task
              )
            }
          : group
      )
    );
  };
  
  // タスクタイトルを更新
  const updateTaskTitle = (groupId: string, taskId: string, newTitle: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId ? { ...task, title: newTitle } : task
              )
            }
          : group
      )
    );
  };
  
  // サブタスクタイトルを更新
  const updateSubtaskTitle = (groupId: string, taskId: string, subtaskId: string, newTitle: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      subtasks: task.subtasks.map(subtask =>
                        subtask.id === subtaskId ? { ...subtask, title: newTitle } : subtask
                      )
                    }
                  : task
              )
            }
          : group
      )
    );
  };
  
  // タスクの完了状態を切り替える
  const toggleTaskStatus = (groupId: string, taskId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      status: task.status === 'completed' ? 'todo' : 'completed',
                      // タスクが完了に変わった場合、すべてのサブタスクも完了にする
                      subtasks:
                        task.status !== 'completed'
                          ? task.subtasks.map(subtask => ({ ...subtask, completed: true }))
                          : task.subtasks,
                      // 進捗率を更新
                      progress: task.status !== 'completed' ? 100 : calculateProgress(task.subtasks)
                    }
                  : task
              )
            }
          : group
      )
    );
  };
  
  // サブタスクの完了状態を切り替える
  const toggleSubtaskCompleted = (groupId: string, taskId: string, subtaskId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      subtasks: task.subtasks.map(subtask =>
                        subtask.id === subtaskId
                          ? { ...subtask, completed: !subtask.completed }
                          : subtask
                      ),
                      // 親タスクのステータスと進捗率を更新
                      status:
                        task.subtasks.every(s => s.id === subtaskId ? !s.completed : s.completed)
                          ? 'completed'
                          : task.status === 'completed' ? 'in-progress' : task.status
                    }
                  : task
              ).map(task => ({
                ...task,
                progress: calculateProgress(task.subtasks)
              }))
            }
          : group
      )
    );
  };
  
  // 進捗率を計算
  const calculateProgress = (subtasks: SubTask[]) => {
    if (subtasks.length === 0) return 0;
    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / subtasks.length) * 100);
  };
  
  // 新しいタスクを追加
  const addTask = (groupId: string) => {
    const newTask: TaskType = {
      id: `task-${Date.now()}`,
      title: '新しいタスク',
      status: 'todo',
      project: 'ウェブアプリ開発',
      priority: 'medium',
      progress: 0,
      subtasks: [],
      expanded: true,
      dueDate: new Date().toISOString().split('T')[0]
    };
    
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, tasks: [...group.tasks, newTask] }
          : group
      )
    );
  };
  
  // 新しいサブタスクを追加
  const addSubtask = (groupId: string, taskId: string) => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: '新しいサブタスク',
      completed: false
    };
    
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId
                  ? { ...task, subtasks: [...task.subtasks, newSubtask] }
                  : task
              )
            }
          : group
      )
    );
  };
  
  // タスクを削除
  const deleteTask = (groupId: string, taskId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, tasks: group.tasks.filter(task => task.id !== taskId) }
          : group
      )
    );
  };
  
  // サブタスクを削除
  const deleteSubtask = (groupId: string, taskId: string, subtaskId: string) => {
    setTaskGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
                    }
                  : task
              ).map(task => ({
                ...task,
                progress: calculateProgress(task.subtasks)
              }))
            }
          : group
      )
    );
  };
  
  // 時刻表示のフォーマット
  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };
  
  // 日付表示のフォーマット
  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userName ? `こんにちは、${userName}さん` : 'ダッシュボード'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {formatDateDisplay(currentTime)}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTimeDisplay(currentTime)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => sortTasksByDueDate('asc')} 
                    className={sortOrder === 'asc' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}>
                    <ArrowUp className="h-4 w-4 mr-1" />
                    期限順
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => sortTasksByDueDate('desc')}
                    className={sortOrder === 'desc' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}>
                    <ArrowDown className="h-4 w-4 mr-1" />
                    期限逆順
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => sortTasksByDueDate('none')}
                    className={sortOrder === 'none' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    リセット
                  </Button>
                </div>
              </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CalendarDays className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                  今日のタスク
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {taskGroups.find(g => g.id === 'today')?.tasks.length || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">今日期限のタスク</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" />
                  進行中
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {taskGroups.flatMap(g => g.tasks).filter(t => t.status === 'in-progress').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">進行中のタスク</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  完了
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {taskGroups.flatMap(g => g.tasks).filter(t => t.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">完了したタスク</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {taskGroups.map(group => (
              <TaskGroup
                key={group.id}
                id={group.id}
                title={group.title}
                expanded={group.expanded}
                tasks={group.tasks}
                dueDate={group.dueDate}
                completed={group.completed}
                onToggleExpand={toggleTaskGroup}
                onToggleTask={(taskId) => toggleTask(group.id, taskId)}
                onUpdateTaskTitle={(taskId, title) => updateTaskTitle(group.id, taskId, title)}
                onUpdateSubtaskTitle={(taskId, subtaskId, title) => 
                  updateSubtaskTitle(group.id, taskId, subtaskId, title)}
                onToggleTaskStatus={(taskId) => toggleTaskStatus(group.id, taskId)}
                onToggleSubtaskCompleted={(taskId, subtaskId) => 
                  toggleSubtaskCompleted(group.id, taskId, subtaskId)}
                onAddTask={() => addTask(group.id)}
                onAddSubtask={(taskId) => addSubtask(group.id, taskId)}
                onDeleteTask={(taskId) => deleteTask(group.id, taskId)}
                onDeleteSubtask={(taskId, subtaskId) => 
                  deleteSubtask(group.id, taskId, subtaskId)}
              />
            ))}
          </div>
        </div>
        
        {/* AIコーチング */}
        <div className="w-96 border-l bg-gray-50 dark:bg-gray-900 p-4 overflow-auto">
          <AICoach />
        </div>
      </main>
    </div>
  </div>
);
