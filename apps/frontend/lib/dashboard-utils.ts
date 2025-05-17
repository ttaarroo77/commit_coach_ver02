// lib- > dashboard-utils.ts

// nanoidのインポート（インストールが必要な場合はnpm install nanoid）
import { nanoid } from 'nanoid';

// ダッシュボードに追加するタスクの型定義
export interface SubTask {
  id: string
  title: string
  completed: boolean
  // 以下の時間関連フィールドは現在は使用しないためコメントアウト
  /*
  startTime?: string
  endTime?: string
  */
}

export interface Task {
  id: string
  title: string
  completed: boolean
  expanded: boolean
  subtasks: SubTask[]
  startTime?: string
  endTime?: string
  status: "todo" | "in-progress" | "completed"
  project?: string
  priority?: string
  progress: number
}

export interface Project {
  id: string
  title: string
  completed: boolean
  expanded: boolean
  tasks: Task[]
  startTime?: string
  endTime?: string
  status: "todo" | "in-progress" | "completed"
  priority?: string
}

export interface TaskGroup {
  id: string
  title: string
  expanded: boolean
  projects: Project[]
}

// ダッシュボードのタスクをローカルストレージから取得
export const getDashboardData = (): TaskGroup[] => {
  if (typeof window === "undefined") return getDefaultDashboardData()

  const storedData = localStorage.getItem("dashboardData")
  if (!storedData) {
    // 初回アクセス時はデフォルトデータをストレージに保存
    const defaultData = getDefaultDashboardData()
    localStorage.setItem("dashboardData", JSON.stringify(defaultData))
    return defaultData
  }

  try {
    return JSON.parse(storedData)
  } catch (error) {
    console.error("ダッシュボードデータの解析に失敗しました", error)
    return getDefaultDashboardData()
  }
}

// ダッシュボードのデータをローカルストレージに保存
export const saveDashboardData = (data: TaskGroup[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("dashboardData", JSON.stringify(data))
}

// デフォルトのダッシュボードデータを取得
export const getDefaultDashboardData = (): TaskGroup[] => {
  // 一意のグループIDを生成
  const todayGroupId = makeGroupId();
  const unscheduledGroupId = makeGroupId();

  return [
    {
      id: todayGroupId, // 一意のIDを使用
      title: "今日のタスク",
      expanded: true,
      projects: [
        {
          id: "project-1",
          title: "チーム管理",
          completed: false,
          expanded: true,
          tasks: [
            {
              id: "task-1",
              title: "朝のミーティング",
              completed: true,
              expanded: true,
              subtasks: [
                { id: "subtask-1-1", title: "議事録作成", completed: true },
                { id: "subtask-1-2", title: "タスク割り当て", completed: true },
              ],
              startTime: "09:00",
              endTime: "10:00",
              status: "completed",
              priority: "中",
              progress: 100,
            },
            {
              id: "task-3",
              title: "ランチミーティング",
              completed: true,
              expanded: false,
              subtasks: [],
              startTime: "13:00",
              endTime: "14:00",
              status: "completed",
              priority: "低",
              progress: 100,
            },
          ],
          status: "in-progress",
        },
        {
          id: "project-2",
          title: "ウェブアプリ開発",
          completed: false,
          expanded: true,
          tasks: [
            {
              id: "task-2",
              title: "ログイン機能の実装",
              completed: true,
              expanded: false,
              subtasks: [
                { id: "subtask-2-1", title: "UI設計", completed: true },
                { id: "subtask-2-2", title: "バックエンド連携", completed: true },
                { id: "subtask-2-3", title: "テスト", completed: true },
              ],
              startTime: "10:00",
              endTime: "13:00",
              status: "completed",
              priority: "高",
              progress: 100,
            },
            {
              id: "task-4",
              title: "APIエンドポイントの実装",
              completed: false,
              expanded: true,
              subtasks: [
                { id: "subtask-4-1", title: "認証エンドポイント", completed: true },
                { id: "subtask-4-2", title: "ユーザー管理API", completed: false },
                { id: "subtask-4-3", title: "データ取得API", completed: false },
              ],
              startTime: "14:00",
              endTime: "16:00",
              status: "in-progress",
              priority: "高",
              progress: 50,
            },
          ],
          status: "in-progress",
        },
        {
          id: "project-3",
          title: "デザインプロジェクト",
          completed: false,
          expanded: true,
          tasks: [
            {
              id: "task-5",
              title: "ダッシュボード画面のデザイン",
              completed: false,
              expanded: true,
              subtasks: [
                { id: "subtask-5-1", title: "ワイヤーフレーム作成", completed: false },
                { id: "subtask-5-2", title: "コンポーネント設計", completed: false },
                { id: "subtask-5-3", title: "レスポンシブ対応", completed: false },
              ],
              startTime: "16:00",
              endTime: "18:00",
              status: "todo",
              priority: "中",
              progress: 0,
            },
          ],
          status: "todo",
        },
      ],
    },
    {
      id: unscheduledGroupId, // 一意のIDを使用
      title: "未定のタスク",
      expanded: true,
      projects: [
        {
          id: "project-4",
          title: "ウェブアプリ開発",
          completed: false,
          expanded: true,
          tasks: [
            {
              id: "task-6",
              title: "レスポンシブデザインの実装",
              completed: false,
              expanded: true,
              subtasks: [
                { id: "subtask-6-1", title: "モバイル対応", completed: false },
                { id: "subtask-6-2", title: "タブレット対応", completed: false },
              ],
              status: "todo",
              priority: "中",
              progress: 0,
            },
            {
              id: "task-7",
              title: "ユーザー設定画面の作成",
              completed: false,
              expanded: false,
              subtasks: [
                { id: "subtask-7-1", title: "プロフィール編集機能", completed: false },
                { id: "subtask-7-2", title: "パスワード変更機能", completed: false },
                { id: "subtask-7-3", title: "通知設定機能", completed: false },
              ],
              status: "todo",
              priority: "低",
              progress: 0,
            },
          ],
          status: "todo",
        },
        {
          id: "project-5",
          title: "QA",
          completed: false,
          expanded: true,
          tasks: [
            {
              id: "task-8",
              title: "テスト計画書の作成",
              completed: false,
              expanded: true,
              subtasks: [
                { id: "subtask-8-1", title: "テスト範囲の定義", completed: false },
                { id: "subtask-8-2", title: "テストケースの作成", completed: false },
              ],
              status: "todo",
              priority: "高",
              progress: 0,
            },
          ],
          status: "todo",
        },
      ],
    },
  ]
}

// プロジェクト一覧からプロジェクトをダッシュボードに追加（階層構造を維持）
export const addProjectToDashboard = (projectId: string, projectTitle: string, groupId = ""): void => {
  const now = new Date()
  const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

  // プロジェクト一覧からプロジェクトデータを取得（実際の実装ではAPIやデータベースから取得）
  let projectData: Project | null = null

  // ローカルストレージからプロジェクト一覧を取得
  try {
    const projectsData = localStorage.getItem("projects")
    if (projectsData) {
      const projects = JSON.parse(projectsData)
      if (projects[projectId]) {
        // プロジェクトデータを取得
        const sourceProject = projects[projectId]

        // グループを見つける
        const dashboardData = getDashboardData()
        // 指定されたgroupIdが空または存在しない場合は最初のグループを使用
        let targetGroup = groupId ? dashboardData.find(g => g.id === groupId) : null
        if (!targetGroup) {
          targetGroup = dashboardData[0] // 最初のグループを使用
        }

        // ダッシュボード用のプロジェクトデータを作成
        projectData = {
          id: projectId,
          title: sourceProject.projectTitle || projectTitle,
          completed: false,
          expanded: true,
          tasks: [],
          // 今日のタスクグループの場合だけ時間を設定
          startTime: targetGroup.title === "今日のタスク" ? startTime : undefined,
          endTime: targetGroup.title === "今日のタスク" ? endTime : undefined,
          status: "todo",
          priority: "中",
        }

        // タスクグループを変換
        if (sourceProject.taskGroups && Array.isArray(sourceProject.taskGroups)) {
          sourceProject.taskGroups.forEach((taskGroup) => {
            if (taskGroup.tasks && Array.isArray(taskGroup.tasks)) {
              taskGroup.tasks.forEach((task) => {
                // タスクを追加
                const newTask: Task = {
                  id: task.id,
                  title: task.title,
                  completed: task.completed || false,
                  expanded: false, // 初期状態では折りたたむ
                  subtasks: [],
                  status: task.completed ? "completed" : "todo",
                  progress: task.completed ? 100 : 0,
                  priority: "中",
                }

                // サブタスクを追加
                if (task.subtasks && Array.isArray(task.subtasks)) {
                  newTask.subtasks = task.subtasks.map((subtask) => ({
                    id: subtask.id,
                    title: subtask.title,
                    completed: subtask.completed || false,
                  }))

                  // サブタスクの完了状態に基づいてタスクの進捗を計算
                  if (newTask.subtasks.length > 0) {
                    const completedSubtasks = newTask.subtasks.filter((st) => st.completed).length
                    newTask.progress = Math.round((completedSubtasks / newTask.subtasks.length) * 100)
                    newTask.status =
                      newTask.progress === 100 ? "completed" : newTask.progress > 0 ? "in-progress" : "todo"
                  }
                }

                projectData?.tasks.push(newTask)
              })
            }
          })
        }
      }
    }
  } catch (error) {
    console.error("プロジェクトデータの取得に失敗しました", error)
  }

  // プロジェクトデータが取得できなかった場合は新規作成
  if (!projectData) {
    projectData = {
      id: projectId || `project-${Date.now()}`,
      title: projectTitle,
      completed: false,
      expanded: true,
      tasks: [],
      startTime: groupId === "today" ? startTime : undefined,
      endTime: groupId === "today" ? endTime : undefined,
      status: "todo",
      priority: "中",
    }
  }

  const dashboardData = getDashboardData()
  const updatedData = dashboardData.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        projects: [...group.projects, projectData!],
      }
    }
    return group
  })

  saveDashboardData(updatedData)
}

// タスクをプロジェクトに追加（サブタスクも含めて）
export const addTaskToProject = (taskTitle: string, projectId: string, groupId: string, sourceTaskData?: any): void => {
  const dashboardData = getDashboardData()

  // グループを見つける
  const targetGroup = dashboardData.find(g => g.id === groupId)
  if (!targetGroup) return; // グループが見つからない場合は終了

  const updatedData = dashboardData.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        projects: group.projects.map((project) => {
          if (project.id === projectId) {
            // ソースタスクデータがある場合はそれを使用
            let newTask: Task

            if (sourceTaskData) {
              // ソースタスクデータから新しいタスクを作成
              newTask = {
                id: sourceTaskData.id || `task-${Date.now()}`,
                title: sourceTaskData.title || taskTitle,
                completed: sourceTaskData.completed || false,
                expanded: false, // 初期状態では折りたたむ
                subtasks: [],
                status: sourceTaskData.completed ? "completed" : "todo",
                progress: sourceTaskData.completed ? 100 : 0,
                priority: "中",
              }

              // サブタスクを追加
              if (sourceTaskData.subtasks && Array.isArray(sourceTaskData.subtasks)) {
                newTask.subtasks = sourceTaskData.subtasks.map((subtask: any) => ({
                  id: subtask.id || `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                  title: subtask.title,
                  completed: subtask.completed || false,
                }))

                // サブタスクの完了状態に基づいてタスクの進捗を計算
                if (newTask.subtasks.length > 0) {
                  const completedSubtasks = newTask.subtasks.filter((st) => st.completed).length
                  newTask.progress = Math.round((completedSubtasks / newTask.subtasks.length) * 100)
                  newTask.status =
                    newTask.progress === 100 ? "completed" : newTask.progress > 0 ? "in-progress" : "todo"
                }
              }
            } else {
              // 新規タスクを作成
              newTask = {
                id: `task-${Date.now()}`,
                title: taskTitle,
                completed: false,
                expanded: true,
                subtasks: [],
                status: "todo",
                priority: "中",
                progress: 0,
              }
            }

            // 今日のタスクの場合は時間を設定
            if (targetGroup.title === "今日のタスク") {
              const now = new Date()
              newTask.startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
              newTask.endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
            }

            return {
              ...project,
              tasks: [...project.tasks, newTask],
            }
          }
          return project
        }),
      }
    }
    return group
  })

  saveDashboardData(updatedData)
}

// タスクをダッシュボードに追加（サブタスクも含めて）
export const addTaskToDashboard = (
  taskId: string,
  taskTitle: string,
  projectTitle?: string,
  groupId = ""
): void => {
  // グループIDが空の場合は、最初のグループを使用（通常は「今日のタスク」）
  const dashboardData = getDashboardData();
  let targetGroupId = groupId;
  if (!targetGroupId && dashboardData.length > 0) {
    targetGroupId = dashboardData[0].id;
  }

  // プロジェクト一覧からタスクデータを取得（実際の実装ではAPIやデータベースから取得）
  let taskData: any = null
  let foundProject = false

  // ローカルストレージからプロジェクト一覧を取得
  try {
    const projectsData = localStorage.getItem("projects")
    if (projectsData) {
      const projects = JSON.parse(projectsData)

      // すべてのプロジェクトを検索
      Object.values(projects).forEach((project: any) => {
        if (project.taskGroups && Array.isArray(project.taskGroups)) {
          project.taskGroups.forEach((taskGroup: any) => {
            if (taskGroup.tasks && Array.isArray(taskGroup.tasks)) {
              const task = taskGroup.tasks.find((t: any) => t.id === taskId)
              if (task) {
                taskData = task
                foundProject = true
                return
              }
            }
          })
          if (foundProject) return
        }
      })
    }
  } catch (error) {
    console.error("タスクデータの取得に失敗しました", error)
  }

  // プロジェクトを探す、または新規作成
  let targetProject: Project | null = null

  // プロジェクトタイトルが指定されている場合は、そのプロジェクトを探す
  if (projectTitle) {
    // 指定されたグループ内でプロジェクトを探す
    const group = dashboardData.find((g) => g.id === targetGroupId)
    if (group) {
      targetProject = group.projects.find((p) => p.title === projectTitle) || null
    }

    // プロジェクトが見つからない場合は新規作成
    if (!targetProject) {
      const now = new Date()
      const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      targetProject = {
        id: `project-${Date.now()}`,
        title: projectTitle,
        completed: false,
        expanded: true,
        tasks: [],
        startTime: targetGroupId === "today" ? startTime : undefined,
        endTime: targetGroupId === "today" ? endTime : undefined,
        status: "todo",
        priority: "中",
      }

      // 新規プロジェクトをダッシュボードに追加
      const updatedData = dashboardData.map((group) => {
        if (group.id === targetGroupId) {
          return {
            ...group,
            projects: [...group.projects, targetProject!],
          }
        }
        return group
      })

      saveDashboardData(updatedData)
    }

    // タスクをプロジェクトに追加
    addTaskToProject(taskTitle, targetProject.id, targetGroupId, taskData)
  } else {
    // プロジェクトタイトルが指定されていない場合は、「その他」プロジェクトを作成または使用
    const group = dashboardData.find((g) => g.id === targetGroupId)
    if (group) {
      targetProject = group.projects.find((p) => p.title === "その他") || null
    }

    if (!targetProject) {
      const now = new Date()
      const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      targetProject = {
        id: `project-other-${Date.now()}`,
        title: "その他",
        completed: false,
        expanded: true,
        tasks: [],
        startTime: targetGroupId === "today" ? startTime : undefined,
        endTime: targetGroupId === "today" ? endTime : undefined,
        status: "todo",
        priority: "中",
      }

      // 「その他」プロジェクトをダッシュボードに追加
      const updatedData = dashboardData.map((group) => {
        if (group.id === targetGroupId) {
          return {
            ...group,
            projects: [...group.projects, targetProject!],
          }
        }
        return group
      })

      saveDashboardData(updatedData)
    }

    // タスクをプロジェクトに追加
    addTaskToProject(taskTitle, targetProject.id, targetGroupId, taskData)
  }
}

// サブタスクをタスクに追加
export const addSubtaskToTask = (subtaskTitle: string, taskId: string, projectId: string, groupId: string): void => {
  const dashboardData = getDashboardData()
  const updatedData = dashboardData.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        projects: group.projects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: project.tasks.map((task) => {
                if (task.id === taskId) {
                  const newSubtask: SubTask = {
                    id: `subtask-${Date.now()}`,
                    title: subtaskTitle,
                    completed: false,
                  }
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
  })

  saveDashboardData(updatedData)
}

// サブタスクをダッシュボードに追加
export const addSubtaskToDashboard = (
  subtaskId: string,
  subtaskTitle: string,
  taskTitle?: string,
  projectTitle?: string,
  groupId = ""
): void => {
  // グループIDが空の場合は、最初のグループを使用（通常は「今日のタスク」）
  const dashboardData = getDashboardData();
  let targetGroupId = groupId;
  if (!targetGroupId && dashboardData.length > 0) {
    targetGroupId = dashboardData[0].id;
  }

  // プロジェクト一覧からサブタスクデータを取得（実際の実装ではAPIやデータベースから取得）
  let subtaskData: any = null
  let parentTaskData: any = null
  let foundSubtask = false

  // ローカルストレージからプロジェクト一覧を取得
  try {
    const projectsData = localStorage.getItem("projects")
    if (projectsData) {
      const projects = JSON.parse(projectsData)

      // すべてのプロジェクトを検索
      Object.values(projects).forEach((project: any) => {
        if (project.taskGroups && Array.isArray(project.taskGroups)) {
          project.taskGroups.forEach((taskGroup: any) => {
            if (taskGroup.tasks && Array.isArray(taskGroup.tasks)) {
              taskGroup.tasks.forEach((task: any) => {
                if (task.subtasks && Array.isArray(task.subtasks)) {
                  const subtask = task.subtasks.find((st: any) => st.id === subtaskId)
                  if (subtask) {
                    subtaskData = subtask
                    parentTaskData = task
                    foundSubtask = true
                    return
                  }
                }
              })
              if (foundSubtask) return
            }
          })
          if (foundSubtask) return
        }
      })
    }
  } catch (error) {
    console.error("サブタスクデータの取得に失敗しました", error)
  }

  // ダッシュボードデータを取得
  const dashboardData = getDashboardData()

  // プロジェクトとタスクを探す、または新規作成
  let targetProject: Project | null = null
  let targetTask: Task | null = null

  // プロジェクトタイトルが指定されている場合は、そのプロジェクトを探す
  if (projectTitle) {
    // 指定されたグループ内でプロジェクトを探す
    const group = dashboardData.find((g) => g.id === targetGroupId)
    if (group) {
      targetProject = group.projects.find((p) => p.title === projectTitle) || null
    }

    // プロジェクトが見つからない場合は新規作成
    if (!targetProject) {
      const now = new Date()
      const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      targetProject = {
        id: `project-${Date.now()}`,
        title: projectTitle,
        completed: false,
        expanded: true,
        tasks: [],
        startTime: targetGroupId === "today" ? startTime : undefined,
        endTime: targetGroupId === "today" ? endTime : undefined,
        status: "todo",
        priority: "中",
      }

      // 新規プロジェクトをダッシュボードに追加
      const updatedData = dashboardData.map((group) => {
        if (group.id === targetGroupId) {
          return {
            ...group,
            projects: [...group.projects, targetProject!],
          }
        }
        return group
      })

      saveDashboardData(updatedData)
    }

    // タスクタイトルが指定されている場合は、そのタスクを探す
    if (taskTitle) {
      targetTask = targetProject.tasks.find((t) => t.title === taskTitle) || null

      // タスクが見つからない場合は新規作成
      if (!targetTask) {
        const now = new Date()
        const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
        const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

        targetTask = {
          id: `task-${Date.now()}`,
          title: taskTitle || (parentTaskData ? parentTaskData.title : "新しいタスク"),
          completed: false,
          expanded: true,
          subtasks: [],
          startTime: targetGroupId === "today" ? startTime : undefined,
          endTime: targetGroupId === "today" ? endTime : undefined,
          status: "todo",
          priority: "中",
          progress: 0,
        }

        // 新規タスクをプロジェクトに追加
        const updatedData = dashboardData.map((group) => {
          if (group.id === targetGroupId) {
            return {
              ...group,
              projects: group.projects.map((project) => {
                if (project.id === targetProject!.id) {
                  return {
                    ...project,
                    tasks: [...project.tasks, targetTask!],
                  }
                }
                return project
              }),
            }
          }
          return group
        })

        saveDashboardData(updatedData)
      }

      // サブタスクをタスクに追加
      const newSubtask: SubTask = {
        id: subtaskId || `subtask-${Date.now()}`,
        title: subtaskData ? subtaskData.title : subtaskTitle,
        completed: subtaskData ? subtaskData.completed : false,
      }

      const updatedData = dashboardData.map((group) => {
        if (group.id === targetGroupId) {
          return {
            ...group,
            projects: group.projects.map((project) => {
              if (project.id === targetProject!.id) {
                return {
                  ...project,
                  tasks: project.tasks.map((task) => {
                    if (task.id === targetTask!.id) {
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
      })

      saveDashboardData(updatedData)
    } else {
      // タスクタイトルが指定されていない場合は、「その他」タスクを作成または使用
      targetTask = targetProject.tasks.find((t) => t.title === "その他") || null

      if (!targetTask) {
        const now = new Date()
        const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
        const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

        targetTask = {
          id: `task-other-${Date.now()}`,
          title: "その他",
          completed: false,
          expanded: true,
          subtasks: [],
          startTime: targetGroupId === "today" ? startTime : undefined,
          endTime: targetGroupId === "today" ? endTime : undefined,
          status: "todo",
          priority: "中",
          progress: 0,
        }

        // 「その他」タスクをプロジェクトに追加
        const updatedData = dashboardData.map((group) => {
          if (group.id === targetGroupId) {
            return {
              ...group,
              projects: group.projects.map((project) => {
                if (project.id === targetProject!.id) {
                  return {
                    ...project,
                    tasks: [...project.tasks, targetTask!],
                  }
                }
                return project
              }),
            }
          }
          return group
        })

        saveDashboardData(updatedData)
      }

      // サブタスクをタスクに追加
      const newSubtask: SubTask = {
        id: subtaskId || `subtask-${Date.now()}`,
        title: subtaskData ? subtaskData.title : subtaskTitle,
        completed: subtaskData ? subtaskData.completed : false,
      }

      const updatedData = dashboardData.map((group) => {
        if (group.id === targetGroupId) {
          return {
            ...group,
            projects: group.projects.map((project) => {
              if (project.id === targetProject!.id) {
                return {
                  ...project,
                  tasks: project.tasks.map((task) => {
                    if (task.id === targetTask!.id) {
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
      })

      saveDashboardData(updatedData)
    }
  } else {
    // プロジェクトタイトルが指定されていない場合は、「その他」プロジェクトを作成または使用
    const group = dashboardData.find((g) => g.id === targetGroupId)
    if (group) {
      targetProject = group.projects.find((p) => p.title === "その他") || null
    }

    if (!targetProject) {
      const now = new Date()
      const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      targetProject = {
        id: `project-other-${Date.now()}`,
        title: "その他",
        completed: false,
        expanded: true,
        tasks: [],
        startTime: targetGroupId === "today" ? startTime : undefined,
        endTime: targetGroupId === "today" ? endTime : undefined,
        status: "todo",
        priority: "中",
      }

      // 「その他」プロジェクトをダッシュボードに追加
      const updatedData = dashboardData.map((group) => {
        if (group.id === targetGroupId) {
          return {
            ...group,
            projects: [...group.projects, targetProject!],
          }
        }
        return group
      })

      saveDashboardData(updatedData)
    }

    // 「その他」タスクを作成または使用
    targetTask = targetProject.tasks.find((t) => t.title === "その他") || null

    if (!targetTask) {
      const now = new Date()
      const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const endTime = `${(now.getHours() + 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      targetTask = {
        id: `task-other-${Date.now()}`,
        title: "その他",
        completed: false,
        expanded: true,
        subtasks: [],
        startTime: targetGroupId === "today" ? startTime : undefined,
        endTime: targetGroupId === "today" ? endTime : undefined,
        status: "todo",
        priority: "中",
        progress: 0,
      }

      // 「その他」タスクをプロジェクトに追加
      const updatedData = dashboardData.map((group) => {
        if (group.id === targetGroupId) {
          return {
            ...group,
            projects: group.projects.map((project) => {
              if (project.id === targetProject!.id) {
                return {
                  ...project,
                  tasks: [...project.tasks, targetTask!],
                }
              }
              return project
            }),
          }
        }
        return group
      })

      saveDashboardData(updatedData)
    }

    // サブタスクをタスクに追加
    const newSubtask: SubTask = {
      id: subtaskId || `subtask-${Date.now()}`,
      title: subtaskData ? subtaskData.title : subtaskTitle,
      completed: subtaskData ? subtaskData.completed : false,
    }

    const updatedData = dashboardData.map((group) => {
      if (group.id === targetGroupId) {
        return {
          ...group,
          projects: group.projects.map((project) => {
            if (project.id === targetProject!.id) {
              return {
                ...project,
                tasks: project.tasks.map((task) => {
                  if (task.id === targetTask!.id) {
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
    })

    saveDashboardData(updatedData)
  }
}

// 進捗率を計算
export const calculateProgress = (subtasks: SubTask[]) => {
  if (subtasks.length === 0) return 0
  const completedCount = subtasks.filter((subtask) => subtask.completed).length
  return Math.round((completedCount / subtasks.length) * 100)
}

// プロジェクトごとの色を返す関数
export const getProjectColor = (project: string) => {
  switch (project) {
    case "チーム管理":
      return "bg-[#31A9B8]/10 text-[#31A9B8]"
    case "ウェブアプリ開発":
      return "bg-[#258039]/10 text-[#258039]"
    case "デザインプロジェクト":
      return "bg-[#F5BE41]/10 text-[#F5BE41]"
    case "QA":
      return "bg-[#CF3721]/10 text-[#CF3721]"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

/**
 * 一意のグループIDを生成する
 * @param date 日付（デフォルトは現在の日付）
 * @returns 日付とランダムな文字列を組み合わせた一意のID
 */
export const makeGroupId = (date: Date = new Date()): string =>
  `${date.toISOString().slice(0,10)}-${nanoid(6)}`;

/**
 * ドラッグ&ドロップで使用する複合IDを生成する
 * @param groupId グループID
 * @param projectId プロジェクトID
 * @returns 複合ID（形式: "groupId:projectId"）
 */
export const makeDragId = (groupId: string, projectId: string): string =>
  `${groupId}:${projectId}`;

/**
 * タスク用の複合IDを生成する
 * @param groupId グループID
 * @param projectId プロジェクトID
 * @param taskId タスクID
 * @returns 複合ID（形式: "groupId:projectId:taskId"）
 */
export const makeTaskDragId = (groupId: string, projectId: string, taskId: string): string =>
  `${groupId}:${projectId}:${taskId}`;

/**
 * サブタスク用の複合IDを生成する
 * @param groupId グループID
 * @param projectId プロジェクトID
 * @param taskId タスクID
 * @param subtaskId サブタスクID
 * @returns 複合ID（形式: "groupId:projectId:taskId:subtaskId"）
 */
export const makeSubtaskDragId = (
  groupId: string,
  projectId: string,
  taskId: string,
  subtaskId: string
): string => `${groupId}:${projectId}:${taskId}:${subtaskId}`;

/**
 * 複合IDからグループIDとプロジェクトIDを取得する
 * @param dragId 複合ID
 * @returns グループIDとプロジェクトIDのオブジェクト
 */
export const splitDragId = (dragId: string): { groupId: string; projectId: string } => {
  const [groupId, projectId] = dragId.split(':');
  return { groupId, projectId };
};

/**
 * 複合IDからグループID、プロジェクトID、タスクIDを取得する
 * @param dragId 複合ID
 * @returns グループID、プロジェクトID、タスクIDのオブジェクト
 */
export const splitTaskDragId = (dragId: string): { groupId: string; projectId: string; taskId: string } => {
  const [groupId, projectId, taskId] = dragId.split(':');
  return { groupId, projectId, taskId };
};

/**
 * 複合IDからグループID、プロジェクトID、タスクID、サブタスクIDを取得する
 * @param dragId 複合ID
 * @returns グループID、プロジェクトID、タスクID、サブタスクIDのオブジェクト
 */
export const splitSubtaskDragId = (
  dragId: string
): { groupId: string; projectId: string; taskId: string; subtaskId: string } => {
  const [groupId, projectId, taskId, subtaskId] = dragId.split(':');
  return { groupId, projectId, taskId, subtaskId };
};

// 「今日のタスク」グループを探す
const getGroupByTitle = (title: string, groups: TaskGroup[]): TaskGroup | undefined => {
  return groups.find(group => group.title === title);
}
