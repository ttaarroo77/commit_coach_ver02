'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import { ProjectWithStats, ProjectFormValues } from '@/types/project';
import { Task } from '@/components/dashboard/task-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectForm } from '@/components/projects/project-form';
import { DraggableTask } from '@/components/dashboard/draggable-task';
import { AddTaskButton } from '@/components/dashboard/add-task-button';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { ArrowLeft, Calendar, Clock, Edit, Trash2, Users, LayoutKanban } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import { FadeIn, AnimatedList } from '@/components/ui/animations';

// モックタスクデータ
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'デザインカンプの作成',
    description: 'トップページと主要機能のデザインカンプを作成する',
    status: 'completed',
    priority: 'high',
    due_date: new Date(2025, 4, 5).toISOString(),
    created_at: new Date(2025, 3, 20).toISOString(),
    updated_at: new Date(2025, 3, 25).toISOString(),
    project_id: '1',
    subtasks: [
      { id: '1-1', title: 'ワイヤーフレーム作成', completed: true },
      { id: '1-2', title: 'カラーパレット決定', completed: true },
      { id: '1-3', title: 'フォント選定', completed: true },
    ]
  },
  {
    id: '2',
    title: 'フロントエンド実装',
    description: 'React/Next.jsを使用したフロントエンド実装',
    status: 'in_progress',
    priority: 'medium',
    due_date: new Date(2025, 4, 15).toISOString(),
    created_at: new Date(2025, 3, 22).toISOString(),
    updated_at: new Date(2025, 3, 26).toISOString(),
    project_id: '1',
    subtasks: [
      { id: '2-1', title: 'コンポーネント設計', completed: true },
      { id: '2-2', title: 'ルーティング実装', completed: true },
      { id: '2-3', title: 'APIとの連携', completed: false },
    ]
  },
  {
    id: '3',
    title: 'バックエンド開発',
    description: 'Node.js/Expressを使用したAPI開発',
    status: 'todo',
    priority: 'high',
    due_date: new Date(2025, 4, 20).toISOString(),
    created_at: new Date(2025, 3, 24).toISOString(),
    updated_at: new Date(2025, 3, 24).toISOString(),
    project_id: '1',
    subtasks: [
      { id: '3-1', title: 'データベース設計', completed: false },
      { id: '3-2', title: 'APIエンドポイント実装', completed: false },
      { id: '3-3', title: '認証機能実装', completed: false },
    ]
  }
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { allProjects, updateProject, deleteProject } = useProjects();
  
  const [project, setProject] = useState<ProjectWithStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // プロジェクトデータの取得
  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      
      try {
        // プロジェクト情報の取得
        const foundProject = allProjects.find(p => p.id === projectId);
        
        if (!foundProject) {
          router.push('/projects');
          return;
        }
        
        setProject(foundProject);
        
        // タスク情報の取得（モックデータ）
        // TODO: Supabase実装
        // パフォーマンス最適化: 不要なタイムアウトを短縮
        setTimeout(() => {
          setTasks(mockTasks);
          setIsLoading(false);
        }, 100);
      } catch (error) {
        console.error('Error fetching project data:', error);
        alert('プロジェクト情報の取得に失敗しました');
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId, allProjects, router]);

  const handleUpdateProject = useCallback(async (values: ProjectFormValues) => {
    if (!project) return;
    
    try {
      await updateProject(project.id, values);
      alert(`プロジェクト「${values.name}」を更新しました`);
      setIsEditModalOpen(false);
    } catch (err) {
      alert('エラーが発生しました: 更新中に問題が発生しました。もう一度お試しください。');
    }
  }, [project, updateProject]);

  const handleDeleteProject = useCallback(async () => {
    if (!project) return;
    
    if (!confirm(`プロジェクト「${project.name}」を削除してもよろしいですか？この操作は元に戻せません。`)) {
      return;
    }
    
    try {
      await deleteProject(project.id);
      alert('プロジェクトを削除しました');
      router.push('/projects');
    } catch (err) {
      alert('エラーが発生しました: 削除中に問題が発生しました。もう一度お試しください。');
    }
  }, [project, deleteProject, router]);

  // タスク関連の仮実装（実際にはダッシュボードと同様の実装が必要）
  const handleToggleTask = useCallback((taskId: string) => {
    console.log('タスク切り替え:', taskId);
  }, []);

  const handleUpdateTaskTitle = useCallback((taskId: string, title: string) => {
    console.log('タスクタイトル更新:', taskId, title);
  }, []);

  const handleUpdateSubtaskTitle = useCallback((taskId: string, subtaskId: string, title: string) => {
    console.log('サブタスクタイトル更新:', taskId, subtaskId, title);
  }, []);

  const handleToggleTaskStatus = useCallback((taskId: string) => {
    console.log('タスクステータス切り替え:', taskId);
  }, []);

  const handleToggleSubtaskCompleted = useCallback((taskId: string, subtaskId: string) => {
    console.log('サブタスク完了切り替え:', taskId, subtaskId);
  }, []);

  const handleAddSubtask = useCallback((taskId: string, title: string) => {
    console.log('サブタスク追加:', taskId, title);
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    console.log('タスク削除:', taskId);
  }, []);

  const handleDeleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    console.log('サブタスク削除:', taskId, subtaskId);
  }, []);

  const handleTaskSubmit = useCallback((task: Partial<Task>) => {
    console.log('タスク送信:', task);
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case 'in-progress':
        return <Badge variant="warning">進行中</Badge>;
      case 'completed':
        return <Badge variant="success">完了</Badge>;
      case 'archived':
        return <Badge variant="secondary">アーカイブ</Badge>;
      default:
        return <Badge>未着手</Badge>;
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
    } catch (error) {
      return '日付なし';
    }
  }, []);

  // ローディング状態とプロジェクトが存在しない場合のメモ化されたコンポーネント
  const LoadingOrNotFound = useMemo(() => {
    if (isLoading || !project) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
          </div>
        </div>
      );
    }
    return null;
  }, [isLoading, project]);

  if (isLoading || !project) {
    return LoadingOrNotFound;
  if (!project) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">プロジェクトが見つかりません</h1>
        <p className="mb-6">指定されたプロジェクトは存在しないか、アクセス権がありません。</p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            プロジェクト一覧に戻る
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              プロジェクト一覧に戻る
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                {getStatusBadge(project.status)}
              </div>
              {project.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
              )}
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                編集
              </Button>
              <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDeleteProject}>
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger 
              value="overview" 
              onClick={() => setActiveTab('overview')}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              概要
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              onClick={() => setActiveTab('tasks')}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              タスク
            </TabsTrigger>
            <TabsTrigger 
              value="kanban" 
              onClick={() => setActiveTab('kanban')}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <LayoutKanban className="h-4 w-4 mr-2" />
              カンバン
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>プロジェクト情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ステータス</dt>
                      <dd className="mt-1">{getStatusBadge(project.status)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">作成日</dt>
                      <dd className="mt-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(project.created_at)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">最終更新</dt>
                      <dd className="mt-1 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDate(project.updated_at)}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>進捗状況</CardTitle>
                  <CardDescription>
                    タスク完了状況: {project.completedTaskCount}/{project.taskCount}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>全体進捗</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <p className="text-sm text-gray-500 dark:text-gray-400">未着手</p>
                        <p className="text-xl font-bold mt-1">{project.taskCount - project.completedTaskCount}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                        <p className="text-sm text-blue-500 dark:text-blue-400">進行中</p>
                        <p className="text-xl font-bold mt-1">
                          {Math.floor((project.taskCount - project.completedTaskCount) / 2)}
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                        <p className="text-sm text-green-500 dark:text-green-400">完了</p>
                        <p className="text-xl font-bold mt-1">{project.completedTaskCount}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">プロジェクトタスク</h2>
              <AddTaskButton 
                onSubmit={handleTaskSubmit} 
                defaultValues={{ project_id: project.id }}
              />
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium mb-2">タスクがありません</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  このプロジェクトにはまだタスクが追加されていません。
                </p>
                <AddTaskButton 
                  onSubmit={handleTaskSubmit} 
                  defaultValues={{ project_id: project.id }}
                  variant="default"
                />
              </div>
            ) : (
              <AnimatedList className="space-y-4">
                {tasks.map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onToggleTask={handleToggleTask}
                    onUpdateTaskTitle={handleUpdateTaskTitle}
                    onUpdateSubtaskTitle={handleUpdateSubtaskTitle}
                    onToggleTaskStatus={handleToggleTaskStatus}
                    onToggleSubtaskCompleted={handleToggleSubtaskCompleted}
                    onAddSubtask={handleAddSubtask}
                    onDeleteTask={handleDeleteTask}
                    onDeleteSubtask={handleDeleteSubtask}
                  />
                ))}
              </AnimatedList>
            )}
          </TabsContent>
          
          <TabsContent value="kanban">
            <KanbanBoard 
              projectId={project.id} 
              initialTasks={tasks}
            />
          </TabsContent>
        </Tabs>
      </FadeIn>
      
      {/* 編集モーダル */}
      <ProjectForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProject}
        initialValues={project}
        title={`プロジェクト編集: ${project.name}`}
      />
    </div>
  );
}
