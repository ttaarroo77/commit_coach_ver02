'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FadeIn, SlideUp } from '@/components/ui/animations';
import {
  Calendar,
  Clock,
  Users,
  Star,
  BarChart2,
  Edit,
  ArrowLeft,
  FileText,
  CheckSquare,
  GitCommit,
  ListTodo,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Project } from './project-list';

interface ProjectDetailProps {
  project: Project;
  onEdit: () => void;
  onBack: () => void;
  onFavorite: (isFavorite: boolean) => void;
}

export function ProjectDetail({ project, onEdit, onBack, onFavorite }: ProjectDetailProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '期限なし';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { locale: ja, addSuffix: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const statusText = {
    active: '進行中',
    completed: '完了',
    archived: 'アーカイブ'
  };

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 -ml-2 flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        <span>プロジェクト一覧に戻る</span>
      </Button>

      <FadeIn className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <button
                onClick={() => onFavorite(!project.isFavorite)}
                className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Star
                  size={20}
                  className={project.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
                />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={getStatusColor(project.status)}>
                {statusText[project.status as keyof typeof statusText]}
              </Badge>
              {project.tags?.map(tag => (
                <Badge key={tag} variant="outline" className="bg-primary/10 text-primary-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button onClick={onEdit} className="flex items-center gap-1">
            <Edit size={16} />
            <span>編集</span>
          </Button>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SlideUp delay={0.1}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                日付情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">作成日</div>
                  <div className="font-medium">{formatDate(project.createdAt)}</div>
                  <div className="text-xs text-gray-400">{formatRelativeDate(project.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">最終更新</div>
                  <div className="font-medium">{formatDate(project.updatedAt)}</div>
                  <div className="text-xs text-gray-400">{formatRelativeDate(project.updatedAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">期限日</div>
                  <div className="font-medium">{formatDate(project.dueDate)}</div>
                  {project.dueDate && (
                    <div className="text-xs text-gray-400">{formatRelativeDate(project.dueDate)}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.2}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                進捗状況
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{project.progress}% 完了</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <div
                  className="bg-primary h-3 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">完了タスク</div>
                  <div className="font-medium">{Math.round(project.tasks * project.progress / 100)} / {project.tasks}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">残りタスク</div>
                  <div className="font-medium">{project.tasks - Math.round(project.tasks * project.progress / 100)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.3}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                メンバー情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">プロジェクトメンバー</div>
                  <div className="font-medium">{project.members}人</div>
                </div>
                <div className="flex -space-x-2">
                  {/* メンバーのアバター（実際のデータに置き換え） */}
                  {Array.from({ length: Math.min(5, project.members) }).map((_, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-xs font-medium"
                    >
                      M{i + 1}
                    </div>
                  ))}
                  {project.members > 5 && (
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                      +{project.members - 5}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  メンバーを管理
                </Button>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <FileText size={16} />
            <span>概要</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-1">
            <CheckSquare size={16} />
            <span>タスク</span>
          </TabsTrigger>
          <TabsTrigger value="commits" className="flex items-center gap-1">
            <GitCommit size={16} />
            <span>コミット</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings size={16} />
            <span>設定</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>プロジェクト詳細</CardTitle>
              <CardDescription>プロジェクトの詳細情報と説明</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p>{project.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>最近の活動</CardTitle>
              <CardDescription>プロジェクトの最新アクティビティ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 活動履歴（実際のデータに置き換え） */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="font-medium">タスク「デザイン修正」が完了しました</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">1時間前</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0">
                    <GitCommit size={16} />
                  </div>
                  <div>
                    <div className="font-medium">新しいコミット「ログイン機能の改善」が追加されました</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">3時間前</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="font-medium">鈴木さんがプロジェクトに参加しました</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">昨日</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>タスク一覧</CardTitle>
                <CardDescription>プロジェクトのタスク管理</CardDescription>
              </div>
              <Button className="flex items-center gap-1">
                <ListTodo size={16} />
                <span>タスクを追加</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                この機能は開発中です。近日公開予定です。
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commits" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>コミット履歴</CardTitle>
                <CardDescription>プロジェクトのコミット履歴</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                この機能は開発中です。近日公開予定です。
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>プロジェクト設定</CardTitle>
              <CardDescription>プロジェクトの設定を管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                この機能は開発中です。近日公開予定です。
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 