import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/types/task';

// モックデータ（将来的にはSupabaseから取得）
// 実際のアプリケーションでは、親ルートと共有するデータストアを使用します
const tasks: Task[] = [
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
  // 他のタスクは省略
];

type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const id = params.id;
    const task = tasks.find(t => t.id === id);

    if (!task) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('タスク取得エラー:', error);
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

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      );
    }

    // 実際のアプリケーションではここでデータベース更新処理を行う
    // モックデータの更新（開発用）
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    console.error('タスク更新エラー:', error);
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

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      );
    }

    // 実際のアプリケーションではここでデータベース削除処理を行う
    // モックデータの削除（開発用）
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);

    return NextResponse.json({ success: true, deletedTask });
  } catch (error) {
    console.error('タスク削除エラー:', error);
    return NextResponse.json(
      { error: 'タスクの削除に失敗しました' },
      { status: 500 }
    );
  }
}
