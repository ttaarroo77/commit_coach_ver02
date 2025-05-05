"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';

export function Clock() {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    // 1秒ごとに更新
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 日付のフォーマット
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('ja-JP', options);
  };
  
  // 時刻のフォーマット
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return date.toLocaleTimeString('ja-JP', options);
  };
  
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center mb-2 sm:mb-3">
            <CalendarIcon className="h-5 w-5 mr-2 animate-pulse" />
            <span className="text-sm sm:text-base font-medium">{formatDate(date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span className="text-2xl sm:text-3xl font-bold">{formatTime(date)}</span>
            </div>
            
            {/* モバイル表示時に見やすいよう、日付の短縮表示を追加 */}
            <div className="rounded-full bg-white/20 px-3 py-1 text-xs hidden sm:block">
              {new Date().toLocaleDateString('ja-JP', { weekday: 'short' })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
