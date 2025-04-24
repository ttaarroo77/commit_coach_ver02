"use client"

import { Clock } from "lucide-react"

interface DashboardHeaderProps {
  currentTime: Date
}

export function DashboardHeader({ currentTime }: DashboardHeaderProps) {
  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
  }

  return (
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
        <div className="h-10 w-10 rounded-full bg-[#31A9B8] text-white flex items-center justify-center">
          <Clock className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
