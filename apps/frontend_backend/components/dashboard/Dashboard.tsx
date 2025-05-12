import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TaskGroup } from './TaskGroup';
import { AICoach } from './AICoach';

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* モバイルビュー */}
          <div className="md:hidden" data-testid="mobile-view">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">今日のタスク</h2>
              <TaskGroup status="todo" />
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">期限間近</h2>
              <TaskGroup status="in-progress" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">AIコーチ</h2>
              <AICoach />
            </div>
          </div>

          {/* デスクトップビュー */}
          <div className="hidden md:block" data-testid="desktop-view">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">今日のタスク</h2>
                <TaskGroup status="todo" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">期限間近</h2>
                <TaskGroup status="in-progress" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">AIコーチ</h2>
                <AICoach />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 