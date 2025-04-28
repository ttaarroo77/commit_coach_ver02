'use client';

import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { ChatSidebar } from '@/components/chat/chat-sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <ChatSidebar initialOpen={false} />
      </div>
    </div>
  );
}
