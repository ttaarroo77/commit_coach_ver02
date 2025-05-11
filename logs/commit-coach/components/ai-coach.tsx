"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, X } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface AICoachProps {
  isOpen: boolean
  onClose: () => void
}

export function AICoach({ isOpen, onClose }: AICoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "何かお手伝いできることはありますか？タスクの分解や優先順位付けのお手伝いができます。",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // メッセージが追加されたときに自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // AIからの応答をシミュレート
    setTimeout(() => {
      const responses = [
        "タスクを小さな単位に分解すると、より管理しやすくなります。今のプロジェクトで分解できそうなタスクはありますか？",
        "優先順位の高いタスクから取り組むと効率的です。今日の最優先タスクは何ですか？",
        "定期的に休憩を取ることも大切です。ポモドーロテクニックを試してみてはいかがでしょうか？",
        "タスクの締め切りが近づいていますね。何か手伝えることはありますか？",
        "プロジェクトの進捗状況はいかがですか？何か障害があれば教えてください。",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full border-l bg-white">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31A9B8] text-white mr-2">AI</div>
          <h3 className="font-medium">AIコミットコーチ</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31A9B8] text-white">AI</div>
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === "user" ? "bg-[#31A9B8] text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="mt-1 text-xs opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="メッセージを入力..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full bg-[#31A9B8]"
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
