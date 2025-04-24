import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MiniCalendar } from '@/components/dashboard/MiniCalendar';

// Dateのモック用関数
const mockDate = (date: Date) => {
  const originalDate = global.Date;
  jest.spyOn(global, 'Date')
    .mockImplementation((args: any) => {
      if (args) {
        return new originalDate(args);
      }
      return date;
    });
};

describe('MiniCalendar Component', () => {
  const fixedDate = new Date('2025-04-23T12:00:00');
  
  beforeEach(() => {
    // 日付を固定
    mockDate(fixedDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('カレンダーが正しくレンダリングされる', () => {
    render(<MiniCalendar />);
    
    // 年月が表示されていることを確認
    expect(screen.getByText('2025年4月')).toBeInTheDocument();
    
    // 曜日のヘッダーが表示されていることを確認
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('月')).toBeInTheDocument();
    expect(screen.getByText('火')).toBeInTheDocument();
    expect(screen.getByText('水')).toBeInTheDocument();
    expect(screen.getByText('木')).toBeInTheDocument();
    expect(screen.getByText('金')).toBeInTheDocument();
    expect(screen.getByText('土')).toBeInTheDocument();
    
    // 今日の日付（23日）が強調表示されていることを確認
    const todayElement = screen.getByText('23');
    expect(todayElement).toHaveClass('bg-[#31A9B8]');
    expect(todayElement).toHaveClass('text-white');
  });

  it('前月ボタンをクリックすると前月が表示される', () => {
    render(<MiniCalendar />);
    
    // 初期状態で4月が表示されていることを確認
    expect(screen.getByText('2025年4月')).toBeInTheDocument();
    
    // 前月ボタンをクリック
    const prevButton = screen.getByRole('button', { name: /ChevronLeft/i });
    fireEvent.click(prevButton);
    
    // 3月が表示されていることを確認
    expect(screen.getByText('2025年3月')).toBeInTheDocument();
  });

  it('次月ボタンをクリックすると次月が表示される', () => {
    render(<MiniCalendar />);
    
    // 初期状態で4月が表示されていることを確認
    expect(screen.getByText('2025年4月')).toBeInTheDocument();
    
    // 次月ボタンをクリック
    const nextButton = screen.getByRole('button', { name: /ChevronRight/i });
    fireEvent.click(nextButton);
    
    // 5月が表示されていることを確認
    expect(screen.getByText('2025年5月')).toBeInTheDocument();
  });

  it('カレンダーグリッドが42マス（6週間分）表示される', () => {
    render(<MiniCalendar />);
    
    // 日付の数字が表示されている要素を全て取得
    const dayElements = screen.getAllByText(/^\d+$/);
    
    // 42マス（6週間分）あることを確認
    expect(dayElements.length).toBe(42);
  });
});
