'use client';

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
  className = '', 
  prefix = '', 
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

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(text);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(value);
    }
  };

  // 期限切れのスタイルを適用
  const overdueStyle = isOverdue ? 'font-bold text-red-600 dark:text-red-400 underline' : '';

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`bg-white dark:bg-gray-800 border rounded px-2 py-1 w-full ${className} ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}
    />
  ) : (
    <span 
      className={`cursor-pointer ${className} ${overdueStyle}`} 
      onClick={handleClick}
    >
      {prefix}
      {value}
    </span>
  );
}

// 納期が過ぎているかチェックする関数
export function isDateOverdue(date?: string): boolean {
  if (!date) return false;
  const dueDate = new Date(date);
  const now = new Date();
  return dueDate < now;
}
