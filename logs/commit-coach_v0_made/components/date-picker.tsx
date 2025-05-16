"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { ja } from "date-fns/locale"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = "- / - / - / -", className = "" }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)
  const [inputValue, setInputValue] = useState(value ? formatDateForDisplay(value) : "")
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 表示用の日付フォーマット（例：2023/04/15 14:30）
  function formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    if (!isValid(date)) return ""
    return format(date, "yyyy/MM/dd HH:mm", { locale: ja })
  }

  // ISO形式の日付文字列に変換（例：2023-04-15T14:30）
  function formatDateForValue(date: Date | undefined): string {
    if (!date || !isValid(date)) return ""
    return format(date, "yyyy-MM-dd'T'HH:mm")
  }

  // 入力された文字列を日付に変換
  function parseInputDate(input: string): Date | undefined {
    if (!input) return undefined

    // 様々な形式に対応
    const formats = [
      "yyyy/MM/dd HH:mm",
      "yyyy/MM/dd H:mm",
      "yyyy/M/d HH:mm",
      "yyyy/M/d H:mm",
      "yyyy-MM-dd HH:mm",
      "yyyy-MM-dd H:mm",
      "yyyy-M-d HH:mm",
      "yyyy-M-d H:mm",
    ]

    for (const formatStr of formats) {
      try {
        const parsedDate = parse(input, formatStr, new Date(), { locale: ja })
        if (isValid(parsedDate)) {
          return parsedDate
        }
      } catch (e) {
        // パース失敗は無視して次の形式を試す
      }
    }

    // 時間がない場合は現在時刻を追加
    const timeFormats = ["yyyy/MM/dd", "yyyy/M/d", "yyyy-MM-dd", "yyyy-M-d"]

    for (const formatStr of timeFormats) {
      try {
        const parsedDate = parse(input, formatStr, new Date(), { locale: ja })
        if (isValid(parsedDate)) {
          // 現在の時刻を設定
          const now = new Date()
          parsedDate.setHours(now.getHours())
          parsedDate.setMinutes(now.getMinutes())
          return parsedDate
        }
      } catch (e) {
        // パース失敗は無視して次の形式を試す
      }
    }

    return undefined
  }

  // 入力値が変更されたときの処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    const parsedDate = parseInputDate(value)
    if (parsedDate) {
      setDate(parsedDate)
      onChange(formatDateForValue(parsedDate))
    }
  }

  // カレンダーで日付が選択されたときの処理
  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // 時間部分を保持
      if (date) {
        selectedDate.setHours(date.getHours())
        selectedDate.setMinutes(date.getMinutes())
      } else {
        // デフォルトは現在時刻
        const now = new Date()
        selectedDate.setHours(now.getHours())
        selectedDate.setMinutes(now.getMinutes())
      }

      setDate(selectedDate)
      const formattedDate = formatDateForDisplay(selectedDate.toISOString())
      setInputValue(formattedDate)
      onChange(formatDateForValue(selectedDate))
      setIsOpen(false)
    }
  }

  // 外部からvalueが変更された場合の処理
  useEffect(() => {
    if (value) {
      const newDate = new Date(value)
      if (isValid(newDate)) {
        setDate(newDate)
        setInputValue(formatDateForDisplay(value))
      }
    } else {
      setDate(undefined)
      setInputValue("")
    }
  }, [value])

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pr-10"
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setIsOpen(true)}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={handleCalendarSelect} initialFocus locale={ja} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
