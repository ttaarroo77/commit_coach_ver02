"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewTaskPageProps {
  params: {
    id: string
  }
}

export default function NewTaskPage({ params }: NewTaskPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as 'todo' | 'in_progress' | 'done'
    const dueDate = formData.get('dueDate') as string

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          project_id: params.id,
          title,
          description,
          status,
          due_date: dueDate || null
        }])

      if (error) throw error

      router.push(`/projects/${params.id}`)
      router.refresh()
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>新規タスク作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                タイトル
              </label>
              <Input
                id="title"
                name="title"
                required
                placeholder="タスクのタイトルを入力"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                説明
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="タスクの説明を入力"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                ステータス
              </label>
              <Select name="status" defaultValue="todo">
                <SelectTrigger>
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">未着手</SelectItem>
                  <SelectItem value="in_progress">進行中</SelectItem>
                  <SelectItem value="done">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                期限
              </label>
              <Input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                エラーが発生しました: {error.message}
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "作成中..." : "作成"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
