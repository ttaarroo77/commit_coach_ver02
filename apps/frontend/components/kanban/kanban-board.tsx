'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  horizontalListSortingStrategy 
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { useLayoutEffect } from 'react';
import { KanbanTask } from './kanban-task';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/ui/animations';
import { Task, TaskGroup, TaskStatus } from '@/types/task';

// カンバンボードのデフォルト列
const defaultColumns: TaskGroup[] = [
  {
    id: 'todo',
    title: '未着手',
    tasks: [],
    status: 'todo',
  },
  {
    id: 'in-progress',
    title: '進行中',
    tasks: [],
    status: 'in-progress',
  },
  {
    id: 'done',
    title: '完了',
    tasks: [],
    status: 'done',
  },
];

interface KanbanBoardProps {
  projectId: string;
  initialTasks?: Task[];
}

function KanbanBoardComponent({ projectId, initialTasks = [] }: KanbanBoardProps) {
  // 列の状態管理
  const [columns, setColumns] = useState<TaskGroup[]>(() => {
    // 初期タスクを各列に振り分ける
    const cols = [...defaultColumns];
    
    initialTasks.forEach(task => {
      const status = task.status || 'todo';
      const columnIndex = cols.findIndex(col => col.status === status);
      
      if (columnIndex !== -1) {
        cols[columnIndex].tasks.push(task);
      } else {
        // デフォルト列に追加
        cols[0].tasks.push(task);
      }
    });
    
    return cols;
  });
  
  // レイアウト効果を使用して初期レンダリングを最適化
  useLayoutEffect(() => {
    // 初期レンダリング後に一度だけ実行
    const root = document.documentElement;
    root.style.setProperty('--kanban-animation-duration', '0ms');
    
    // 次のフレームでアニメーションを元に戻す
    requestAnimationFrame(() => {
      setTimeout(() => {
        root.style.setProperty('--kanban-animation-duration', '150ms');
      }, 50);
    });
  }, []);
  
  // ドラッグ中のタスクID
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  // センサー設定 - useMemoで最適化
  const sensors = useMemo(() => {
    return useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8, // 8ピクセル以上動かしたらドラッグ開始
        },
      })
    );
  }, []);
  
  // ドラッグ開始時の処理
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveTaskId(active.id as string);
  }, []);
  
  // ドラッグオーバー時の処理（列間の移動）
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // 同じIDの場合は何もしない
    if (activeId === overId) return;
    
    // アクティブなタスクの情報を取得
    let activeColumnIndex = -1;
    let activeTaskIndex = -1;
    let activeTask: Task | null = null;
    
    // タスクと列のインデックスを検索
    columns.forEach((column, columnIndex) => {
      const taskIndex = column.tasks.findIndex(task => task.id === activeId);
      if (taskIndex !== -1) {
        activeColumnIndex = columnIndex;
        activeTaskIndex = taskIndex;
        activeTask = column.tasks[taskIndex];
      }
    });
    
    if (!activeTask) return;
    
    // 移動先の列を検索
    const overColumnIndex = columns.findIndex(column => column.id === overId);
    
    // 列間の移動の場合
    if (overColumnIndex !== -1 && activeColumnIndex !== -1) {
      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        
        // 元の列からタスクを削除
        newColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1);
        
        // 新しい列にタスクを追加（ステータスを更新）
        const updatedTask = {
          ...activeTask!,
          status: newColumns[overColumnIndex].status as TaskStatus
        };
        
        newColumns[overColumnIndex].tasks.push(updatedTask);
        
        return newColumns;
      });
    }
  }, [columns]);
  
  // ドラッグ終了時の処理
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTaskId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    if (activeId === overId) {
      setActiveTaskId(null);
      return;
    }
    
    // アクティブなタスクの情報を取得
    let activeColumnIndex = -1;
    let activeTaskIndex = -1;
    
    // オーバーしているタスクの情報を取得
    let overColumnIndex = -1;
    let overTaskIndex = -1;
    
    // インデックスを検索
    columns.forEach((column, columnIndex) => {
      column.tasks.forEach((task, taskIndex) => {
        if (task.id === activeId) {
          activeColumnIndex = columnIndex;
          activeTaskIndex = taskIndex;
        }
        if (task.id === overId) {
          overColumnIndex = columnIndex;
          overTaskIndex = taskIndex;
        }
      });
    });
    
    // 同じ列内でのタスクの並び替え
    if (
      activeColumnIndex !== -1 && 
      overColumnIndex !== -1 && 
      activeColumnIndex === overColumnIndex &&
      activeTaskIndex !== -1 &&
      overTaskIndex !== -1
    ) {
      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        const column = newColumns[activeColumnIndex];
        
        // 配列内での位置を入れ替え
        column.tasks = arrayMove(
          column.tasks,
          activeTaskIndex,
          overTaskIndex
        );
        
        return newColumns;
      });
    }
    
    setActiveTaskId(null);
  }, [columns]);
  
  // 新しい列の追加
  const handleAddColumn = useCallback(() => {
    const newColumnId = `column-${Date.now()}`;
    const newColumn: TaskGroup = {
      id: newColumnId,
      title: '新しい列',
      tasks: [],
      status: 'todo', // デフォルトステータス
    };
    
    setColumns(prevColumns => [...prevColumns, newColumn]);
  }, []);
  
  // 列タイトルの更新
  const handleUpdateColumnTitle = useCallback((columnId: string, newTitle: string) => {
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId 
          ? { ...column, title: newTitle } 
          : column
      )
    );
  }, []);
  
  // 列の削除
  const handleDeleteColumn = useCallback((columnId: string) => {
    setColumns(prevColumns => prevColumns.filter(column => column.id !== columnId));
  }, []);
  
  // 新しいタスクの追加
  const handleAddTask = useCallback((columnId: string, task: Task) => {
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId 
          ? { ...column, tasks: [...column.tasks, task] } 
          : column
      )
    );
  }, []);
  
  // タスクの更新
  const handleUpdateTask = useCallback((taskId: string, updatedTask: Partial<Task>) => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === taskId 
            ? { ...task, ...updatedTask } 
            : task
        )
      }))
    );
  }, []);
  
  // タスクの削除
  const handleDeleteTask = useCallback((taskId: string) => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      }))
    );
  }, []);
  
  // メモ化されたカラムリスト
  const columnItems = useMemo(() => columns.map(col => col.id), [columns]);
  
  return (
    <FadeIn className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">カンバンボード</h2>
        <Button 
          onClick={handleAddColumn}
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>列を追加</span>
        </Button>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SlideIn className="flex gap-4 overflow-x-auto pb-4 transition-all duration-[var(--kanban-animation-duration,150ms)]">
          <SortableContext
            items={columnItems}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map(column => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                onUpdateTitle={(newTitle) => handleUpdateColumnTitle(column.id, newTitle)}
                onDelete={() => handleDeleteColumn(column.id)}
                onAddTask={(task) => handleAddTask(column.id, task)}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                projectId={projectId}
              />
            ))}
          </SortableContext>
        </SlideIn>
      </DndContext>
    </FadeIn>
  );
}

// メモ化されたコンポーネントをエクスポート
export const KanbanBoard = memo(KanbanBoardComponent);
