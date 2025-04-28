'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Code, 
  FileCode, 
  GitCommit, 
  Loader2,
  Mic,
  MicOff,
  AlertCircle,
  Info,
  Sparkles,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatMessage } from './chat-message';
import { useChat } from './chat-context';
import { getSpeechRecognition } from '@/lib/speech-utils';
import { useToast } from '@/components/ui/use-toast';

// メッセージの型定義
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// チャットモードの型定義
type ChatMode = 'coach' | 'code' | 'commit';

interface ChatSidebarProps {
  initialOpen?: boolean;
}

export function ChatSidebar({ initialOpen = false }: ChatSidebarProps) {
  // ChatContextからチャット状態を取得
  const { 
    messages, 
    isOpen, 
    isMinimized, 
    isLoading, 
    chatMode,
    openChat,
    closeChat,
    toggleMinimize,
    sendMessage,
    setChatMode,
    clearMessages
  } = useChat();
  
  // ローカルステート
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  
  // トースト通知
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // チャットを開く
  const handleOpen = () => {
    openChat();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  // チャットを閉じる
  const handleClose = () => {
    closeChat();
  };
  
  // チャットを最小化/最大化
  const handleToggleMinimize = () => {
    toggleMinimize();
  };
  
  // メッセージを送信
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    await sendMessage(message);
    setMessage('');
  };
  
  // Enterキーでメッセージを送信（Shift+Enterは改行）
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // 音声入力の切り替え
  const handleToggleRecording = useCallback(() => {
    const speechRecognition = getSpeechRecognition();
    
    if (!speechRecognition.isSupported()) {
      toast({
        title: '音声入力機能はサポートされていません',
        description: 'お使いのブラウザではWeb Speech APIがサポートされていません。ChromeやEdgeなどのモダンブラウザをお試しください。',
        variant: 'destructive',
      });
      return;
    }
    
    if (isRecording) {
      // 音声入力を停止
      speechRecognition.stop();
      setIsRecording(false);
      setInterimTranscript('');
    } else {
      // 音声入力を開始
      const success = speechRecognition.start(
        (result) => {
          if (result.isFinal) {
            setMessage(prev => prev + result.text);
            setInterimTranscript('');
          } else {
            setInterimTranscript(result.text);
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
          toast({
            title: '音声入力エラー',
            description: `音声入力中にエラーが発生しました: ${error}`,
            variant: 'destructive',
          });
          setIsRecording(false);
        }
      );
      
      if (success) {
        setIsRecording(true);
        toast({
          title: '音声入力開始',
          description: '音声入力を開始しました。話しかけてください。',
          duration: 3000,
        });
      }
    }
  }, [isRecording, toast]);
  
  // チャットモードの変更
  const handleChangeChatMode = (value: string) => {
    setChatMode(value as ChatMode);
  };
  
  // 新しいメッセージが追加されたらスクロールを一番下に移動
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 初期化時に音声入力のサポート状況を確認
  useEffect(() => {
    const speechRecognition = getSpeechRecognition();
    setIsSpeechSupported(speechRecognition.isSupported());
  }, []);
  

  
  // チャットが閉じている場合はアイコンのみ表示
  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 w-80 bg-background border rounded-lg shadow-lg transition-all duration-300 z-50",
        isMinimized ? "h-14" : "h-[500px]"
      )}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-medium">AI コーチ</h3>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={clearMessages} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                <span>履歴をクリア</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleToggleMinimize}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* モード切替タブ */}
          <Tabs defaultValue="coach" onValueChange={handleChangeChatMode}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="coach" className="text-xs">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>コーチ</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs">
                <div className="flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  <span>コード</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="commit" className="text-xs">
                <div className="flex items-center gap-1">
                  <GitCommit className="h-3 w-3" />
                  <span>コミット</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <div className="px-3 py-1 bg-muted/50 text-xs text-muted-foreground">
              {chatMode === 'coach' && (
                <div className="flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>コーディングのアドバイスやベストプラクティスについて質問できます</span>
                </div>
              )}
              {chatMode === 'code' && (
                <div className="flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>コードの問題点や改善点を分析します</span>
                </div>
              )}
              {chatMode === 'commit' && (
                <div className="flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>変更内容から適切なコミットメッセージを生成します</span>
                </div>
              )}
            </div>
            
            <TabsContent value="coach" className="m-0 p-0">
              <div className="flex flex-col h-[400px]">
                {/* メッセージエリア */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                      <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin text-primary mb-2" />
                        <p className="text-xs text-muted-foreground">
                          {chatMode === 'coach' 
                            ? 'AIコーチが回答を考えています...' 
                            : chatMode === 'code' 
                              ? 'コード分析中...' 
                              : 'コミットメッセージを生成中...'}
                        </p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* 入力エリア */}
                <div className="p-3 border-t">
                  <div className="flex flex-col gap-2">
                    {interimTranscript && (
                      <div className="px-2 py-1 text-xs bg-muted/50 rounded italic">
                        {interimTranscript}
                      </div>
                    )}
                    <div className="flex items-end gap-2">
                      <Textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={chatMode === 'coach' 
                          ? "コーディングについて質問してみましょう..."
                          : chatMode === 'code'
                            ? "コードの問題点や改善点を質問..."
                            : "変更内容を説明してください..."}
                        className="min-h-[60px] resize-none"
                      />
                      <div className="flex flex-col gap-2">
                        {isSpeechSupported && (
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleToggleRecording}
                            variant={isRecording ? "destructive" : "outline"}
                            title={isRecording ? "音声入力停止" : "音声入力開始"}
                          >
                            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                        )}
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleSendMessage}
                          disabled={!message.trim() || isLoading}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="m-0 p-0">
              <div className="flex flex-col h-[400px]">
                {/* メッセージエリア (コードモード) */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                      <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin text-primary mb-2" />
                        <p className="text-xs text-muted-foreground">
                          {chatMode === 'coach' 
                            ? 'AIコーチが回答を考えています...' 
                            : chatMode === 'code' 
                              ? 'コード分析中...' 
                              : 'コミットメッセージを生成中...'}
                        </p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* 入力エリア (コードモード) */}
                <div className="p-3 border-t">
                  <div className="flex flex-col gap-2">
                    {interimTranscript && (
                      <div className="px-2 py-1 text-xs bg-muted/50 rounded italic">
                        {interimTranscript}
                      </div>
                    )}
                    <div className="flex items-end gap-2">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="コードの問題点や改善点を質問..."
                        className="min-h-[60px] resize-none font-mono text-xs"
                      />
                      <div className="flex flex-col gap-2">
                        {isSpeechSupported && (
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleToggleRecording}
                            variant={isRecording ? "destructive" : "outline"}
                            title={isRecording ? "音声入力停止" : "音声入力開始"}
                          >
                            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                        )}
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleSendMessage}
                          disabled={!message.trim() || isLoading}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="commit" className="m-0 p-0">
              <div className="flex flex-col h-[400px]">
                {/* メッセージエリア (コミットモード) */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                      <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin text-primary mb-2" />
                        <p className="text-xs text-muted-foreground">
                          {chatMode === 'coach' 
                            ? 'AIコーチが回答を考えています...' 
                            : chatMode === 'code' 
                              ? 'コード分析中...' 
                              : 'コミットメッセージを生成中...'}
                        </p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* 入力エリア (コミットモード) */}
                <div className="p-3 border-t">
                  <div className="flex flex-col gap-2">
                    {interimTranscript && (
                      <div className="px-2 py-1 text-xs bg-muted/50 rounded italic">
                        {interimTranscript}
                      </div>
                    )}
                    <div className="flex items-end gap-2">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="変更内容を説明してください..."
                        className="min-h-[60px] resize-none"
                      />
                      <div className="flex flex-col gap-2">
                        {isSpeechSupported && (
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleToggleRecording}
                            variant={isRecording ? "destructive" : "outline"}
                            title={isRecording ? "音声入力停止" : "音声入力開始"}
                          >
                            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                        )}
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleSendMessage}
                          disabled={!message.trim() || isLoading}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
