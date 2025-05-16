"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface AIChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export function AIChatInput({ onSendMessage, isLoading = false }: AIChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
      <div className="max-w-5xl mx-auto flex">
        <Input
          className="flex-1"
          placeholder="メッセージを入力..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" className="ml-2 bg-[#31A9B8] hover:bg-[#2a8f9c]" disabled={!message.trim() || isLoading}>
          <Send className="h-4 w-4" />
          <span className="sr-only">送信</span>
        </Button>
      </div>
    </form>
  )
}
