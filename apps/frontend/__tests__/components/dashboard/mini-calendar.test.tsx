import { render, screen, fireEvent } from '@testing-library/react';
import { MiniCalendar } from '@/components/dashboard/mini-calendar';
import '@testing-library/jest-dom';

describe('MiniCalendar', () => {
  it('月と曜日が表示される', () => {
    render(<MiniCalendar />);
    expect(screen.getByText(/\d{4}年\d{1,2}月/)).toBeInTheDocument();
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('土')).toBeInTheDocument();
  });

  it('日付クリックでonDateSelectが呼ばれる', () => {
    const handleDateSelect = jest.fn();
    render(<MiniCalendar onDateSelect={handleDateSelect} />);
    const dayButton = screen.getAllByText('1')[0];
    fireEvent.click(dayButton);
    expect(handleDateSelect).toHaveBeenCalled();
  });

  it('タスク数バッジが表示される', () => {
    render(<MiniCalendar taskCounts={[{ date: '2025-05-04', count: 3 }]} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
