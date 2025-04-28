'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { EditableText, isDateOverdue } from './editable-text';
import { ChevronDown, ChevronRight, Plus, Trash2, MoreHorizontal } from 'lucide-react';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  startTime?: string;
  endTime?: string;
  status: 'todo' | 'in-progress' | 'completed';
  project?: string;
  priority?: string;
  progress: number;
  subtasks: SubTask[];
  expanded?: boolean;
  dueDate?: string;
}

export interface TaskGroupProps {
  id: string;
  title: string;
  expanded: boolean;
  tasks: Task[];
  dueDate?: string;
  completed: boolean;
  onToggleExpand: (id: string) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTaskTitle: (taskId: string, title: string) => void;
  onUpdateSubtaskTitle: (taskId: string, subtaskId: string, title: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onToggleSubtaskCompleted: (taskId: string, subtaskId: string) => void;
  onAddTask: () => void;
  onAddSubtask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export function TaskGroup({
  id,
  title,
  expanded,
  tasks,
  onToggleExpand,
  onToggleTask,
  onUpdateTaskTitle,
  onUpdateSubtaskTitle,
  onToggleTaskStatus,
  onToggleSubtaskCompleted,
  onAddTask,
  onAddSubtask,
  onDeleteTask,
  onDeleteSubtask
}: TaskGroupProps) {
  // プロジェクトごとの色を返す関数
  const getProjectColor = (project: string) => {
    switch (project) {
      case 'チーム管理':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'ウェブアプリ開発':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'デザインプロジェクト':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'QA':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer" onClick={() => onToggleExpand(id)}>
        <CardTitle className="text-lg font-medium flex items-center">
          {expanded ? (
            <ChevronDown className="h-5 w-5 mr-2 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 mr-2 text-gray-500" />
          )}
          {title}
          <span className="ml-2 text-sm text-gray-500">({tasks.length})</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          onAddTask();
        }}>
          <Plus className="h-4 w-4 mr-1" />
          タスク追加
        </Button>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 px-4 pb-3">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-md">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-t-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox 
                        checked={task.status === 'completed'} 
                        onCheckedChange={() => onToggleTaskStatus(task.id)}
                        className="h-5 w-5"
                      />
                      <div className="flex-1">
                        <EditableText
                          value={task.title}
                          onChange={(value) => onUpdateTaskTitle(task.id, value)}
                          className={task.status === 'completed' ? 'line-through text-gray-500' : 'font-medium'}
                          isOverdue={task.dueDate ? isDateOverdue(task.dueDate) && task.status !== 'completed' : false}
                        />
                        
                        <div className="flex items-center gap-2 mt-1">
                          {task.project && (
                            <span className={`text-xs px-2 py-0.5 rounded ${getProjectColor(task.project)}`}>
                              {task.project}
                            </span>
                          )}
                          {task.priority && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              task.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className={`text-xs ${
                              isDateOverdue(task.dueDate) && task.status !== 'completed'
                                ? 'text-red-600 dark:text-red-400 font-bold'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onToggleTask(task.id)}
                      >
                        {task.expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => onDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>進捗: {task.progress}%</span>
                      <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                    </div>
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                </div>
                
                {task.expanded && (
                  <div className="p-3 border-t">
                    <div className="space-y-2">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox 
                              checked={subtask.completed} 
                              onCheckedChange={() => onToggleSubtaskCompleted(task.id, subtask.id)}
                              className="h-4 w-4"
                            />
                            <EditableText
                              value={subtask.title}
                              onChange={(value) => onUpdateSubtaskTitle(task.id, subtask.id, value)}
                              className={subtask.completed ? 'line-through text-gray-500 text-sm' : 'text-sm'}
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-500"
                            onClick={() => onDeleteSubtask(task.id, subtask.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-xs"
                      onClick={() => onAddSubtask(task.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      サブタスクを追加
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="flex justify-center my-4">
                <Button
                  variant="outline"
                  className="border-dashed text-gray-400 hover:text-gray-600"
                  onClick={onAddTask}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  タスクを追加
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
