import React, { forwardRef } from 'react';

// UIコンポーネントのモック
export const Calendar = forwardRef<HTMLDivElement, any>(({ onSelect, selected }, ref) => (
  <div data-testid="mock-calendar" ref={ref}>
    <button onClick={() => onSelect && onSelect(new Date())}>日付を選択</button>
  </div>
));

export const Button = forwardRef<HTMLButtonElement, any>(({ children, onClick, className, variant, size }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={className}
    data-variant={variant}
    data-size={size}
    data-testid="mock-button"
  >
    {children}
  </button>
));

export const Badge = ({ children, variant }: { children: React.ReactNode, variant?: string }) => (
  <span data-testid="mock-badge" data-variant={variant}>
    {children}
  </span>
);

export const Popover = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => (
  <div data-testid="mock-popover" data-open={open}>
    {children}
  </div>
);

export const PopoverTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => (
  <div data-testid="mock-popover-trigger" data-as-child={asChild}>
    {children}
  </div>
);

export const PopoverContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-popover-content" className={className}>
    {children}
  </div>
);

export const Card = forwardRef<HTMLDivElement, any>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="mock-card" {...props}>
    {children}
  </div>
));

export const AnimatedList = ({ children, staggerDelay, className }: { children: React.ReactNode, staggerDelay?: number, className?: string }) => (
  <div data-testid="mock-animated-list" data-stagger-delay={staggerDelay} className={className}>
    {children}
  </div>
);

export const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-fade-in">{children}</div>
);

// ユーティリティ関数のモック
export const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

// Lucide Reactアイコンのモック
export const Plus = () => <span data-testid="icon-plus">+</span>;
export const CalendarIcon = () => <span data-testid="icon-calendar">📅</span>;
export const GripVertical = () => <span data-testid="icon-grip">⋮</span>;
export const UserIcon = () => <span data-testid="icon-user">👤</span>;
export const ChevronLeft = () => <span data-testid="icon-chevron-left">←</span>;
export const ChevronRight = () => <span data-testid="icon-chevron-right">→</span>;
export const X = () => <span data-testid="icon-x">✕</span>;

// DayPickerのモック
export const DayPicker = ({ selected, onSelect, locale }: any) => (
  <div data-testid="day-picker">
    <div>カレンダー（モック）</div>
    <button onClick={() => onSelect && onSelect(new Date())}>日付を選択</button>
  </div>
);
