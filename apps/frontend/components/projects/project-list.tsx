'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import {
  Calendar,
  Users,
  BarChart2,
  Star,
  MoreVertical,
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  AlignLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export type Project = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  members: number;
  tasks: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isFavorite?: boolean;
};

interface ProjectListProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (projectId: string) => void;
  onFavorite?: (projectId: string, isFavorite: boolean) => void;
  onCreate?: () => void;
}

export function ProjectList({
  projects,
  onEdit,
  onDelete,
  onView,
  onFavorite,
  onCreate
}: ProjectListProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '期限なし';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">プロジェクト一覧</h2>
        {onCreate && (
          <Button onClick={onCreate} className="flex items-center gap-1">
            <Plus size={16} />
            <span>新規プロジェクト</span>
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <FadeIn>
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">プロジェクトがありません</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              新しいプロジェクトを作成して開発を始めましょう
            </p>
            {onCreate && (
              <div className="mt-6">
                <Button onClick={onCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  新規プロジェクト
                </Button>
              </div>
            )}
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <StaggerItem key={project.id}>
              <Card
                className="h-full transition-all hover:shadow-md cursor-pointer"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => onView && onView(project.id)}
                data-testid="project-card"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        {project.name}
                        {project.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {project.description.length > 100
                          ? `${project.description.substring(0, 100)}...`
                          : project.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">メニューを開く</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onView && onView(project.id);
                        }}>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          <span>詳細を見る</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onEdit && onEdit(project);
                        }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>編集する</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onFavorite && onFavorite(project.id, !project.isFavorite);
                        }}>
                          <Star className="mr-2 h-4 w-4" />
                          <span>{project.isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete && onDelete(project.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>削除する</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getStatusColor(project.status)} variant="outline">
                      {project.status === 'active' ? '進行中' :
                        project.status === 'completed' ? '完了' : 'アーカイブ'}
                    </Badge>
                    {project.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-primary/10 text-primary-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center">
                        <BarChart2 className="mr-1 h-4 w-4" />
                        進捗
                      </span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(project.dueDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="mr-1 h-4 w-4" />
                    {project.members}人
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <AlignLeft className="mr-1 h-4 w-4" />
                    {project.tasks}タスク
                  </div>
                </CardFooter>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
} 