'use client';

import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import TaskFormModal from './task-form-modal';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { useToast } from '../../components/ui/use-toast';

interface KanbanBoardProps {
  projectId: string;
  initialTasks?: Task[];
}

// カンバン列の定義
const COLUMNS = [
  { id: 'backlog', title: '未着手' },
  { id: 'in_progress', title: '進行中' },
  { id: 'review', title: 'レビュー中' },
  { id: 'completed', title: '完了' },
];

function KanbanBoardComponent({ projectId, initialTasks = [] }: KanbanBoardProps) {
  // タスク管理フックを使用
  const {
    tasks: projectTasks,
    isLoading,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  } = useProjectTasks(projectId);
  
  // ローカル状態管理
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { toast } = useToast();
  
  // プロジェクトタスクが更新されたら、ローカル状態も更新
  useEffect(() => {
    if (projectTasks.length > 0) {
      setTasks(projectTasks);
    }
  }, [projectTasks]);

  // センサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 列ごとにタスクをフィルタリング
  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter(task => task.status === column.id);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  // ドラッグ開始時の処理
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // ドラッグ中の処理
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 異なる列間のドラッグを処理
    const activeTask = tasks.find(t => t.id === activeId);
    const overColumn = COLUMNS.find(c => c.id === overId);

    if (activeTask && overColumn && activeTask.status !== overColumn.id) {
      // ローカル状態の更新
      setTasks(prev => 
        prev.map(task => 
          task.id === activeId 
            ? { ...task, status: overColumn.id as TaskStatus } 
            : task
        )
      );
      
      // バックエンド状態の更新
      updateTaskStatus(activeId, overColumn.id as TaskStatus)
        .catch(error => {
          console.error('タスクステータスの更新に失敗しました', error);
          toast({
            title: 'エラー',
            description: 'タスクの移動中にエラーが発生しました',
            variant: 'destructive',
          });
        });
    }
  }, [tasks, updateTaskStatus, toast]);

  // ドラッグ終了時の処理
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // 同じ列内でのタスクの並べ替え
    const activeColumnId = tasks.find(t => t.id === activeId)?.status;
    const overColumnId = tasks.find(t => t.id === overId)?.status;

    if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
      const columnTasks = tasks.filter(t => t.status === activeColumnId);
      const oldIndex = columnTasks.findIndex(t => t.id === activeId);
      const newIndex = columnTasks.findIndex(t => t.id === overId);

      const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
      
      // ローカル状態の更新
      setTasks(prev => [
        ...prev.filter(t => t.status !== activeColumnId),
        ...newColumnTasks
      ]);
      
      // 注: 並び順の永続化はこの実装では省略
      // 実際のアプリケーションでは、タスクの順序を保存するフィールドを
      // 追加して、それを更新する処理が必要
    }
  }, [tasks]);

  // 新しいタスクを追加
  const handleAddTask = useCallback(async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // バックエンドでタスクを作成
      const createdTask = await createTask(newTask);
      
      // ローカル状態は useEffect で自動的に更新されるため不要
      setIsTaskFormOpen(false);
      
      toast({
        title: '成功',
        description: 'タスクが追加されました',
      });
    } catch (error) {
      console.error('タスク作成エラー:', error);
      toast({
        title: 'エラー',
        description: 'タスクの作成に失敗しました',
        variant: 'destructive',
      });
    }
  }, [createTask, toast]);

  // アクティブなタスクを取得
  const activeTask = useMemo(() => {
    if (!activeId) return null;
    return tasks.find(task => task.id === activeId) || null;
  }, [activeId, tasks]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">カンバンボード</h2>
        <Button onClick={() => setIsTaskFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          タスク追加
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full pb-4">
            {COLUMNS.map(column => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={tasksByColumn[column.id] || []}
              >
                {tasksByColumn[column.id]?.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </KanbanColumn>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {isTaskFormOpen && (
        <TaskFormModal
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleAddTask}
          defaultValues={{ project_id: projectId, status: 'backlog' }}
        />
      )}
    </div>
  );
}

// カンバンボードをメモ化して不要な再レンダリングを防止
// プロジェクトIDが変わった場合のみ再レンダリングする
export const KanbanBoard = memo(KanbanBoardComponent, (prevProps, nextProps) => {
  return prevProps.projectId === nextProps.projectId;
});
