import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface ProjectMetricsProps {
  projectId: string
}

export function ProjectMetrics({ projectId }: ProjectMetricsProps) {
  // TODO: APIからプロジェクトの統計データを取得
  const metrics = {
    totalTasks: 24,
    completedTasks: 12,
    inProgressTasks: 8,
    overdueTasks: 4,
    progress: 50,
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            プロジェクト進捗
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-2">
            <Progress value={metrics.progress} className="h-2" />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {metrics.progress}% 完了
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            タスクの状態
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-sm">完了</span>
              </div>
              <span className="text-sm font-medium">
                {metrics.completedTasks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                <span className="text-sm">進行中</span>
              </div>
              <span className="text-sm font-medium">
                {metrics.inProgressTasks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-sm">期限超過</span>
              </div>
              <span className="text-sm font-medium">
                {metrics.overdueTasks}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 