"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskCount {
  date: string; // YYYY-MM-DD形式
  count: number;
}

interface MiniCalendarProps {
  taskCounts?: TaskCount[];
  onDateSelect?: (date: string) => void;
}

export function MiniCalendar({ taskCounts = [], onDateSelect }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  
  // 月を変更する関数
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };
  
  // 月の最初の日を取得
  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay(); // 0: 日曜日, 1: 月曜日, ...
  };
  
  // 月の日数を取得
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // 日付をYYYY-MM-DD形式に変換
  const formatDateToString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // 特定の日のタスク数を取得
  const getTaskCountForDate = (year: number, month: number, day: number) => {
    const dateString = formatDateToString(year, month, day);
    const taskCount = taskCounts.find(tc => tc.date === dateString);
    return taskCount ? taskCount.count : 0;
  };
  
  // カレンダーの日付をクリックしたときの処理
  const handleDateClick = (year: number, month: number, day: number) => {
    if (onDateSelect) {
      onDateSelect(formatDateToString(year, month, day));
    }
  };
  
  // カレンダーのレンダリング
  const renderCalendar = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 曜日の配列
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    
    // カレンダーの行を作成
    const rows = [];
    let days = [];
    
    // 曜日ヘッダー
    const weekdaysRow = (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, index) => (
          <div 
            key={index} 
            className={`text-center text-xs font-medium p-1 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    );
    
    // 前月の日を埋める
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="text-center p-1 text-gray-300">
          &nbsp;
        </div>
      );
    }
    
    // 当月の日を埋める
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateToString(year, month, day);
      const isToday = 
        today.getFullYear() === year && 
        today.getMonth() === month && 
        today.getDate() === day;
      
      const taskCount = getTaskCountForDate(year, month, day);
      
      days.push(
        <div 
          key={day}
          className={`relative text-center p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors ${
            isToday ? 'bg-blue-100' : ''
          }`}
          onClick={() => handleDateClick(year, month, day)}
        >
          <span className={`${isToday ? 'font-bold text-blue-600' : ''} text-sm sm:text-base`}>
            {day}
          </span>
          {taskCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] animate-fadeIn"
              variant="destructive"
            >
              {taskCount}
            </Badge>
          )}
        </div>
      );
      
      // 7日ごとに新しい行を作成
      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        rows.push(
          <div key={`row-${day}`} className="grid grid-cols-7 gap-1 mb-2">
            {days}
          </div>
        );
        days = [];
      }
    }
    
    return (
      <div className="px-1 py-2">
        {weekdaysRow}
        {rows}
      </div>
    );
  };
  
  return (
    <Card className="h-full shadow-sm hover:shadow transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center">
            <CardTitle className="text-lg">カレンダー</CardTitle>
            <Badge variant="outline" className="ml-2 text-xs">
              {taskCounts.reduce((sum, tc) => sum + tc.count, 0)}件
            </Badge>
          </div>
          <div className="flex items-center space-x-1 bg-gray-50 rounded-md p-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-white" 
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium min-w-[80px] text-center">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-white" 
              onClick={() => changeMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        {renderCalendar()}
      </CardContent>
    </Card>
  );
}
