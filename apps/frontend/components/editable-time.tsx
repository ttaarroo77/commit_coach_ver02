"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface EditableTimeProps {
  startTime?: string
  endTime?: string
  onTimeChange: (startTime: string, endTime: string) => void
  className?: string
}

export function EditableTime({ startTime = "", endTime = "", onTimeChange, className = "" }: EditableTimeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [start, setStart] = useState(startTime)
  const [end, setEnd] = useState(endTime)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && wrapperRef.current) {
      const firstInput = wrapperRef.current.querySelector("input")
      if (firstInput) {
        firstInput.focus()
      }
    }
  }, [isEditing])

  // 外部から値が変更された場合に内部の状態も更新
  useEffect(() => {
    setStart(startTime)
    setEnd(endTime)
  }, [startTime, endTime])

  const handleClick = () => setIsEditing(true)

  // wrapper 全体で blur を判定。フォーカスが内側で移動する場合は無視
  const handleWrapperBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (wrapperRef.current && wrapperRef.current.contains(e.relatedTarget as Node)) return
    commit()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      commit()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setStart(startTime)
      setEnd(endTime)
    }
  }

  // ---- ここからユーティリティ ----
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/
  const validateTime = (t: string) => t === "" || timeRegex.test(t)

  const commit = () => {
    setIsEditing(false)
    // 片方だけ編集された場合はもう片方をそのまま使う
    if (validateTime(start) && validateTime(end)) {
      onTimeChange(start || startTime, end || endTime)
    } else {
      setStart(startTime)
      setEnd(endTime)
    }
  }

  return isEditing ? (
    <div ref={wrapperRef} className="flex items-center space-x-2" onBlur={handleWrapperBlur}>
      <input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`border rounded px-2 py-1 w-20 text-sm ${className}`}
      />
      <span>-</span>
      <input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`border rounded px-2 py-1 w-20 text-sm ${className}`}
      />
    </div>
  ) : (
    <div
      className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm text-gray-500 ${className}`}
      onClick={handleClick}
    >
      {startTime && endTime ? `${startTime} - ${endTime}` : "時間を設定"}
    </div>
  )
}
