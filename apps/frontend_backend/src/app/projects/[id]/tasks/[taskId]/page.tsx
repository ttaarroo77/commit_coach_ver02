import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { TaskDetails } from '@/components/tasks/task-details';

export default async function TaskPage({
  params,
}: {
  params: { id: string; taskId: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!project) {
    redirect('/projects');
  }

  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', params.taskId)
    .single();

  if (!task) {
    redirect(`/projects/${params.id}/tasks`);
  }

  return (
    <div className="container mx-auto py-8">
      <TaskDetails task={task} projectId={params.id} />
    </div>
  );
}