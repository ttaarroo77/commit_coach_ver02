"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { LoadingSpinner } from "./ui/loading-spinner"
import { ErrorMessage } from "./ui/error-message"

// 時刻フォーマット関数 - サーバー・クライアント間で一貫した形式を提供
const formatTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "何かお手伝いできることはありますか？タスクの分解や優先順位付けのお手伝いができます。",
      timestamp: formatTime(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return
    setError(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: formatTime(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // 実際の実装ではここでAIからの応答を取得します
      // 現在はモック応答を返します
      await new Promise(resolve => setTimeout(resolve, 1500))

      // ランダムな応答を選択
      const responses = [
        "了解しました。タスクの進捗状況を教えていただけますか？",
        "タスクを小さな単位に分解すると、より効率的に進められるかもしれません。",
        "優先度の高いタスクから取り組むことをお勧めします。何か具体的なタスクはありますか？",
        "タスクの期限が近づいているものはありますか？一緒に確認しましょう。",
        "コミットメッセージの書き方についてアドバイスが必要ですか？"
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: formatTime(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      console.error("AI応答の取得に失敗しました", err)
      setError("AI応答の取得に失敗しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border bg-white ai-chat-container">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="text-sm font-medium">AIコミットコーチ</h3>
        <p className="text-xs text-gray-500">タスク管理や優先順位付けのアドバイスを提供します</p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {error && <ErrorMessage message={error} dismissible />}
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
                className={`rounded-lg p-3 ${message.role === "user" ? "bg-[#31A9B8] text-white" : "bg-gray-100 text-gray-800"
                  }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="mt-1 text-xs opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31A9B8] text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-lg bg-gray-100 p-3 text-gray-800">
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <p className="text-sm">応答を生成中...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="メッセージを入力..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
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
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
