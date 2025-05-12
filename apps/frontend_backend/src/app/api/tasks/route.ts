import { NextResponse } from 'next/server';
import { Task } from '@/types/task';

// モックデータ（将来的にはSupabaseから取得）
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
  {
    id: '3',
    title: 'APIエンドポイントのテスト作成',
    description: 'JestとSupertestを使用',
    status: 'todo',
    priority: 'high',
    progress: 0,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 明日
    subtasks: [],
    project: 'Backend',
  },
  {
    id: '4',
    title: 'プロジェクト設定の最適化',
    description: 'ビルド時間の短縮',
    status: 'todo',
    priority: 'low',
    progress: 0,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 明後日
    subtasks: [
      { id: '4-1', title: 'webpack設定の見直し', completed: false },
    ],
    project: 'DevOps',
  },
  {
    id: '5',
    title: 'セキュリティ監査の実施',
    description: 'OWASP Top 10に基づく',
    status: 'todo',
    priority: 'high',
    progress: 0,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3日後
    subtasks: [],
    project: 'Security',
  },
];

export async function GET(request: Request) {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const project_id = searchParams.get('project_id');
    const dueDate = searchParams.get('dueDate');
    const priority = searchParams.get('priority');
    
    // フィルタリング
    let filteredTasks = [...tasks];
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    if (project_id) {
      filteredTasks = filteredTasks.filter(task => task.project_id === project_id);
    }
    
    if (dueDate) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate.split('T')[0] === dueDate;
      });
    }
    
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    
    // 遅延をシミュレート（開発時のみ）
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(filteredTasks);
  } catch (error) {
    console.error('タスク取得エラー:', error);
    return NextResponse.json(
      { error: 'タスクの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    
    // 実際のアプリケーションではここでデータベース更新処理を行う
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('タスク更新エラー:', error);
    return NextResponse.json(
      { error: 'タスクの更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const taskData = await request.json();
    
    // 実際のアプリケーションではここでデータベース登録処理を行う
    // モックデータの作成（開発用）
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      progress: 0,
      subtasks: taskData.subtasks || [],
      project: taskData.project || '',
      dueDate: taskData.dueDate || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // モックデータに追加
    tasks.unshift(newTask);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('タスク作成エラー:', error);
    return NextResponse.json(
      { error: 'タスクの作成に失敗しました' },
      { status: 500 }
    );
  }
}
