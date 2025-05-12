"use client";

import { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  prefix?: string;
  isOverdue?: boolean;
}

export function EditableText({ 
  value, 
  onChange, 
  className = "", 
  prefix = "", 
  isOverdue = false 
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // 値が外部から変更された場合に更新
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onChange(text);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setText(value);
    }
  };

  // 期限切れのスタイルを適用
  const overdueStyle = isOverdue ? "font-bold text-[#CF3721] underline" : "";

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
    <span 
      className={`cursor-pointer ${className} ${overdueStyle}`} 
      onClick={handleClick}
      title={isOverdue ? "期限切れ" : undefined}
    >
      {prefix}
      {value}
    </span>
  );
}
