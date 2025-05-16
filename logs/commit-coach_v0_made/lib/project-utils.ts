// プロジェクトデータの型定義
export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  completed: boolean
  expanded: boolean
  subtasks: SubTask[]
  dueDate?: string
}

export interface TaskGroup {
  id: string
  title: string
  expanded: boolean
  tasks: Task[]
  dueDate?: string
  completed: boolean
}

export interface ProjectData {
  projectId: string
  projectTitle: string
  taskGroups: TaskGroup[]
  projectColor?: string
  dueDate?: string
}

// デフォルトのプロジェクトデータ
const defaultProjects: Record<string, ProjectData> = {
  "web-app": {
    projectId: "web-app",
    projectTitle: "ウェブアプリ開発",
    projectColor: "#31A9B8",
    taskGroups: [
      {
        id: "group-1",
        title: "プロジェクト準備",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-1",
            title: "開発環境を構築する",
            completed: false,
            expanded: true,
            subtasks: [
              { id: "subtask-1-1", title: "Node.js, npm (または yarn, pnpm) のインストール", completed: true },
              { id: "subtask-1-2", title: "Next.js プロジェクトの作成 (create-next-app)", completed: true },
              { id: "subtask-1-3", title: "TypeScript の設定", completed: false },
              { id: "subtask-1-4", title: "Tailwind CSS の設定", completed: false },
              { id: "subtask-1-5", title: "Git リポジトリの初期化", completed: false },
            ],
          },
          // 他のタスク...
        ],
      },
      // 他のタスクグループ...
    ],
  },
  "mobile-app": {
    projectId: "mobile-app",
    projectTitle: "モバイルアプリ開発",
    projectColor: "#258039",
    taskGroups: [
      {
        id: "group-1",
        title: "開発環境構築・技術選定",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-1",
            title: "開発環境セットアップ (ローカル環境、開発ツール設定)",
            completed: true,
            expanded: true,
            subtasks: [
              { id: "subtask-1-1", title: "React Native 開発環境のセットアップ", completed: true },
              { id: "subtask-1-2", title: "Expo CLI のインストール", completed: true },
              { id: "subtask-1-3", title: "エミュレータ/シミュレータの設定", completed: true },
            ],
          },
          // 他のタスク...
        ],
      },
      // 他のタスクグループ...
    ],
  },
  design: {
    projectId: "design",
    projectTitle: "デザインプロジェクト",
    projectColor: "#F5BE41",
    taskGroups: [
      {
        id: "group-1",
        title: "リサーチ・企画",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: "task-1",
            title: "ユーザーリサーチ",
            completed: true,
            expanded: true,
            subtasks: [
              { id: "subtask-1-1", title: "ターゲットユーザーの定義", completed: true },
              { id: "subtask-1-2", title: "ユーザーインタビューの実施", completed: true },
              { id: "subtask-1-3", title: "競合分析", completed: true },
            ],
          },
          // 他のタスク...
        ],
      },
      // 他のタスクグループ...
    ],
  },
}

// ローカルストレージからプロジェクトデータを取得する関数
const getProjectsFromStorage = (): Record<string, ProjectData> => {
  if (typeof window === "undefined") return { ...defaultProjects }

  const storedProjects = localStorage.getItem("projects")
  if (!storedProjects) {
    // 初回アクセス時はデフォルトプロジェクトをストレージに保存
    localStorage.setItem("projects", JSON.stringify(defaultProjects))
    return { ...defaultProjects }
  }

  try {
    return JSON.parse(storedProjects)
  } catch (error) {
    console.error("プロジェクトデータの解析に失敗しました", error)
    return { ...defaultProjects }
  }
}

// プロジェクトデータを保存する関数
export const saveProjectsToStorage = (projects: Record<string, ProjectData>) => {
  if (typeof window === "undefined") return
  localStorage.setItem("projects", JSON.stringify(projects))
}

// 特定のプロジェクトデータを取得する関数
export const getProjectData = async (projectId: string): Promise<ProjectData> => {
  const projects = getProjectsFromStorage()

  if (projects[projectId]) {
    return projects[projectId]
  }

  throw new Error(`プロジェクト "${projectId}" が見つかりませんでした`)
}

// すべてのプロジェクトデータを取得する関数
export const getAllProjects = async (): Promise<ProjectData[]> => {
  const projects = getProjectsFromStorage()
  return Object.values(projects)
}

// 新しいプロジェクトを作成する関数
export const createNewProject = async (title: string): Promise<ProjectData> => {
  const projects = getProjectsFromStorage()

  // プロジェクトIDを生成（タイトルをスラッグ化）
  const projectId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .concat(`-${Date.now().toString().slice(-4)}`)

  // ランダムな色を生成
  const colors = ["#31A9B8", "#258039", "#F5BE41", "#CF3721", "#8067B7", "#E85D75"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  // 新しいプロジェクトデータを作成
  const newProject: ProjectData = {
    projectId,
    projectTitle: title,
    projectColor: randomColor,
    taskGroups: [
      {
        id: `group-${Date.now()}`,
        title: "はじめに",
        expanded: true,
        completed: false,
        tasks: [
          {
            id: `task-${Date.now()}`,
            title: "プロジェクト計画を立てる",
            completed: false,
            expanded: true,
            subtasks: [
              { id: `subtask-${Date.now()}-1`, title: "目標を設定する", completed: false },
              { id: `subtask-${Date.now()}-2`, title: "タスクを分解する", completed: false },
              { id: `subtask-${Date.now()}-3`, title: "スケジュールを作成する", completed: false },
            ],
          },
        ],
      },
    ],
  }

  // プロジェクトを保存
  projects[projectId] = newProject
  saveProjectsToStorage(projects)

  return newProject
}

// プロジェクトを削除する関数
export const deleteProject = async (projectId: string): Promise<void> => {
  const projects = getProjectsFromStorage()

  if (!projects[projectId]) {
    throw new Error(`プロジェクト "${projectId}" が見つかりませんでした`)
  }

  delete projects[projectId]
  saveProjectsToStorage(projects)
}

// プロジェクトデータを更新する関数
export const updateProject = async (projectId: string, data: Partial<ProjectData>): Promise<ProjectData> => {
  const projects = getProjectsFromStorage()

  if (!projects[projectId]) {
    throw new Error(`プロジェクト "${projectId}" が見つかりませんでした`)
  }

  projects[projectId] = { ...projects[projectId], ...data }
  saveProjectsToStorage(projects)

  return projects[projectId]
}
