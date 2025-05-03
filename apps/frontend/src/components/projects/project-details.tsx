import Link from 'next/link';
import { Project } from '../../types/project';
import { Task } from '../../types/task';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { formatDate } from '../../lib/utils';

interface ProjectDetailsProps {
  project: Project;
  tasks: Task[];
}

export function ProjectDetails({ project, tasks }: ProjectDetailsProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <div className="space-x-4">
          <Link href={`/projects/${project.id}/tasks/new`}>
            <Button>タスクを追加</Button>
          </Link>
          <Link href={`/projects/${project.id}/edit`}>
            <Button variant="outline">プロジェクトを編集</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>プロジェクト詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">説明</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">作成日</h3>
              <p className="text-muted-foreground">
                {formatDate(project.created_at)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">更新日</h3>
              <p className="text-muted-foreground">
                {formatDate(project.updated_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">タスク一覧</h2>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Link key={task.id} href={`/projects/${project.id}/tasks/${task.id}`}>
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
    </div>
  );
} 