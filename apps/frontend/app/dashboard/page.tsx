"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Plus, ChevronDown, ChevronRight } from "lucide-react"
import { HierarchicalTaskItem } from "@/components/hierarchical-task-item"
import { AICoachSidebar } from "@/components/ai-coach-sidebar"
import {
  getDashboardData,
  saveDashboardData,
  addProjectToDashboard,
  addTaskToProject,
  addSubtaskToTask,
  calculateProgress,
  type TaskGroup,
  type SubTask,
} from "@/lib/dashboard-utils"

export default function DashboardPage() {
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  // ダッシュボードデータを読み込む
  useEffect(() => {
    const data = getDashboardData()
    setTaskGroups(data)
    setIsLoading(false)

    // 現在時刻を更新
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1分ごとに更新

    return () => clearInterval(timer)
  }, [])

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    if (!isLoading) {
      saveDashboardData(taskGroups)
    }
  }, [taskGroups, isLoading])

  // タスクグループの展開/折りたたみを切り替える
  const toggleTaskGroup = (groupId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === groupId ? { ...group, expanded: !group.expanded } : group)),
    )
  }

  // プロジェクトの展開/折りたたみを切り替える
  const toggleProject = (groupId: string, projectId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) =>
                project.id === projectId ? { ...project, expanded: !project.expanded } : project,
              ),
            }
          : group,
      ),
    )
  }

  // タスクの展開/折りたたみを切り替える
  const toggleTask = (groupId: string, projectId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      tasks: project.tasks.map((task) =>
                        task.id === taskId
                          ? {
                              ...task,
                              expanded: !task.expanded,
                              // サブタスクがある場合は、展開時に表示されるようにする
                              subtasks: task.subtasks.map((subtask) => ({
                                ...subtask,
                              })),
                            }
                          : task,
                      ),
                    }
                  : project,
              ),
            }
          : group,
      ),
    )
  }

  // プロジェクトの完了状態を切り替える
  const toggleProjectComplete = (groupId: string, projectId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) => {
                if (project.id === projectId) {
                  const newCompleted = !project.completed
                  // プロジェクトが完了したら、すべてのタスクとサブタスも完了にする
                  const updatedTasks = project.tasks.map((task) => ({
                    ...task,
                    completed: newCompleted,
                    subtasks: task.subtasks.map((subtask) => ({
                      ...subtask,
                      completed: newCompleted,
                    })),
                    progress: newCompleted ? 100 : 0,
                    status: newCompleted ? "completed" : "todo",
                  }))
                  return {
                    ...project,
                    completed: newCompleted,
                    tasks: updatedTasks,
                    status: newCompleted ? "completed" : "todo",
                  }
                }
                return project
              }),
            }
          : group,
      ),
    )
  }

  // タスクの完了状態を切り替える
  const toggleTaskComplete = (groupId: string, projectId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      tasks: project.tasks.map((task) => {
                        if (task.id === taskId) {
                          const newCompleted = !task.completed
                          // タスクが完了したら、すべてのサブタスクも完了にする
                          const updatedSubtasks = task.subtasks.map((subtask) => ({
                            ...subtask,
                            completed: newCompleted,
                          }))
                          return {
                            ...task,
                            completed: newCompleted,
                            subtasks: updatedSubtasks,
                            progress: newCompleted ? 100 : 0,
                            status: newCompleted ? "completed" : "todo",
                          }
                        }
                        return task
                      }),
                    }
                  : project,
              ),
            }
          : group,
      ),
    )

    // プロジェクトの完了状態を更新
    updateProjectCompletionStatus(groupId, projectId)
  }

  // サブタスクの完了状態を切り替える
  const toggleSubtaskComplete = (groupId: string, projectId: string, taskId: string, subtaskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      tasks: project.tasks.map((task) =>
                        task.id === taskId
                          ? {
                              ...task,
                              subtasks: task.subtasks.map((subtask) =>
                                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
                              ),
                            }
                          : task,
                      ),
                    }
                  : project,
              ),
            }
          : group,
      ),
    )

    // タスクの進捗状況を更新
    updateTaskProgress(groupId, projectId, taskId)
  }

  // タスクの進捗状況を更新
  const updateTaskProgress = (groupId: string, projectId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      tasks: project.tasks.map((task) => {
                        if (task.id === taskId) {
                          const progress = calculateProgress(task.subtasks)
                          const allCompleted = task.subtasks.length > 0 && task.subtasks.every((st) => st.completed)
                          return {
                            ...task,
                            progress,
                            completed: allCompleted,
                            status: allCompleted ? "completed" : progress > 0 ? "in-progress" : "todo",
                          }
                        }
                        return task
                      }),
                    }
                  : project,
              ),
            }
          : group,
      ),
    )

    // プロジェクトの完了状態を更新
    updateProjectCompletionStatus(groupId, projectId)
  }

  // プロジェクトの完了状態を更新
  const updateProjectCompletionStatus = (groupId: string, projectId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) => {
                if (project.id === projectId) {
                  const allTasksCompleted = project.tasks.length > 0 && project.tasks.every((task) => task.completed)
                  return {
                    ...project,
                    completed: allTasksCompleted,
                    status: allTasksCompleted
                      ? "completed"
                      : project.tasks.some((t) => t.status === "in-progress")
                        ? "in-progress"
                        : "todo",
                  }
                }
                return project
              }),
            }
          : group,
      ),
    )
  }

  // 新しいプロジェクトを追加
  const handleAddProject = (groupId: string) => {
    const projectTitle = `新しいプロジェクト ${new Date().toLocaleTimeString()}`
    addProjectToDashboard(`project-${Date.now()}`, projectTitle, groupId)

    // 状態を更新
    const data = getDashboardData()
    setTaskGroups(data)
  }

  // 新しいタスクを追加
  const handleAddTask = (groupId: string, projectId: string) => {
    const taskTitle = `新しいタスク ${new Date().toLocaleTimeString()}`
    addTaskToProject(taskTitle, projectId, groupId)

    // 状態を更新
    const data = getDashboardData()
    setTaskGroups(data)
  }

  // 新しいサブタスクを追加
  const handleAddSubtask = (groupId: string, projectId: string, taskId: string) => {
    const subtaskTitle = `新しいサブタスク ${new Date().toLocaleTimeString()}`

    // 既存のタスクグループを更新
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            projects: group.projects.map((project) => {
              if (project.id === projectId) {
                return {
                  ...project,
                  tasks: project.tasks.map((task) => {
                    if (task.id === taskId) {
                      // 新しいサブタスクを作成
                      const newSubtask: SubTask = {
                        id: `subtask-${Date.now()}`,
                        title: subtaskTitle,
                        completed: false,
                      }

                      // タスクが折りたたまれている場合は展開する
                      if (!task.expanded) {
                        task.expanded = true
                      }

                      // サブタスクを追加
                      return {
                        ...task,
                        subtasks: [...task.subtasks, newSubtask],
                      }
                    }
                    return task
                  }),
                }
              }
              return project
            }),
          }
        }
        return group
      }),
    )

    // ローカルストレージにも保存
    setTimeout(() => {
      const updatedData = getDashboardData()
      addSubtaskToTask(subtaskTitle, taskId, projectId, groupId)
    }, 0)
  }

  // プロジェクトを削除
  const handleDeleteProject = (groupId: string, projectId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.filter((project) => project.id !== projectId),
            }
          : group,
      ),
    )
  }

  // タスクを削除
  const handleDeleteTask = (groupId: string, projectId: string, taskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      tasks: project.tasks.filter((task) => task.id !== taskId),
                    }
                  : project,
              ),
            }
          : group,
      ),
    )

    // プロジェクトの完了状態を更新
    updateProjectCompletionStatus(groupId, projectId)
  }

  // サブタスクを削除
  const handleDeleteSubtask = (groupId: string, projectId: string, taskId: string, subtaskId: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              projects: group.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      tasks: project.tasks.map((task) =>
                        task.id === taskId
                          ? {
                              ...task,
                              subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
                            }
                          : task,
                      ),
                    }
                  : project,
              ),
            }
          : group,
      ),
    )

    // タスクの進捗状況を更新
    updateTaskProgress(groupId, projectId, taskId)
  }

  // ドラッグ&ドロップの処理
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result

    // ドロップ先がない場合（ドラッグがキャンセルされた場合）は何もしない
    if (!destination) {
      return
    }

    // 同じ位置にドロップされた場合は何もしない
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // タスクグループの並び替え
    if (type === "taskGroup") {
      const reorderedGroups = Array.from(taskGroups)
      const [removed] = reorderedGroups.splice(source.index, 1)
      reorderedGroups.splice(destination.index, 0, removed)
      setTaskGroups(reorderedGroups)
      return
    }

    // プロジェクトの並び替え
    if (type === "project") {
      const sourceGroupId = source.droppableId
      const destGroupId = destination.droppableId

      // 同じグループ内での並び替え
      if (sourceGroupId === destGroupId) {
        setTaskGroups((prevGroups) =>
          prevGroups.map((group) => {
            if (group.id === sourceGroupId) {
              const newProjects = Array.from(group.projects)
              const [removed] = newProjects.splice(source.index, 1)
              newProjects.splice(destination.index, 0, removed)
              return { ...group, projects: newProjects }
            }
            return group
          }),
        )
      } else {
        // 異なるグループ間での移動
        setTaskGroups((prevGroups) => {
          const newGroups = [...prevGroups]
          const sourceGroup = newGroups.find((g) => g.id === sourceGroupId)
          const destGroup = newGroups.find((g) => g.id === destGroupId)

          if (!sourceGroup || !destGroup) return prevGroups

          const [movedProject] = sourceGroup.projects.splice(source.index, 1)

          // 今日のタスクに移動する場合は時間を設定
          if (destGroupId === "today" && !movedProject.startTime) {
            const now = new Date()
            movedProject.startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
            movedProject.endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
          }

          // 未定のタスクに移動する場合は時間を削除
          if (destGroupId === "unscheduled") {
            delete movedProject.startTime
            delete movedProject.endTime
          }

          destGroup.projects.splice(destination.index, 0, movedProject)
          return newGroups
        })
      }
      return
    }

    // タスクの並び替え
    if (type === "task") {
      const [sourceGroupId, sourceProjectId] = source.droppableId.split(":")
      const [destGroupId, destProjectId] = destination.droppableId.split(":")

      // 同じプロジェクト内での並び替え
      if (sourceGroupId === destGroupId && sourceProjectId === destProjectId) {
        setTaskGroups((prevGroups) =>
          prevGroups.map((group) => {
            if (group.id === sourceGroupId) {
              return {
                ...group,
                projects: group.projects.map((project) => {
                  if (project.id === sourceProjectId) {
                    const newTasks = Array.from(project.tasks)
                    const [removed] = newTasks.splice(source.index, 1)
                    newTasks.splice(destination.index, 0, removed)
                    return { ...project, tasks: newTasks }
                  }
                  return project
                }),
              }
            }
            return group
          }),
        )
      } else {
        // 異なるプロジェクト間での移動
        setTaskGroups((prevGroups) => {
          const newGroups = [...prevGroups]
          const sourceGroup = newGroups.find((g) => g.id === sourceGroupId)
          const destGroup = newGroups.find((g) => g.id === destGroupId)

          if (!sourceGroup || !destGroup) return prevGroups

          const sourceProject = sourceGroup.projects.find((p) => p.id === sourceProjectId)
          const destProject = destGroup.projects.find((p) => p.id === destProjectId)

          if (!sourceProject || !destProject) return prevGroups

          const [movedTask] = sourceProject.tasks.splice(source.index, 1)
          destProject.tasks.splice(destination.index, 0, movedTask)

          // 完了状態を更新
          updateProjectCompletionStatus(sourceGroupId, sourceProjectId)
          updateProjectCompletionStatus(destGroupId, destProjectId)

          return newGroups
        })
      }
      return
    }

    // サブタスクの並び替え
    if (type === "subtask") {
      const [sourceGroupId, sourceProjectId, sourceTaskId] = source.droppableId.split(":")
      const [destGroupId, destProjectId, destTaskId] = destination.droppableId.split(":")

      // 同じタスク内での並び替え
      if (sourceGroupId === destGroupId && sourceProjectId === destProjectId && sourceTaskId === destTaskId) {
        setTaskGroups((prevGroups) =>
          prevGroups.map((group) => {
            if (group.id === sourceGroupId) {
              return {
                ...group,
                projects: group.projects.map((project) => {
                  if (project.id === sourceProjectId) {
                    return {
                      ...project,
                      tasks: project.tasks.map((task) => {
                        if (task.id === sourceTaskId) {
                          const newSubtasks = Array.from(task.subtasks)
                          const [removed] = newSubtasks.splice(source.index, 1)
                          newSubtasks.splice(destination.index, 0, removed)
                          return { ...task, subtasks: newSubtasks }
                        }
                        return task
                      }),
                    }
                  }
                  return project
                }),
              }
            }
            return group
          }),
        )
      } else {
        // 異なるタスク間での移動
        setTaskGroups((prevGroups) => {
          const newGroups = [...prevGroups]
          const sourceGroup = newGroups.find((g) => g.id === sourceGroupId)
          const destGroup = newGroups.find((g) => g.id === destGroupId)

          if (!sourceGroup || !destGroup) return prevGroups

          const sourceProject = sourceGroup.projects.find((p) => p.id === sourceProjectId)
          const destProject = destGroup.projects.find((p) => p.id === destProjectId)

          if (!sourceProject || !destProject) return prevGroups

          const sourceTask = sourceProject.tasks.find((t) => t.id === sourceTaskId)
          const destTask = destProject.tasks.find((t) => t.id === destTaskId)

          if (!sourceTask || !destTask) return prevGroups

          const [movedSubtask] = sourceTask.subtasks.splice(source.index, 1)
          destTask.subtasks.splice(destination.index, 0, movedSubtask)

          // 進捗状況を更新
          updateTaskProgress(sourceGroupId, sourceProjectId, sourceTaskId)
          updateTaskProgress(destGroupId, destProjectId, destTaskId)

          return newGroups
        })
      }
    }
  }

  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
  }

  // 時間変更ハンドラーを追加
  const handleTimeChange = (groupId: string, projectId: string, startTime: string, endTime: string) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            projects: group.projects.map((project) => {
              if (project.id === projectId) {
                return {
                  ...project,
                  startTime,
                  endTime,
                }
              }
              return project
            }),
          }
        }
        return group
      }),
    )
  }

  // タスクの時間変更ハンドラー
  const handleTaskTimeChange = (
    groupId: string,
    projectId: string,
    taskId: string,
    startTime: string,
    endTime: string,
  ) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            projects: group.projects.map((project) => {
              if (project.id === projectId) {
                return {
                  ...project,
                  tasks: project.tasks.map((task) => {
                    if (task.id === taskId) {
                      return {
                        ...task,
                        startTime,
                        endTime,
                      }
                    }
                    return task
                  }),
                }
              }
              return project
            }),
          }
        }
        return group
      }),
    )
  }

  /*
  // サブタスクの時間変更ハンドラー
  // 必要になったら以下のコメントを解除して使用
  const handleSubtaskTimeChange = (
    groupId: string,
    projectId: string,
    taskId: string,
    subtaskId: string,
    startTime: string,
    endTime: string,
  ) => {
    setTaskGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            projects: group.projects.map((project) => {
              if (project.id === projectId) {
                return {
                  ...project,
                  tasks: project.tasks.map((task) => {
                    if (task.id === taskId) {
                      return {
                        ...task,
                        subtasks: task.subtasks.map((subtask) => {
                          if (subtask.id === subtaskId) {
                            return {
                              ...subtask,
                              startTime,
                              endTime,
                            }
                          }
                          return subtask
                        }),
                      }
                    }
                    return task
                  }),
                }
              }
              return project
            }),
          }
        }
        return group
      }),
    )
  }
  */

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 overflow-auto p-6">
          <div className="w-full max-w-5xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">ダッシュボード</h1>
                <p className="text-sm text-gray-500">{formatDateDisplay(currentTime)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">現在時刻</p>
                  <p className="text-2xl font-bold">{formatTimeDisplay(currentTime)}</p>
                </div>
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="taskGroups" type="taskGroup">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                    {taskGroups.map((group, groupIndex) => (
                      <Draggable key={`${group.id}-${groupIndex}`} draggableId={group.id} index={groupIndex}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-6"
                          >
                            <Card>
                              <CardHeader className="bg-gray-50 p-4 flex flex-row items-center justify-between">
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-6 w-6 mr-2"
                                    onClick={() => toggleTaskGroup(group.id)}
                                  >
                                    {group.expanded ? (
                                      <ChevronDown className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                    )}
                                  </Button>
                                  <CardTitle className="text-lg font-bold">
                                    {group.id === "today" ? "### 今日のタスク" : "### 未定のタスク"}
                                  </CardTitle>
                                </div>
                              </CardHeader>

                              {group.expanded && (
                                <CardContent className="p-4">
                                  <Droppable droppableId={group.id} type="project">
                                    {(provided) => (
                                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {group.projects.map((project, projectIndex) => (
                                          <Draggable key={`${group.id}-${project.id}-${projectIndex}`} draggableId={project.id} index={projectIndex}>
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="border rounded-md overflow-hidden"
                                              >
                                                {/* プロジェクト */}
                                                <HierarchicalTaskItem
                                                  id={project.id}
                                                  title={project.title}
                                                  completed={project.completed}
                                                  level={1}
                                                  expanded={project.expanded}
                                                  hasChildren={project.tasks.length > 0}
                                                  startTime={project.startTime}
                                                  endTime={project.endTime}
                                                  onToggleExpand={() => toggleProject(group.id, project.id)}
                                                  onToggleComplete={() => toggleProjectComplete(group.id, project.id)}
                                                  onDelete={() => handleDeleteProject(group.id, project.id)}
                                                  onAddChild={() => handleAddTask(group.id, project.id)}
                                                  dragHandleProps={provided.dragHandleProps}
                                                  className="bg-gray-50"
                                                  onTimeChange={(startTime, endTime) =>
                                                    handleTimeChange(group.id, project.id, startTime, endTime)
                                                  }
                                                />

                                                {project.expanded && (
                                                  <div>
                                                    <Droppable droppableId={`${group.id}:${project.id}`} type="task">
                                                      {(provided) => (
                                                        <div
                                                          {...provided.droppableProps}
                                                          ref={provided.innerRef}
                                                          className="space-y-1"
                                                        >
                                                          {project.tasks.map((task, taskIndex) => (
                                                            <Draggable
                                                              key={`${group.id}-${project.id}-${task.id}-${taskIndex}`}
                                                              draggableId={task.id}
                                                              index={taskIndex}
                                                            >
                                                              {(provided) => (
                                                                <div
                                                                  ref={provided.innerRef}
                                                                  {...provided.draggableProps}
                                                                >
                                                                  {/* タスク */}
                                                                  <HierarchicalTaskItem
                                                                    id={task.id}
                                                                    title={task.title}
                                                                    completed={task.completed}
                                                                    level={2}
                                                                    expanded={task.expanded}
                                                                    hasChildren={task.subtasks.length > 0}
                                                                    startTime={task.startTime}
                                                                    endTime={task.endTime}
                                                                    onToggleExpand={() =>
                                                                      toggleTask(group.id, project.id, task.id)
                                                                    }
                                                                    onToggleComplete={() =>
                                                                      toggleTaskComplete(group.id, project.id, task.id)
                                                                    }
                                                                    onDelete={() =>
                                                                      handleDeleteTask(group.id, project.id, task.id)
                                                                    }
                                                                    onAddChild={() =>
                                                                      handleAddSubtask(group.id, project.id, task.id)
                                                                    }
                                                                    dragHandleProps={provided.dragHandleProps}
                                                                    onTimeChange={(startTime, endTime) =>
                                                                      handleTaskTimeChange(
                                                                        group.id,
                                                                        project.id,
                                                                        task.id,
                                                                        startTime,
                                                                        endTime,
                                                                      )
                                                                    }
                                                                  />

                                                                  {task.expanded && (
                                                                    <Droppable
                                                                      droppableId={`${group.id}:${project.id}:${task.id}`}
                                                                      type="subtask"
                                                                    >
                                                                      {(provided) => (
                                                                        <div
                                                                          {...provided.droppableProps}
                                                                          ref={provided.innerRef}
                                                                        >
                                                                          {task.subtasks.map(
                                                                            (subtask, subtaskIndex) => (
                                                                              <Draggable
                                                                                key={`${group.id}-${project.id}-${task.id}-${subtask.id}-${subtaskIndex}`}
                                                                                draggableId={subtask.id}
                                                                                index={subtaskIndex}
                                                                              >
                                                                                {(provided) => (
                                                                                  <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                  >
                                                                                    {/* サブタスク */}
                                                                                    <HierarchicalTaskItem
                                                                                      id={subtask.id}
                                                                                      title={subtask.title}
                                                                                      completed={subtask.completed}
                                                                                      level={3}
                                                                                      onToggleComplete={() =>
                                                                                        toggleSubtaskComplete(
                                                                                          group.id,
                                                                                          project.id,
                                                                                          task.id,
                                                                                          subtask.id,
                                                                                        )
                                                                                      }
                                                                                      onDelete={() =>
                                                                                        handleDeleteSubtask(
                                                                                          group.id,
                                                                                          project.id,
                                                                                          task.id,
                                                                                          subtask.id,
                                                                                        )
                                                                                      }
                                                                                      dragHandleProps={
                                                                                        provided.dragHandleProps
                                                                                      }
                                                                                      /*
                                                                                      // サブタスクの時間管理機能（現在は非表示）
                                                                                      // 必要になったら以下のコメントを解除して使用
                                                                                      // isSubtask={true}
                                                                                      // startTime={subtask.startTime}
                                                                                      // endTime={subtask.endTime}
                                                                                      // onTimeChange={(startTime, endTime) =>
                                                                                      //   handleSubtaskTimeChange(
                                                                                      //     group.id,
                                                                                      //     project.id,
                                                                                      //     task.id,
                                                                                      //     subtask.id,
                                                                                      //     startTime,
                                                                                      //     endTime,
                                                                                      //   )
                                                                                      */
                                                                                    />
                                                                                  </div>
                                                                                )}
                                                                              </Draggable>
                                                                            ),
                                                                          )}
                                                                          {provided.placeholder}
                                                                        </div>
                                                                      )}
                                                                    </Droppable>
                                                                  )}
                                                                </div>
                                                              )}
                                                            </Draggable>
                                                          ))}
                                                          {provided.placeholder}
                                                        </div>
                                                      )}
                                                    </Droppable>

                                                    {/* タスク追加ボタン */}
                                                    <div className="mt-2 pl-8">
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-500 hover:text-gray-700"
                                                        onClick={() => handleAddTask(group.id, project.id)}
                                                      >
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        タスクを追加
                                                      </Button>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {/* プロジェクト追加ボタン */}
                                        <div className="mt-4">
                                          <Button
                                            variant="outline"
                                            className="border-dashed w-full"
                                            onClick={() => handleAddProject(group.id)}
                                          >
                                            <Plus className="mr-2 h-4 w-4" />
                                            新しいプロジェクトを追加
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </Droppable>
                                </CardContent>
                              )}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </main>
      </div>

      {/* AIコーチサイドバー */}
      <AICoachSidebar />
    </div>
  )
}
