import { Task } from '@/types/task';

interface DashboardItem {
   id: string;
   title: string;
   description: string;
   icon: string;
   value: number;
   change: number;
   changeType: 'increase' | 'decrease';
}

// モックデータ
const mockTasks: Task[] = [
   {
      id: '1',
      title: 'プロジェクト計画の作成',
      description: 'Q2のプロジェクト計画を策定する',
      status: 'in_progress',
      priority: 'high',
      projectId: '1',
      assigneeId: '1',
      dueDate: '2024-04-30',
      startDate: '2024-04-01',
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
      tags: ['計画', '重要'],
      subtasks: [
         {
            id: '1-1',
            title: 'スケジュール作成',
            completed: false
         },
         {
            id: '1-2',
            title: 'リソース配分の検討',
            completed: false
         }
      ]
   },
   {
      id: '2',
      title: '週次レビューミーティング',
      description: 'チームの進捗状況を確認する',
      status: 'todo',
      priority: 'medium',
      projectId: '1',
      assigneeId: '1',
      dueDate: '2024-04-05',
      startDate: '2024-04-05T10:00:00Z',
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
      tags: ['ミーティング'],
      subtasks: []
   }
];

export async function getDashboardItems(): Promise<DashboardItem[]> {
   // 実際のAPIが実装されるまでのモックデータ
   return [
      {
         id: '1',
         title: '総タスク数',
         description: '今月のタスク総数',
         icon: '📋',
         value: mockTasks.length,
         change: 2,
         changeType: 'increase'
      },
      {
         id: '2',
         title: '完了タスク',
         description: '今月完了したタスク',
         icon: '✅',
         value: mockTasks.filter(task => task.status === 'completed').length,
         change: 1,
         changeType: 'increase'
      },
      {
         id: '3',
         title: '進行中タスク',
         description: '現在進行中のタスク',
         icon: '🔄',
         value: mockTasks.filter(task => task.status === 'in_progress').length,
         change: 0,
         changeType: 'increase'
      },
      {
         id: '4',
         title: '未着手タスク',
         description: 'まだ開始していないタスク',
         icon: '⏳',
         value: mockTasks.filter(task => task.status === 'todo').length,
         change: -1,
         changeType: 'decrease'
      }
   ];
}

export async function getRecentTasks(): Promise<Task[]> {
   // 実際のAPIが実装されるまでのモックデータ
   return mockTasks;
}

export async function getUpcomingTasks(): Promise<Task[]> {
   // 実際のAPIが実装されるまでのモックデータ
   return mockTasks.filter(task => task.status === 'todo');
}

export async function getCompletedTasks(): Promise<Task[]> {
   // 実際のAPIが実装されるまでのモックデータ
   return mockTasks.filter(task => task.status === 'completed');
} 