'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasks_total: number;
  tasks_completed: number;
  due_date: string | null;
}

interface ProjectSummaryProps {
  projects: Project[];
}

export function ProjectSummary({ projects }: ProjectSummaryProps) {
  // 期限が近いプロジェクトを先に表示
  const sortedProjects = [...projects].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">プロジェクト概要</h2>
        <Button variant="ghost" size="sm" className="text-sm">
          すべて表示 <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      {sortedProjects.length > 0 ? (
        <div className="space-y-4">
          {sortedProjects.map(project => (
            <div key={project.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {project.tasks_completed}/{project.tasks_total} タスク
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{project.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <Progress value={project.progress} className="h-2" />
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              {project.due_date && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    期限: {new Date(project.due_date).toLocaleDateString('ja-JP')}
                  </span>
                  <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 dark:text-blue-400">
                    詳細を見る
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">プロジェクトはありません</p>
          <Button variant="outline" size="sm" className="mt-4">
            プロジェクトを作成
          </Button>
        </div>
      )}
    </div>
  );
}
