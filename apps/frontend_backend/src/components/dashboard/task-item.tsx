"use client";

import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Plus,
  MoreHorizontal,
  Trash2,
  GripVertical,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Task, SubTask } from '@/types/task';
import { EditableText } from './editable-text';

interface TaskItemProps {
  task: Task;
  taskIndex: number;
  groupId: string;
  toggleTask: (groupId: string, taskId: string) => void;
  updateTaskTitle: (groupId: string, taskId: string, newTitle: string) => void;
  updateSubtaskTitle: (groupId: string, taskId: string, subtaskId: string, newTitle: string) => void;
  toggleTaskStatus: (groupId: string, taskId: string) => void;
  toggleSubtaskCompleted: (groupId: string, taskId: string, subtaskId: string) => void;
  addSubtask: (groupId: string, taskId: string) => void;
  deleteTask: (groupId: string, taskId: string) => void;
  deleteSubtask: (groupId: string, taskId: string, subtaskId: string) => void;
  moveToToday?: (taskId: string) => void;
  moveToUnscheduled?: (taskId: string) => void;
}

// プロジェクトごとの色を返す関数
const getProjectColor = (project?: string) => {
  if (!project) return "bg-gray-100 text-gray-800";
  
  switch (project) {
    case "チーム管理":
      return "bg-[#31A9B8]/10 text-[#31A9B8]";
    case "ウェブアプリ開発":
      return "bg-[#258039]/10 text-[#258039]";
    case "デザインプロジェクト":
      return "bg-[#F5BE41]/10 text-[#F5BE41]";
    case "QA":
      return "bg-[#CF3721]/10 text-[#CF3721]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 納期が過ぎているかチェックする関数
const isDateOverdue = (date?: string): boolean => {
  if (!date) return false;
  const dueDate = new Date(date);
  const now = new Date();
  return dueDate < now;
};

export function TaskItem({
  task,
  taskIndex,
  groupId,
  toggleTask,
  updateTaskTitle,
  updateSubtaskTitle,
  toggleTaskStatus,
  toggleSubtaskCompleted,
  addSubtask,
  deleteTask,
  deleteSubtask,
  moveToToday,
  moveToUnscheduled
}: TaskItemProps) {
  const iconStyle = "h-4 w-4 text-gray-500";
  const isOverdue = isDateOverdue(task.dueDate);
  const projectColor = getProjectColor(task.project);

  return (
    <Draggable draggableId={task.id} index={taskIndex}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`border rounded-md p-3 mb-2 bg-white ${
            task.status === "completed" ? "opacity-70" : ""
          }`}
        >
          <div className="flex items-start">
            <div {...provided.dragHandleProps} className="mr-2 mt-1">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={() => toggleTaskStatus(groupId, task.id)}
              className="mr-2 mt-1"
            />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleTask(groupId, task.id)}
                    className="mr-2 focus:outline-none"
                  >
                    {task.expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <EditableText
                    value={task.title}
                    onChange={(newTitle) => updateTaskTitle(groupId, task.id, newTitle)}
                    className={task.status === "completed" ? "line-through text-gray-500" : ""}
                    isOverdue={isOverdue}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  {task.project && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${projectColor}`}
                    >
                      {task.project}
                    </span>
                  )}
                  {task.dueDate && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isOverdue
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => deleteTask(groupId, task.id)}
                    title="タスク削除"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  {groupId === "unscheduled" && moveToToday && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => moveToToday(task.id)}
                      title="今日のタスクに移動"
                    >
                      <ArrowUp className={iconStyle} />
                    </Button>
                  )}
                  {groupId === "today" && moveToUnscheduled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => moveToUnscheduled(task.id)}
                      title="未定のタスクに移動"
                    >
                      <ArrowDown className={iconStyle} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="その他"
                  >
                    <MoreHorizontal className={iconStyle} />
                  </Button>
                </div>
              </div>

              <div className="ml-6 mt-1">
                <Progress value={task.progress} className="h-1" />
              </div>

              {task.expanded && (
                <div className="ml-6 mt-2">
                  <Droppable droppableId={`${groupId}-${task.id}`} type="subtask">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-2"
                      >
                        {task.subtasks.map((subtask: SubTask, subtaskIndex: number) => (
                          <Draggable
                            key={subtask.id}
                            draggableId={`${task.id}-${subtask.id}`}
                            index={subtaskIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center group"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2 opacity-0 group-hover:opacity-100"
                                >
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                </div>
                                <Checkbox
                                  checked={subtask.completed}
                                  onCheckedChange={() =>
                                    toggleSubtaskCompleted(
                                      groupId,
                                      task.id,
                                      subtask.id
                                    )
                                  }
                                  className="mr-2"
                                />
                                <div className="flex-grow">
                                  <EditableText
                                    value={subtask.title}
                                    onChange={(newTitle) =>
                                      updateSubtaskTitle(
                                        groupId,
                                        task.id,
                                        subtask.id,
                                        newTitle
                                      )
                                    }
                                    className={
                                      subtask.completed
                                        ? "line-through text-gray-500 text-sm"
                                        : "text-sm"
                                    }
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                  onClick={() =>
                                    deleteSubtask(groupId, task.id, subtask.id)
                                  }
                                  title="サブタスク削除"
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-gray-500 hover:text-gray-700 pl-6"
                          onClick={() => addSubtask(groupId, task.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          サブタスクを追加
                        </Button>
                      </div>
                    )}
                  </Droppable>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
