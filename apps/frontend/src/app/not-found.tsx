"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">404 - ページが見つかりません</h2>
      <p className="text-gray-600 mb-6">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link href="/dashboard">
        <Button variant="default" className="bg-[#31A9B8] hover:bg-[#2A95A2]">
          ダッシュボードに戻る
        </Button>
      </Link>
    </div>
  )
}
