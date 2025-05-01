'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, GitCommit, Code, RefreshCw } from 'lucide-react';
import { AIService, CommitSuggestion } from '@/lib/ai-service';
import { Task } from './task-group';
import { FadeIn, SlideIn, BouncyButton } from '@/components/ui/animations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface AICoachProps {
  tasks?: Task[];
}

export function AICoach({ tasks = [] }: AICoachProps) {
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
  const [commitSuggestion, setCommitSuggestion] = useState<CommitSuggestion | null>(null);
  const [isGeneratingCommit, setIsGeneratingCommit] = useState(false);

  // メッセージ送信処理
  const handleSendMessage = async () => {
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

    // 会話履歴を準備
    const history = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      // AIサービスからレスポンスを取得
      const aiResponse = await AIService.getResponse(input, history);
      
      const newMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: aiResponse.suggestions
      };
      
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'すみません、エラーが発生しました。しばらくしてからもう一度お試しください。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // コミット提案生成
  const handleGenerateCommitSuggestion = async () => {
    if (isGeneratingCommit) return;
    
    setIsGeneratingCommit(true);
    
    try {
      const suggestion = await AIService.generateCommitSuggestion(tasks);
      setCommitSuggestion(suggestion);
      
      // コミット提案をメッセージとして追加
      const commitMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `コミット提案を生成しました：\n\n**タイプ**: ${suggestion.type}${suggestion.scope ? `(${suggestion.scope})` : ''}\n**メッセージ**: ${suggestion.message}\n\n${suggestion.description || ''}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, commitMessage]);
    } catch (error) {
      console.error('Error generating commit suggestion:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'コミット提案の生成中にエラーが発生しました。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGeneratingCommit(false);
    }
  };
  
  // コードの分析
  const handleAnalyzeCode = async () => {
    const code = prompt('分析したいコードを入力してください：');
    if (!code) return;
    
    const language = prompt('プログラミング言語を入力してください（例：typescript, javascript, python）：', 'typescript');
    if (!language) return;
    
    setIsLoading(true);
    
    try {
      const analysis = await AIService.analyzeCode(code, language);
      
      const analysisMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: analysis.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Error analyzing code:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'コード分析中にエラーが発生しました。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeIn className="flex h-full flex-col rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
      <div className="border-b p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium">AIコーチ</h3>
          </div>
          <div className="flex items-center gap-1">
            <BouncyButton 
              onClick={handleGenerateCommitSuggestion}
              className="h-8 w-8 p-0 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700" 
              disabled={isGeneratingCommit || tasks.filter(t => t.status === 'completed').length === 0}
            >
              <GitCommit className="h-4 w-4" title="コミット提案を生成" />
            </BouncyButton>
            <BouncyButton 
              onClick={handleAnalyzeCode}
              className="h-8 w-8 p-0 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700" 
              disabled={isLoading}
            >
              <Code className="h-4 w-4" title="コード分析" />
            </BouncyButton>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <SlideIn
              key={message.id}
              direction={message.role === 'user' ? 'left' : 'right'}
              className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              delay={0.1}
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
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="text-xs bg-gray-200 dark:bg-gray-600 p-1.5 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500"
                        onClick={() => {
                          navigator.clipboard.writeText(suggestion);
                          alert(`「${suggestion}」をクリップボードにコピーしました。`);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-xs opacity-70">{message.timestamp}</p>
              </div>
            </SlideIn>
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
          <BouncyButton 
            onClick={handleSendMessage}
            className="h-10 w-10 shrink-0 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center" 
            disabled={isLoading}
          >
            <Send className="h-4 w-4 text-white" />
          </BouncyButton>
        </div>
      </div>
    </FadeIn>
  );
}
