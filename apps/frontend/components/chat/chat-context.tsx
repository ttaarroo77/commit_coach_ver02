'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ChatMessage } from './chat-sidebar';
import aiService from '@/services/ai-service';
import { updateSystemMessage, trimChatHistory } from '@/lib/chat-utils';
import { saveToLocalStorage, getFromLocalStorage } from '@/lib/storage-utils';
import { useToast } from '@/components/ui/use-toast';

// チャットモードの型定義
export type ChatMode = 'coach' | 'code' | 'commit';

// チャットコンテキストの型定義
interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  chatMode: ChatMode;
  openChat: () => void;
  closeChat: () => void;
  toggleMinimize: () => void;
  sendMessage: (content: string) => Promise<void>;
  setChatMode: (mode: ChatMode) => void;
  clearMessages: () => void;
}

// デフォルト値
const defaultContext: ChatContextType = {
  messages: [],
  isOpen: false,
  isMinimized: false,
  isLoading: false,
  chatMode: 'coach',
  openChat: () => {},
  closeChat: () => {},
  toggleMinimize: () => {},
  sendMessage: async () => {},
  setChatMode: () => {},
  clearMessages: () => {},
};

// コンテキストの作成
const ChatContext = createContext<ChatContextType>(defaultContext);

// コンテキストプロバイダーのprops
interface ChatProviderProps {
  children: ReactNode;
}

// ローカルストレージのキー
const STORAGE_KEY = 'commit-coach-chat';
const CHAT_MODE_KEY = 'commit-coach-chat-mode';
const CHAT_STATE_KEY = 'commit-coach-chat-state';

export function ChatProvider({ children }: ChatProviderProps) {
  // トースト通知
  const { toast } = useToast();
  
  // チャット状態
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>(() => {
    // 初期化時にローカルストレージからモードを取得
    if (typeof window !== 'undefined') {
      return getFromLocalStorage<ChatMode>(CHAT_MODE_KEY, 'coach');
    }
    return 'coach';
  });

  // 初期化時にローカルストレージからメッセージを読み込む
  useEffect(() => {
    // メッセージ履歴を読み込む
    const storedMessages = getFromLocalStorage<ChatMessage[]>(STORAGE_KEY, []);
    
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    } else {
      // 初期メッセージを設定
      const initialMessage: ChatMessage = {
        id: '1',
        role: 'system',
        content: 'こんにちは！Commit Coachへようこそ。コードレビュー、コミットメッセージの提案、その他のコーディング支援が必要な場合はお気軽にお尋ねください。',
        timestamp: new Date().toISOString()
      };
      setMessages([initialMessage]);
    }
    
    // チャットの状態を読み込む
    const storedState = getFromLocalStorage<{ isOpen: boolean; isMinimized: boolean }>(CHAT_STATE_KEY, { isOpen: false, isMinimized: false });
    setIsOpen(storedState.isOpen);
    setIsMinimized(storedState.isMinimized);
  }, []);
  
  // チャットモードが変更されたときにシステムメッセージを更新し、モードを保存
  useEffect(() => {
    setMessages(prev => updateSystemMessage(prev, chatMode));
    saveToLocalStorage(CHAT_MODE_KEY, chatMode);
  }, [chatMode]);

  // メッセージが更新されたらローカルストレージに保存
  useEffect(() => {
    if (messages.length > 0) {
      // メッセージ数が多すぎる場合は整理してから保存
      const trimmedMessages = trimChatHistory(messages);
      saveToLocalStorage(STORAGE_KEY, trimmedMessages);
    }
  }, [messages]);
  
  // チャットの開閉状態が変更されたらローカルストレージに保存
  useEffect(() => {
    saveToLocalStorage(CHAT_STATE_KEY, { isOpen, isMinimized });
  }, [isOpen, isMinimized]);

  // チャットを開く
  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    saveToLocalStorage(CHAT_STATE_KEY, { isOpen: true, isMinimized: false });
  }, []);

  // チャットを閉じる
  const closeChat = useCallback(() => {
    setIsOpen(false);
    saveToLocalStorage(CHAT_STATE_KEY, { isOpen: false, isMinimized: false });
  }, []);

  // チャットを最小化/最大化
  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => {
      const newState = !prev;
      saveToLocalStorage(CHAT_STATE_KEY, { isOpen: true, isMinimized: newState });
      return newState;
    });
  }, []);

  // メッセージを送信
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // ユーザーメッセージを追加
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // メッセージ履歴を更新
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    try {
      // AIサービスを使用してメッセージを送信
      const assistantMessage = await aiService.sendMessage(content, chatMode, updatedMessages);
      
      // アシスタントのレスポンスを追加
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      // エラーメッセージを追加
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: 'メッセージの送信中にエラーが発生しました。もう一度お試しください。',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [messages, chatMode]);

  // メッセージをクリア
  const clearMessages = useCallback(() => {
    // システムメッセージだけ残す
    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'system',
      content: 'こんにちは！Commit Coachへようこそ。コードレビュー、コミットメッセージの提案、その他のコーディング支援が必要な場合はお気軽にお尋ねください。',
      timestamp: new Date().toISOString()
    };
    
    setMessages([initialMessage]);
    saveToLocalStorage(STORAGE_KEY, [initialMessage]);
    
    toast({
      title: 'チャット履歴をクリアしました',
      description: 'すべての会話履歴が削除されました。',
      duration: 3000,
    });
  }, [toast]);



  const value = {
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
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// カスタムフック
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
