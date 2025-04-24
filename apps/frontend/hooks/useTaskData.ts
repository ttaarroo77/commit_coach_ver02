import useSWR from 'swr';
import type { TaskGroup } from '@/types/dashboard';

// モックデータのフェッチャー関数
const fetchTasks = async (): Promise<TaskGroup[]> => {
  // 実際のAPIが実装されるまでは、モックデータを返す
  // 将来的には `/api/tasks` などのエンドポイントからデータを取得する
  return new Promise((resolve) => {
    // APIレスポンスを模倣するために少し遅延させる
    setTimeout(() => {
      resolve([
        {
          id: "today",
          title: "今日のタスク",
          expanded: true,
          completed: false,
          tasks: [
            {
              id: "1",
              title: "朝のミーティング",
              startTime: "09:00",
              endTime: "10:00",
              status: "completed",
              createdAt: new Date("2025-04-23").toISOString(),
              updatedAt: new Date("2025-04-23").toISOString(),
              projectId: "team-management",
              priority: "medium",
              progress: 100,
              expanded: false,
              subtasks: [
                { id: "1-1", title: "議事録作成", completed: true },
                { id: "1-2", title: "タスク割り当て", completed: true },
              ],
            },
            {
              id: "2",
              title: "ログイン機能の実装",
              startTime: "10:00",
              endTime: "13:00",
              status: "completed",
              createdAt: new Date("2025-04-23").toISOString(),
              updatedAt: new Date("2025-04-23").toISOString(),
              projectId: "web-app-development",
              priority: "high",
              progress: 100,
              expanded: false,
              subtasks: [
                { id: "2-1", title: "UI設計", completed: true },
                { id: "2-2", title: "バックエンド連携", completed: true },
                { id: "2-3", title: "テスト", completed: true },
              ],
            },
            {
              id: "3",
              title: "ランチミーティング",
              startTime: "13:00",
              endTime: "14:00",
              status: "completed",
              createdAt: new Date("2025-04-23").toISOString(),
              updatedAt: new Date("2025-04-23").toISOString(),
              projectId: "team-management",
              priority: "low",
              progress: 100,
              expanded: false,
              subtasks: [],
            },
            {
              id: "4",
              title: "APIエンドポイントの実装",
              startTime: "14:00",
              endTime: "16:00",
              status: "in-progress",
              projectId: "web-app-development",
              priority: "high",
              progress: 50,
              dueDate: "2025-04-24",
              createdAt: new Date("2025-04-20").toISOString(),
              updatedAt: new Date("2025-04-23").toISOString(),
              expanded: false,
              subtasks: [
                { id: "4-1", title: "認証エンドポイント", completed: true },
                { id: "4-2", title: "ユーザー管理API", completed: false },
                { id: "4-3", title: "データ取得API", completed: false },
              ],
            },
            {
              id: "5",
              title: "ダッシュボード画面のデザイン",
              startTime: "16:00",
              endTime: "18:00",
              status: "todo",
              projectId: "design-project",
              priority: "medium",
              progress: 0,
              dueDate: "2025-04-25",
              createdAt: new Date("2025-04-20").toISOString(),
              updatedAt: new Date("2025-04-22").toISOString(),
              expanded: false,
              subtasks: [
                { id: "5-1", title: "ワイヤーフレーム作成", completed: false },
                { id: "5-2", title: "コンポーネント設計", completed: false },
                { id: "5-3", title: "レスポンシブ対応", completed: false },
              ],
            },
          ],
        },
        {
          id: "unscheduled",
          title: "未定のタスク",
          expanded: true,
          completed: false,
          tasks: [
            {
              id: "6",
              title: "レスポンシブデザインの実装",
              status: "todo",
              projectId: "web-app-development",
              priority: "medium",
              progress: 0,
              dueDate: "2025-04-30",
              createdAt: new Date("2025-04-15").toISOString(),
              updatedAt: new Date("2025-04-20").toISOString(),
              expanded: false,
              subtasks: [
                { id: "6-1", title: "モバイル対応", completed: false },
                { id: "6-2", title: "タブレット対応", completed: false },
              ],
            },
            {
              id: "7",
              title: "ユーザー設定画面の作成",
              status: "todo",
              projectId: "web-app-development",
              priority: "low",
              progress: 0,
              dueDate: "2025-05-05",
              createdAt: new Date("2025-04-10").toISOString(),
              updatedAt: new Date("2025-04-15").toISOString(),
              expanded: false,
              subtasks: [
                { id: "7-1", title: "プロフィール編集機能", completed: false },
                { id: "7-2", title: "パスワード変更機能", completed: false },
                { id: "7-3", title: "通知設定機能", completed: false },
              ],
            },
            {
              id: "8",
              title: "テスト計画書の作成",
              status: "todo",
              projectId: "qa-project",
              priority: "high",
              progress: 0,
              dueDate: "2025-04-28",
              createdAt: new Date("2025-04-18").toISOString(),
              updatedAt: new Date("2025-04-21").toISOString(),
              expanded: false,
              subtasks: [
                { id: "8-1", title: "テスト範囲の定義", completed: false },
                { id: "8-2", title: "テストケースの作成", completed: false },
              ],
            },
          ],
        },
        {
          id: "upcoming",
          title: "今後のタスク",
          expanded: true,
          completed: false,
          tasks: [
            {
              id: "9",
              title: "週次レビュー",
              status: "todo",
              projectId: "team-management",
              priority: "high",
              progress: 0,
              dueDate: "2025-04-26",
              createdAt: new Date("2025-04-19").toISOString(),
              updatedAt: new Date("2025-04-22").toISOString(),
              expanded: false,
              subtasks: [
                { id: "9-1", title: "進捗確認", completed: false },
                { id: "9-2", title: "課題抽出", completed: false },
                { id: "9-3", title: "次週計画", completed: false },
              ],
            },
            {
              id: "10",
              title: "デプロイ準備",
              status: "todo",
              projectId: "infrastructure",
              priority: "medium",
              progress: 0,
              dueDate: "2025-05-10",
              createdAt: new Date("2025-04-01").toISOString(),
              updatedAt: new Date("2025-04-10").toISOString(),
              expanded: false,
              subtasks: [
                { id: "10-1", title: "環境構築", completed: false },
                { id: "10-2", title: "CI/CD設定", completed: false },
              ],
            },
          ],
        }
      ]);
    }, 500);
  });
};

export function useTaskData() {
  const { data, error, isLoading, mutate } = useSWR<TaskGroup[]>('tasks', fetchTasks, {
    revalidateOnFocus: false, // フォーカス時に再取得しない
    revalidateOnReconnect: false, // 再接続時に再取得しない
    dedupingInterval: 60000, // 1分間は同じリクエストをキャッシュ
  });

  return {
    taskGroups: data || [],
    isLoading,
    isError: error,
    mutate, // データを手動で更新するための関数
  };
}
