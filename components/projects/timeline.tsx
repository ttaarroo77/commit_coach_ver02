'use client';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '../../types/task';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TimelineProps {
  tasks: Task[];
  onAddTask: () => void;
}

export function Timeline({ tasks, onAddTask }: TimelineProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
    } catch (e) {
      return '日付不明';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg h-full flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium mb-2">タスクがありません</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          このプロジェクトにはまだタスクが追加されていません。
        </p>
        <Button 
          variant="default" 
          onClick={onAddTask}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          タスク追加
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">タイムライン</h2>
        <Button 
          variant="default" 
          onClick={onAddTask}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          タスク追加
        </Button>
      </div>
      
      <div className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-6 ml-4 space-y-8">
        {tasks
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .map((task) => (
            <div key={task.id} className="relative">
              <div className="absolute -left-[29px] mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(task.updated_at)}
                    </p>
                  </div>
                  <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'info' : task.status === 'review' ? 'warning' : 'default'}>
                    {task.status === 'completed' ? '完了' : task.status === 'in_progress' ? '進行中' : task.status === 'review' ? 'レビュー中' : '未着手'}
                  </Badge>
                </div>
                {task.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{task.description}</p>
                )}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">サブタスク ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})</p>
                    <ul className="text-sm space-y-1">
                      {task.subtasks.map((subtask) => (
                        <li key={subtask.id} className="flex items-center">
                          <span className={`mr-2 ${subtask.completed ? 'text-green-500 line-through' : 'text-gray-600 dark:text-gray-400'}`}>
                            {subtask.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
