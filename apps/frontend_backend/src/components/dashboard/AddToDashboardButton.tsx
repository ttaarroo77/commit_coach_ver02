'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export const AddToDashboardButton = ({
  itemId,
  itemType
}: {
  itemId: string
  itemType: 'task' | 'project'
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAdd = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/dashboard/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: itemType, id: itemId })
      })

      if (!response.ok) throw new Error()

      toast({
        title: "追加成功",
        description: "ダッシュボードに追加しました",
      })
    } catch {
      toast({
        title: "エラー",
        description: "追加に失敗しました",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAdd}
      disabled={isLoading}
      className="text-sm"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      ダッシュボードに追加
    </Button>
  )
}
