import { Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, GripVertical, Plus } from "lucide-react"
import { EditableText } from "./EditableText"
import type { Task } from "@/types/dashboard"
import { motion, AnimatePresence } from "framer-motion"

interface TaskCardProps {
  task: Task
  index: number
  groupId: string
}

export function TaskCard({ task, index, groupId }: TaskCardProps) {
  // プロジェクトの色を取得する関数
  const getProjectColor = (projectId: string): string => {
    switch (projectId) {
      case "ウェブアプリ開発":
        return "bg-indigo-100 text-indigo-800"
      case "デザインプロジェクト":
        return "bg-pink-100 text-pink-800"
      case "インフラ":
        return "bg-blue-100 text-blue-800"
      case "チーム管理":
        return "bg-green-100 text-green-800"
      case "QA":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-4 ${snapshot.isDragging ? "shadow-lg" : ""}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <Card className={`${snapshot.isDragging ? "ring-2 ring-primary" : ""}`}>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      {...provided.dragHandleProps}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => {
                          // TODO: Implement toggleTaskStatus
                        }}
                      />
                    </motion.div>
                    <EditableText
                      value={task.title}
                      onChange={(newTitle) => {
                        // TODO: Implement updateTaskTitle
                      }}
                      isOverdue={false} // TODO: Implement isDateOverdue
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    {task.startTime && task.endTime && (
                      <span className="text-sm text-gray-500">
                        {task.startTime} - {task.endTime}
                      </span>
                    )}
                    {task.projectId && (
                      <motion.span
                        className={`px-2 py-1 rounded-full text-xs ${getProjectColor(task.projectId)}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {task.projectId}
                      </motion.span>
                    )}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="sm" onClick={() => {
                        // TODO: Implement toggleTask
                      }}>
                        {task.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
              <AnimatePresence>
                {task.expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {task.subtasks.map((subtask, idx) => (
                          <motion.div
                            key={subtask.id}
                            className="flex items-center space-x-2 pl-8"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                          >
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Checkbox
                                checked={subtask.completed}
                                onCheckedChange={() => {
                                  // TODO: Implement toggleSubtaskCompleted
                                }}
                              />
                            </motion.div>
                            <EditableText
                              value={subtask.title}
                              onChange={(newTitle) => {
                                // TODO: Implement updateSubtaskTitle
                              }}
                            />
                          </motion.div>
                        ))}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-8"
                            onClick={() => {
                              // TODO: Implement addSubtask
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            サブタスクを追加
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      )}
    </Draggable>
  )
}

// 日付が過ぎているかチェックする関数
const isDateOverdue = (date: string): boolean => {
  const dueDate = new Date(date)
  const today = new Date()
  return dueDate < today
} 