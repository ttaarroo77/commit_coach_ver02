import React from 'react';
import Link from 'next/link';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  projectId: string;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onDelete: (taskId: string) => void;
}

const statusLabels: Record<Task['status'], string> = {
  todo: '未着手',
  in_progress: '進行中',
  done: '完了'
};

const statusColors: Record<Task['status'], string> = {
  todo: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  done: 'bg-green-500'
};

export function TaskList({ tasks, projectId, onStatusChange, onDelete }: TaskListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">タスク一覧</h2>
        <Link href={`/projects/${projectId}/tasks/new`}>
          <Button>新規タスク</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{task.title}</CardTitle>
                  <Badge className={`mt-2 ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
                  >
                    ステータス更新
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {task.description && (
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
                {task.due_date && (
                  <p className="text-xs text-muted-foreground">
                    期限: {formatDate(task.due_date)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getNextStatus(currentStatus: Task['status']): Task['status'] {
  switch (currentStatus) {
    case 'todo':
      return 'in_progress';
    case 'in_progress':
      return 'done';
    case 'done':
      return 'todo';
  }
}
