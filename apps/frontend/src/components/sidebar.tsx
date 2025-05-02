"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Home, User, Settings, LogOut, Plus } from "lucide-react"

export function Sidebar() {
  // プロジェクトリストの状態
  const [projects, setProjects] = useState([
    {
      id: "web-app",
      name: "ウェブアプリ開発",
      color: "#31A9B8",
      href: "/projects/web-app",
    },
    {
      id: "mobile-app",
      name: "モバイルアプリ開発",
      color: "#258039",
      href: "/projects/mobile-app",
    },
    {
      id: "design",
      name: "デザインプロジェクト",
      color: "#F5BE41",
      href: "/projects/design",
    },
  ])

  // 現在のURLからアクティブなプロジェクトを特定
  const [activeProject, setActiveProject] = useState("")

  useEffect(() => {
    // クライアントサイドでのみ実行
    const path = window.location.pathname
    const projectId = path.split("/projects/")[1]
    if (projectId) {
      setActiveProject(projectId)
    }

    // プロジェクト削除イベントをリッスン - 連携サービス部分をコメントアウト
    /*
    const handleProjectDeleted = (event: CustomEvent) => {
      const deletedProjectId = event.detail.projectId
      setProjects((prev) => prev.filter((project) => project.id !== deletedProjectId))
    }

    window.addEventListener("projectDeleted" as any, handleProjectDeleted)

    return () => {
      window.removeEventListener("projectDeleted" as any, handleProjectDeleted)
    }
    */
  }, [])

  return (
    <div className="flex h-screen w-56 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31A9B8] text-white">C</div>
          <span className="font-semibold">コミットコーチ</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-auto py-2">
        <div className="px-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase text-gray-500">プロジェクト</h2>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ChevronDown className="mr-2 h-4 w-4" />
              <span>マイプロジェクト</span>
            </Button>
            <div className="ml-4 space-y-1">
              {projects.map((project) => (
                <Link key={project.id} href={project.href} className="block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 ${
                      activeProject === project.id ? `text-[${project.color}]` : "text-gray-700"
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }}></div>
                    <span>{project.name}</span>
                  </Button>
                </Link>
              ))}
              <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500">
                <Plus className="mr-2 h-4 w-4" />
                <span>新しいプロジェクト</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-auto px-3">
          <div className="space-y-1">
            <Link href="/dashboard" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                <span>ダッシュボード</span>
              </Button>
            </Link>
            <Link href="/mypage" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                <span>マイページ</span>
              </Button>
            </Link>
            <Link href="/settings" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                <span>設定</span>
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                <span>ログアウト</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
