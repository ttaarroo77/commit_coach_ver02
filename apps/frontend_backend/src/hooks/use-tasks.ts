import useSWR from 'swr';
import { Task } from '@/types/task';
import { useAuth } from '@/hooks/use-auth';

// APIからデータを取得するfetcher関数
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('タスクデータの取得に失敗しました');
  }
  return res.json();
};

export interface UseTasksOptions {
  status?: string;
  project_id?: string;
  dueDate?: string;
  priority?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { user } = useAuth();
  const userId = user?.id;

  // クエリパラメータの構築
  const queryParams = new URLSearchParams();
  if (options.status) queryParams.append('status', options.status);
  if (options.project_id) queryParams.append('project_id', options.project_id);
  if (options.dueDate) queryParams.append('dueDate', options.dueDate);
  if (options.priority) queryParams.append('priority', options.priority);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  // 開発モードかどうかを確認
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // SWRを使用してデータをフェッチ
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    // 開発モードまたはユーザーIDが存在する場合にAPIリクエストを送信
    isDevelopment || userId ? `/api/tasks${queryString}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10秒間は同じリクエストを重複して行わない
    }
  );

  // 今日のタスクを取得
  const todayTasks = data?.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }) || [];

  // 期限間近のタスク（3日以内）を取得
  const upcomingTasks = data?.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  }) || [];

  // タスクのステータスを切り替える関数
  const toggleTaskStatus = async (taskId: string) => {
    const task = data?.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    
    try {
      // オプティミスティックUIアップデート
      mutate(
        data?.map(t => t.id === taskId ? { ...t, status: newStatus } : t),
        false
      );
      
      // APIリクエスト
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
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
  };

  // 日付ごとのタスク数を取得
  const getTaskCountsByDate = () => {
    if (!data) return [];
    
    const counts: { date: string; count: number }[] = [];
    const tasksByDate: Record<string, number> = {};
    
    data.forEach(task => {
      if (task.dueDate) {
        const dateStr = task.dueDate.split('T')[0]; // YYYY-MM-DD形式に変換
        tasksByDate[dateStr] = (tasksByDate[dateStr] || 0) + 1;
      }
    });
    
    Object.entries(tasksByDate).forEach(([date, count]) => {
      counts.push({ date, count });
    });
    
    return counts;
  };

  // タスク削除機能
  const deleteTask = async (taskId: string) => {
    try {
      // オプティミスティックUIアップデート
      mutate(
        data?.filter(t => t.id !== taskId),
        false
      );
      
      // APIリクエスト
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('タスクの削除に失敗しました');
      }
      
      // データを再検証
      mutate();
    } catch (error) {
      console.error('タスク削除エラー:', error);
      // エラー時に元のデータに戻す
      mutate();
    }
  };

  return {
    tasks: data || [],
    todayTasks,
    upcomingTasks,
    taskCounts: getTaskCountsByDate(),
    isLoading,
    isError: error,
    mutate,
    toggleTaskStatus,
    deleteTask,
  };
}
