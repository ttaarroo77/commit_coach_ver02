import { useState, useRef, useEffect } from "react"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  prefix?: string
  isOverdue?: boolean
}

export function EditableText({ value, onChange, className = "", prefix = "", isOverdue = false }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(text)
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

  const overdueStyle = isOverdue ? "font-bold text-[#CF3721] underline" : ""

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`bg-white border rounded px-2 py-1 w-full ${className} ${isOverdue ? "text-[#CF3721]" : ""}`}
    />
  ) : (
    <span className={`cursor-pointer ${className} ${overdueStyle}`} onClick={handleClick}>
      {prefix}
      {value}
    </span>
  )
} 