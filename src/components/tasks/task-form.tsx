import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createBrowserClient } from '@supabase/ssr';

interface TaskFormProps {
  projectId: string;
  task?: Task;
}

export function TaskForm({ projectId, task }: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'todo');
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (task) {
        await supabase
          .from('tasks')
          .update({ title, description, status })
          .eq('id', task.id);
      } else {
        await supabase
          .from('tasks')
          .insert([{ title, description, status, project_id: projectId }]);
      }
      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task ? 'タスクの編集' : 'タスクの作成'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">ステータス</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Task['status'])}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="todo">未着手</option>
              <option value="in_progress">進行中</option>
              <option value="done">完了</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 