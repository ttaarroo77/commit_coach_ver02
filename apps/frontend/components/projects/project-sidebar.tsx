import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface ProjectSidebarProps {
  projectId: string
}

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "ダッシュボード",
      href: `/projects/${projectId}`,
    },
    {
      icon: Calendar,
      label: "スケジュール",
      href: `/projects/${projectId}/schedule`,
    },
    {
      icon: Users,
      label: "メンバー",
      href: `/projects/${projectId}/members`,
    },
    {
      icon: Settings,
      label: "設定",
      href: `/projects/${projectId}/settings`,
    },
  ]

  return (
    <div
      className={`relative flex flex-col border-r bg-background transition-all ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      <div className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={`w-full justify-start ${isCollapsed ? "px-2" : "px-4"
              }`}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && (
              <span className="ml-2">{item.label}</span>
            )}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}