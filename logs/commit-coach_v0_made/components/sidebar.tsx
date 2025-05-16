"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Folder, LogOut } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-56 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31A9B8] text-white">C</div>
          <span className="font-semibold">コミットコーチ</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-auto">
        {/* メインナビゲーション */}
        <div className="px-3 py-4">
          <div className="space-y-1">
            <Link href="/dashboard" className="block">
              <Button variant="ghost" className="h-9 w-full justify-start" data-active={pathname === "/dashboard"}>
                <Home className="mr-2 h-4 w-4" />
                <span>ダッシュボード</span>
              </Button>
            </Link>
            <Link href="/projects" className="block">
              <Button variant="ghost" className="h-9 w-full justify-start" data-active={pathname === "/projects"}>
                <Folder className="mr-2 h-4 w-4" />
                <span>プロジェクト一覧</span>
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button
                variant="ghost"
                className="h-9 w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              >
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
