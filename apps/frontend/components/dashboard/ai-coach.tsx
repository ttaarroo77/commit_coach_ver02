'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'こんにちは！今日のタスクについて何かお手伝いできることはありますか？',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 実際の実装ではここでAIからの応答を取得します
    setTimeout(() => {
      const aiResponses: string[] = [
        'タスクの進捗はいかがですか？何か困っていることはありますか？',
        'コミットメッセージの作成をお手伝いしましょうか？最近の変更内容を教えてください。',
        'お疲れ様です！休憩を取ることも大切ですよ。5分間のストレッチをおすすめします。',
        '今日のタスクリストを見ると、「フロントエンド開発」が優先度高めですね。何か具体的なヘルプが必要ですか？',
        'プロジェクトの締め切りが近づいていますね。何かサポートできることはありますか？'
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
      <div className="border-b p-3 flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-medium">AIコーチ</h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-700 text-white">
                  AI
                </div>
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="mt-1 text-xs opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-700 text-white">
                AI
              </div>
              <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce delay-75"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="AIコーチに質問する..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" 
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
