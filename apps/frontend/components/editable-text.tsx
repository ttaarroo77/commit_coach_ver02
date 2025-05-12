// components > editable-text.tsx


"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  prefix?: string
  isCompleted?: boolean
}

export function EditableText({ value, onChange, className = "", prefix = "", isCompleted = false }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // 外部からvalueが変更された場合に内部のテキストも更新
  useEffect(() => {
    setText(value)
  }, [value])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (text.trim() !== value) {
      onChange(text)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      onChange(text)
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setText(value)
    }
  }

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`bg-white border rounded px-2 py-1 w-full ${className}`}
    />
  ) : (
    <span
      className={`cursor-pointer hover:bg-gray-100 px-1 rounded ${className} ${isCompleted ? "line-through text-gray-500" : ""}`}
      onClick={handleClick}
    >
      {prefix}
      {value}
    </span>
  )
}
