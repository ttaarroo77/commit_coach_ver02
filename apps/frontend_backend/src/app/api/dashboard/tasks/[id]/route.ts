import { NextRequest, NextResponse } from 'next/server';
import { DashboardTask, DashboardTaskSchema } from '@commit-coach/shared-types';

// モックデータ（親ルートと共有）
const dashboardTasks: DashboardTask[] = [];

type Params = {
   id: string;
};

export async function GET(
   request: NextRequest,
   { params }: { params: Params }
) {
   try {
      const id = params.id;
      const task = dashboardTasks.find(t => t.id === id);

      if (!task) {
         return NextResponse.json(
            { error: 'タスクが見つかりません' },
            { status: 404 }
         );
      }

      return NextResponse.json(task);
   } catch (error) {
      console.error('ダッシュボードタスク取得エラー:', error);
      return NextResponse.json(
         { error: 'タスクの取得に失敗しました' },
         { status: 500 }
      );
   }
}

export async function PATCH(
   request: NextRequest,
   { params }: { params: Params }
) {
   try {
      const id = params.id;
      const updates = await request.json();

      // バリデーション
      const validatedUpdates = DashboardTaskSchema.partial().parse(updates);

      const taskIndex = dashboardTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
         return NextResponse.json(
            { error: 'タスクが見つかりません' },
            { status: 404 }
         );
      }

      // タスクの更新
      dashboardTasks[taskIndex] = {
         ...dashboardTasks[taskIndex],
         ...validatedUpdates,
         updatedAt: new Date().toISOString()
      };

      return NextResponse.json(dashboardTasks[taskIndex]);
   } catch (error) {
      console.error('ダッシュボードタスク更新エラー:', error);
      return NextResponse.json(
         { error: 'タスクの更新に失敗しました' },
         { status: 500 }
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Params }
) {
   try {
      const id = params.id;

      const taskIndex = dashboardTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
         return NextResponse.json(
            { error: 'タスクが見つかりません' },
            { status: 404 }
         );
      }

      // タスクの削除
      const deletedTask = dashboardTasks[taskIndex];
      dashboardTasks.splice(taskIndex, 1);

      return NextResponse.json({ success: true, deletedTask });
   } catch (error) {
      console.error('ダッシュボードタスク削除エラー:', error);
      return NextResponse.json(
         { error: 'タスクの削除に失敗しました' },
         { status: 500 }
      );
   }
} 