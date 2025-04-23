import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 月を移動する関数
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // 月の最初の日と最後の日を取得
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 月の最初の日の曜日（0: 日曜日, 1: 月曜日, ...)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // カレンダーグリッドの日数を計算
  const daysInMonth = lastDayOfMonth.getDate();
  
  // カレンダーグリッドを作成
  const calendarDays = [];
  
  // 前月の日を追加
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0 - (firstDayOfWeek - i - 1));
    calendarDays.push({ date: prevMonthDay, isCurrentMonth: false });
  }
  
  // 当月の日を追加
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    calendarDays.push({ date: day, isCurrentMonth: true });
  }
  
  // 翌月の日を追加（合計42マスになるように）
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonthDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
    calendarDays.push({ date: nextMonthDay, isCurrentMonth: false });
  }
  
  // 現在の日付
  const today = new Date();
  
  // 曜日の配列
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
          </CardTitle>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => changeMonth(-1)} className="h-7 w-7 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => changeMonth(1)} className="h-7 w-7 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* 曜日のヘッダー */}
          {weekDays.map((day, index) => (
            <div
              key={`header-${index}`}
              className={`text-xs font-medium ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'}`}
            >
              {day}
            </div>
          ))}
          
          {/* カレンダーの日付 */}
          {calendarDays.map((day, index) => {
            const isToday = day.date.toDateString() === today.toDateString();
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            
            return (
              <div
                key={`day-${index}`}
                className={`
                  text-xs rounded-full h-6 w-6 flex items-center justify-center mx-auto
                  ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                  ${isToday ? 'bg-[#31A9B8] text-white font-bold' : ''}
                  ${isWeekend && day.isCurrentMonth && !isToday ? 
                    day.date.getDay() === 0 ? 'text-red-500' : 'text-blue-500' 
                    : ''}
                `}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
