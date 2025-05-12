"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Clock } from "lucide-react"

interface TaskItemProps {
  task: {
    id: string
    title: string
    status: string
    time?: string
    tags?: string[]
  }
}

export function TaskItem({ task }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === "completed")

  const handleStatusChange = (checked: boolean) => {
    setIsCompleted(checked)
    // 実際の実装ではここでタスクのステータスを更新します
  }

  return (
    <Card className={`overflow-hidden ${task.status === "in-progress" ? "border-l-4 border-l-[#31A9B8]" : ""}`}>
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <Checkbox checked={isCompleted} onCheckedChange={handleStatusChange} className="mr-3 h-5 w-5" />
          <div className="flex-1">
            <h3 className={`font-medium ${isCompleted ? "line-through text-gray-400" : ""}`}>{task.title}</h3>
            {task.tags && task.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span key={index} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {task.time && (
            <div className="ml-2 flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
              <Clock className="h-3 w-3" />
              {task.time}
            </div>
          )}
          <Button variant="ghost" size="icon" className="ml-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
