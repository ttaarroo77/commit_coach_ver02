// app/projects/page.tsx


"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskGroup } from "@/components/task-group"
import { AICoachSidebar } from "@/components/ai-coach-sidebar"
import { useDecompose } from "@/hooks/use-decompose"
import { toast } from "@/components/ui/use-toast"

// モックデータを拡張して、expanded プロパティを追加
const mockProjects = [
  {
    id: "project-1",
    title: "要件定義・設計",
    expanded: true, // 初期状態で展開
    tasks: [
      {
        id: "task-1",
        title: "プロジェクト準備",
        completed: false,
        expanded: true, // 初期状態で展開
        subtasks: [
          { id: "subtask-1-1", title: "プロジェクトの目的と範囲の定義", completed: false },
          { id: "subtask-1-2", title: "主要なステークホルダーの特定", completed: false },
          { id: "subtask-1-3", title: "プロジェクト計画書の作成", completed: false },
        ],
      },
      {
        id: "task-2",
        title: "要件収集・分析",
        completed: false,
        expanded: false, // 初期状態では閉じる
        subtasks: [
          { id: "subtask-2-1", title: "ユーザーインタビューの実施", completed: false },
          { id: "subtask-2-2", title: "競合分析", completed: false },
          { id: "subtask-2-3", title: "機能要件の整理", completed: false },
          { id: "subtask-2-4", title: "非機能要件の整理", completed: false },
        ],
      },
    ],
  },
  {
    id: "project-2",
    title: "フロントエンド開発",
    expanded: false, // 初期状態では閉じる
    tasks: [], // 空の tasks 配列を確実に設定
  },
  {
    id: "project-3",
    title: "バックエンド連携・API実装",
    expanded: false, // 初期状態では閉じる
    tasks: [], // 空の tasks 配列を確実に設定
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)

  const handleAddProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      title: "新しいプロジェクト",
      expanded: true, // 新しいプロジェクトは自動的に展開
      tasks: [], // 空の tasks 配列を確実に初期化
    }
    setProjects([...projects, newProject])
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }

  const handleAddTask = (projectId: string) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        // プロジェクトを展開状態にする
        return {
          ...project,
          expanded: true, // プロジェクトを展開
          tasks: [
            ...project.tasks,
            {
              id: `task-${Date.now()}`,
              title: "新しいタスク",
              completed: false,
              expanded: true, // 新しいタスクは自動的に展開
              subtasks: [],
            },
          ],
        }
      }
      return project
    })
    setProjects(updatedProjects)
  }

  // タスクの展開状態を切り替える関数を追加
  const toggleProjectExpanded = (projectId: string) => {
    setProjects(
      projects.map((project) => (project.id === projectId ? { ...project, expanded: !project.expanded } : project)),
    )
  }

  // タスクの展開状態を切り替える関数を追加
  const toggleTaskExpanded = (projectId: string, taskId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, expanded: !task.expanded } : task)),
          }
        }
        return project
      }),
    )
  }

  // サブタスクを追加する関数を追加
  const handleAddSubtask = (projectId: string, taskId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  expanded: true, // タスクを展開
                  subtasks: [
                    ...task.subtasks,
                    {
                      id: `subtask-${Date.now()}`,
                      title: "新しいサブタスク",
                      completed: false,
                    },
                  ],
                }
              }
              return task
            }),
          }
        }
        return project
      }),
    )
  }

  // プロジェクトタイトル変更ハンドラ
  const handleProjectTitleChange = (projectId: string, newTitle: string) => {
    setProjects(projects.map((project) => (project.id === projectId ? { ...project, title: newTitle } : project)))
  }

  // タスクタイトル変更ハンドラ
  const handleTaskTitleChange = (projectId: string, taskId: string, newTitle: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task)),
          }
        }
        return project
      }),
    )
  }

  // サブタスクタイトル変更ハンドラ
  const handleSubtaskTitleChange = (projectId: string, taskId: string, subtaskId: string, newTitle: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId ? { ...subtask, title: newTitle } : subtask,
                  ),
                }
              }
              return task
            }),
          }
        }
        return project
      }),
    )
  }

  // タスク分解ハンドラ
  const handleBreakdown = async (
    nodeId: string,
    level: number,
    title: string,
    parentId?: string
  ) => {
    try {
      const items = await useDecompose(title, level as 1 | 2);

      setProjects((prev) =>
        prev.map((p) => {
          if (level === 1 && p.id === nodeId) {
            // Project → 新Task生成
            const newTasks = items.map((t, i) => ({
              id: `task-${Date.now()}-${i}`,
              title: t,
              completed: false,
              expanded: false,
              subtasks: [],
            }));

            toast({
              title: "タスク分解完了",
              description: `${items.length}個のタスクを追加しました`,
            });

            return {
              ...p,
              expanded: true, // 自動展開
              tasks: [...p.tasks, ...newTasks],
            };
          }
          if (level === 2) {
            // Task → SubTasks
            return {
              ...p,
              tasks: p.tasks.map((tk) => {
                if (tk.id === nodeId) {
                  const newSubtasks = items.map((s, i) => ({
                    id: `sub-${Date.now()}-${i}`,
                    title: s,
                    completed: false,
                  }));

                  toast({
                    title: "サブタスク分解完了",
                    description: `${items.length}個のサブタスクを追加しました`,
                  });

                  return {
                    ...tk,
                    expanded: true, // 自動展開
                    subtasks: [...tk.subtasks, ...newSubtasks],
                  };
                }
                return tk;
              }),
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error("タスク分解エラー:", error);
      toast({
        title: "エラー",
        description: "タスク分解に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 overflow-auto">
          <div className="w-full max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold"># プロジェクト一覧</h1>
              </div>
            </div>

            <div className="space-y-4">
              {/* プロジェクトリスト */}
              {projects.map((project) => (
                <TaskGroup
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  tasks={project.tasks || []}
                  defaultExpanded={project.expanded}
                  onDelete={() => handleDeleteProject(project.id)}
                  onAddTask={() => handleAddTask(project.id)}
                  onToggleExpand={() => toggleProjectExpanded(project.id)}
                  onAddSubtask={(taskId) => handleAddSubtask(project.id, taskId)}
                  onToggleTaskExpand={(taskId) => toggleTaskExpanded(project.id, taskId)}
                  onTitleChange={(newTitle) => handleProjectTitleChange(project.id, newTitle)}
                  onTaskTitleChange={(taskId, newTitle) => handleTaskTitleChange(project.id, taskId, newTitle)}
                  onSubtaskTitleChange={(taskId, subtaskId, newTitle) =>
                    handleSubtaskTitleChange(project.id, taskId, subtaskId, newTitle)
                  }
                  onBreakdown={handleBreakdown}
                />
              ))}

              {/* 新しいプロジェクトを追加ボタン */}
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="border-dashed" onClick={handleAddProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  新しいプロジェクトを追加
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* AIコーチサイドバー */}
      <AICoachSidebar />
    </div>
  )
}
