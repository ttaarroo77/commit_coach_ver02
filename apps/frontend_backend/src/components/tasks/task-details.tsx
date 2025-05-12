import Link from 'next/link';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface TaskDetailsProps {
  task: Task;
  projectId: string;
}

export function TaskDetails({ task, projectId }: TaskDetailsProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <div className="space-x-4">
          <Link href={`/projects/${projectId}/tasks/${task.id}/edit`}>
            <Button variant="outline">タスクを編集</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>タスク詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">説明</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">ステータス</h3>
              <p className="text-muted-foreground">{task.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">作成日</h3>
              <p className="text-muted-foreground">
                {formatDate(task.created_at)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">更新日</h3>
              <p className="text-muted-foreground">
                {formatDate(task.updated_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Link href={`/projects/${projectId}`}>
          <Button variant="outline">プロジェクトに戻る</Button>
        </Link>
      </div>
    </div>
  );
} 