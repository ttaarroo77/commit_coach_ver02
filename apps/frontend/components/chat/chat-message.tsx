'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Copy, Check, Code } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './chat-sidebar';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  
  // コードブロックを検出して構文ハイライトを適用
  const formatMessageContent = (content: string) => {
    // コードブロックを検出する正規表現
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    
    // コードブロックを分割
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // コードブロックの前のテキスト
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }
      
      // コードブロック
      const language = match[1] || 'plaintext';
      const code = match[2];
      parts.push({
        type: 'code',
        language,
        content: code
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // 残りのテキスト
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }
    
    return parts;
  };
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formattedContent = formatMessageContent(message.content);
  
  return (
    <div
      className={cn(
        "flex flex-col max-w-[85%] rounded-lg p-3 mb-3",
        message.role === 'user' 
          ? "ml-auto bg-primary text-primary-foreground" 
          : message.role === 'system' 
            ? "bg-muted" 
            : "bg-card border"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-medium">
          {message.role === 'user' 
            ? 'あなた' 
            : message.role === 'system' 
              ? 'システム' 
              : 'AI コーチ'}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 opacity-70 hover:opacity-100"
          onClick={handleCopyContent}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      
      <div className="text-sm whitespace-pre-wrap">
        {formattedContent.map((part, index) => {
          if (part.type === 'text') {
            return <div key={index} className="mb-2">{part.content}</div>;
          } else if (part.type === 'code') {
            return (
              <div key={index} className="relative mb-2">
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                    {part.language}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-primary/10"
                    onClick={() => {
                      navigator.clipboard.writeText(part.content);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-xs mt-1">
                  <code>{part.content}</code>
                </pre>
              </div>
            );
          }
          return null;
        })}
      </div>
      
      <div className="text-[10px] text-muted-foreground mt-1 self-end">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
