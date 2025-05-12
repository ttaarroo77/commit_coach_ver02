import { NextResponse } from 'next/server';
import { DashboardTask, DashboardTaskSchema } from '@commit-coach/shared-types';

// モックデータ（将来的にはSupabaseから取得）
const dashboardTasks: DashboardTask[] = [];

export async function GET(request: Request) {
   try {
      // URLからクエリパラメータを取得
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');
      const projectId = searchParams.get('projectId');

      // フィルタリング
      let filteredTasks = [...dashboardTasks];

      if (status) {
         filteredTasks = filteredTasks.filter(task => task.status === status);
      }

      if (projectId) {
         filteredTasks = filteredTasks.filter(task => task.projectId === projectId);
      }

      return NextResponse.json(filteredTasks);
   } catch (error) {
      console.error('ダッシュボードタスク取得エラー:', error);
      return NextResponse.json(
         { error: 'タスクの取得に失敗しました' },
         { status: 500 }
      );
   }
}

export async function POST(request: Request) {
   try {
      const taskData = await request.json();

      // バリデーション
      const validatedData = DashboardTaskSchema.omit({
         id: true,
         createdAt: true,
         updatedAt: true
      }).parse(taskData);

      // 新しいタスクの作成
      const newTask: DashboardTask = {
         ...validatedData,
         id: `task-${Date.now()}`,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
      };

      // モックデータに追加
      dashboardTasks.push(newTask);

      return NextResponse.json(newTask, { status: 201 });
   } catch (error) {
      console.error('ダッシュボードタスク作成エラー:', error);
      return NextResponse.json(
         { error: 'タスクの作成に失敗しました' },
         { status: 500 }
      );
   }
} 