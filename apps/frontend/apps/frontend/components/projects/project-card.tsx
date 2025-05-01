'use client';

import { ProjectWithStats } from '@/types/project';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animations';

interface ProjectCardProps {
  project: ProjectWithStats;
  onEdit?: (project: ProjectWithStats) => void;
  onDelete?: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { id, name, description, status, created_at, updated_at, taskCount, completedTaskCount, progress } = project;
  
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500">進行中</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">完了</Badge>;
      case 'archived':
        return <Badge className="bg-gray-500">アーカイブ</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ja });
    } catch (e) {
      return '日付不明';
    }
  };

  return (
    <AnimatedCard>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium">{name}</CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>進捗状況</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>更新: {formatDate(updated_at)}</span>
              </div>
              <div>
                タスク: {completedTaskCount}/{taskCount}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t flex justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projects/${id}`}>
              詳細を見る
            </Link>
          </Button>
          
          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDelete(id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </AnimatedCard>
  );
}
