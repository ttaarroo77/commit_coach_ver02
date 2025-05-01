import Link from 'next/link';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  projectId: string;
}

export function TaskList({ tasks, projectId }: TaskListProps) {
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
          <Link
            key={task.id}
            href={`/projects/${projectId}/tasks/${task.id}`}
          >
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {task.description}
                </p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>ステータス: {task.status}</span>
                  <span>作成日: {formatDate(task.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 