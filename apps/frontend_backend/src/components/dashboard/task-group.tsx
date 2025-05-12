"use client";

import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskItem } from './task-item';
import { Task, TaskGroup as TaskGroupType } from '@/types/task';

interface TaskGroupProps {
  group: TaskGroupType;
  index: number;
  toggleTaskGroup: (groupId: string) => void;
  toggleTask: (groupId: string, taskId: string) => void;
  updateTaskTitle: (groupId: string, taskId: string, newTitle: string) => void;
  updateSubtaskTitle: (groupId: string, taskId: string, subtaskId: string, newTitle: string) => void;
  toggleTaskStatus: (groupId: string, taskId: string) => void;
  toggleSubtaskCompleted: (groupId: string, taskId: string, subtaskId: string) => void;
  addTask: (groupId: string) => void;
  addSubtask: (groupId: string, taskId: string) => void;
  deleteTask: (groupId: string, taskId: string) => void;
  deleteSubtask: (groupId: string, taskId: string, subtaskId: string) => void;
  moveToToday?: (taskId: string) => void;
  moveToUnscheduled?: (taskId: string) => void;
}

export function TaskGroup({
  group,
  index,
  toggleTaskGroup,
  toggleTask,
  updateTaskTitle,
  updateSubtaskTitle,
  toggleTaskStatus,
  toggleSubtaskCompleted,
  addTask,
  addSubtask,
  deleteTask,
  deleteSubtask,
  moveToToday,
  moveToUnscheduled
}: TaskGroupProps) {
  return (
    <Draggable draggableId={group.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-4"
        >
          <Card className="border shadow-sm">
            <CardHeader
              className="p-3 cursor-pointer flex flex-row items-center justify-between"
              onClick={() => toggleTaskGroup(group.id)}
              {...provided.dragHandleProps}
            >
              <div className="flex items-center">
                {group.expanded ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                <CardTitle className="text-md font-medium">{group.title}</CardTitle>
                <span className="ml-2 text-sm text-gray-500">
                  ({group.tasks.filter(task => task.status === "completed").length}/{group.tasks.length})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    addTask(group.id);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {group.expanded && (
              <CardContent className="p-3 pt-0">
                <Droppable droppableId={group.id} type="task">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2"
                    >
                      {group.tasks.map((task: Task, taskIndex: number) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          taskIndex={taskIndex}
                          groupId={group.id}
                          toggleTask={toggleTask}
                          updateTaskTitle={updateTaskTitle}
                          updateSubtaskTitle={updateSubtaskTitle}
                          toggleTaskStatus={toggleTaskStatus}
                          toggleSubtaskCompleted={toggleSubtaskCompleted}
                          addSubtask={addSubtask}
                          deleteTask={deleteTask}
                          deleteSubtask={deleteSubtask}
                          moveToToday={moveToToday}
                          moveToUnscheduled={moveToUnscheduled}
                        />
                      ))}
                      {provided.placeholder}
                      {group.tasks.length === 0 && (
                        <div className="flex justify-center my-4">
                          <Button
                            variant="outline"
                            className="border-dashed text-gray-400 hover:text-gray-600"
                            onClick={() => addTask(group.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            タスクを追加
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
}
