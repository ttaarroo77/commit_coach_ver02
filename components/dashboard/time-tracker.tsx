'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TimeTrackerProps {
  workStartTime?: string; // 例: '09:00'
  workEndTime?: string;   // 例: '18:00'
}

export function TimeTracker({ 
  workStartTime = '09:00', 
  workEndTime = '18:00' 
}: TimeTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  
  // 現在の日付を日本語フォーマットで取得
  const formattedDate = currentTime.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  
  // 現在の時刻を取得
  const formattedTime = currentTime.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // 作業時間の進捗率を計算
  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      
      // 開始時間と終了時間をパース
      const [startHour, startMinute] = workStartTime.split(':').map(Number);
      const [endHour, endMinute] = workEndTime.split(':').map(Number);
      
      const startDate = new Date();
      startDate.setHours(startHour, startMinute, 0);
      
      const endDate = new Date();
      endDate.setHours(endHour, endMinute, 0);
      
      // 現在時刻が作業時間外の場合
      if (now < startDate) {
        setProgress(0);
        return;
      }
      
      if (now > endDate) {
        setProgress(100);
        return;
      }
      
      // 進捗率を計算
      const totalWorkMs = endDate.getTime() - startDate.getTime();
      const elapsedMs = now.getTime() - startDate.getTime();
      const calculatedProgress = Math.round((elapsedMs / totalWorkMs) * 100);
      
      setProgress(calculatedProgress);
    };
    
    calculateProgress();
    
    // 1分ごとに更新
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      calculateProgress();
    }, 60000);
    
    return () => clearInterval(timer);
  }, [workStartTime, workEndTime]);
  
  // 残り時間を計算
  const calculateRemainingTime = () => {
    const now = new Date();
    const [endHour, endMinute] = workEndTime.split(':').map(Number);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);
    
    // 既に終了時間を過ぎている場合
    if (now > endDate) {
      return '作業時間終了';
    }
    
    const remainingMs = endDate.getTime() - now.getTime();
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `残り ${remainingHours}時間 ${remainingMinutes}分`;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">時間管理</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{formattedTime}</span>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>{workStartTime}</span>
            <span>{calculateRemainingTime()}</span>
            <span>{workEndTime}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="mt-2 text-center text-sm font-medium">
            作業時間の {progress}% 経過
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">本日の予定</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">午前ミーティング</span>
              <span className="text-gray-500 dark:text-gray-400">10:00 - 11:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">フロントエンド開発</span>
              <span className="text-gray-500 dark:text-gray-400">11:00 - 13:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">昼休憩</span>
              <span className="text-gray-500 dark:text-gray-400">13:00 - 14:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">バックエンド連携</span>
              <span className="text-gray-500 dark:text-gray-400">14:00 - 17:00</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
