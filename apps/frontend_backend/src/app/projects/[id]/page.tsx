"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'
import { Project } from "@/types/project"
import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/tasks/task-list"
import { formatDate } from "@/lib/utils"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const [projectResponse, tasksResponse] = await Promise.all([
          supabase
            .from('projects')
            .select('*')
            .eq('id', params.id)
            .single(),
          supabase
            .from('tasks')
            .select('*')
            .eq('project_id', params.id)
            .order('created_at', { ascending: false })
        ])

        if (projectResponse.error) throw projectResponse.error
        if (tasksResponse.error) throw tasksResponse.error

        setProject(projectResponse.data)
        setTasks(tasksResponse.data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectAndTasks()
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('このプロジェクトを削除してもよろしいですか？')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      router.push('/projects')
      router.refresh()
    } catch (err) {
      setError(err as Error)
    }
  }

  const handleTaskStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
    } catch (err) {
      setError(err as Error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    if (!confirm('このタスクを削除してもよろしいですか？')) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (err) {
      setError(err as Error)
    }
  }

  if (loading) {
    return <div className="container mx-auto py-8">読み込み中...</div>
  }

  if (error) {
    return <div className="container mx-auto py-8">エラーが発生しました: {error.message}</div>
  }

  if (!project) {
    return <div className="container mx-auto py-8">プロジェクトが見つかりません</div>
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{project.title}</CardTitle>
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push(`/projects/${params.id}/edit`)}
              >
                編集
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                削除
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">説明</h3>
              <p className="text-muted-foreground">
                {project.description || '説明はありません'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">作成日</h3>
              <p className="text-muted-foreground">
                {formatDate(project.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskList
        tasks={tasks}
        projectId={params.id}
        onStatusChange={handleTaskStatusChange}
        onDelete={handleTaskDelete}
      />
    </div>
  )
}
