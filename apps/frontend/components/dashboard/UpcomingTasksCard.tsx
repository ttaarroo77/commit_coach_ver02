import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types/dashboard";

interface UpcomingTasksCardProps {
  tasks: Task[];
}

export function UpcomingTasksCard({ tasks }: UpcomingTasksCardProps) {
  // 今日の日付
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 期限が7日以内のタスク（完了済み以外）を抽出して期限順にソート
  const upcomingTasks = tasks
    .filter(task =>
      task.status !== 'completed' &&
      task.dueDate &&
      new Date(task.dueDate) >= today &&
      (new Date(task.dueDate).getTime() - today.getTime()) <= 7 * 24 * 60 * 60 * 1000
    )
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5); // 最大5件表示

  // 期限切れのタスク（完了済み以外）を抽出して期限順にソート
  const overdueTasks = tasks
    .filter(task =>
      task.status !== 'completed' &&
      task.dueDate &&
      new Date(task.dueDate) < today
    )
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    })
    .slice(0, 3); // 最大3件表示

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
  };

  // タスクの期限までの日数を計算する関数
  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今日";
    if (diffDays === 1) return "明日";
    if (diffDays < 0) return `${Math.abs(diffDays)}日経過`;
    return `${diffDays}日後`;
  };

  // プロジェクトに応じた色を返す関数
  const getProjectColor = (project: string) => {
    const colorMap: Record<string, string> = {
      "ウェブアプリ開発": "bg-blue-100 text-blue-800",
      "デザインプロジェクト": "bg-purple-100 text-purple-800",
      "QA": "bg-green-100 text-green-800",
      "チーム管理": "bg-orange-100 text-orange-800"
    };

    return colorMap[project] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          期限間近 / 期限超過タスク
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {overdueTasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              <h3 className="text-xs font-semibold text-red-500">期限超過</h3>
            </div>
            <ul className="space-y-2">
              {overdueTasks.map(task => (
                <li key={task.id} className="border-l-2 border-red-500 pl-2 py-1">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm leading-tight">{task.title}</div>
                    <Badge variant="outline" className="text-red-500 border-red-300">
                      {task.dueDate && getDaysUntil(task.dueDate)}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-1">
                    {task.priority && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${task.priority === "high" || task.priority === "緊急" || task.priority === "高"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium" || task.priority === "中"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {task.priority}
                      </span>
                    )}
                    {task.projectId && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getProjectColor(task.projectId)}`}>
                        {task.projectId}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 ml-2">
                      {task.dueDate && formatDate(task.dueDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {upcomingTasks.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-amber-500 mr-1" />
              <h3 className="text-xs font-semibold text-amber-500">期限間近</h3>
            </div>
            <ul className="space-y-2">
              {upcomingTasks.map(task => (
                <li key={task.id} className="border-l-2 border-amber-400 pl-2 py-1">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm leading-tight">{task.title}</div>
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      {task.dueDate && getDaysUntil(task.dueDate)}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-1">
                    {task.priority && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${task.priority === "high" || task.priority === "緊急" || task.priority === "高"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium" || task.priority === "中"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {task.priority}
                      </span>
                    )}
                    {task.projectId && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getProjectColor(task.projectId)}`}>
                        {task.projectId}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 ml-2">
                      {task.dueDate && formatDate(task.dueDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {upcomingTasks.length === 0 && overdueTasks.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            期限間近のタスクはありません
          </div>
        )}
      </CardContent>
    </Card>
  );
}
