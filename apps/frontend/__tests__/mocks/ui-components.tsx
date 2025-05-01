import React, { forwardRef } from 'react';

// UIコンポーネントのモック
// Commandコンポーネントのモック
export const Command = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-command" className={className}>
    {children}
  </div>
);

export const CommandInput = ({ placeholder, className }: { placeholder?: string, className?: string }) => (
  <input data-testid="mock-command-input" placeholder={placeholder} className={className} />
);

export const CommandEmpty = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-command-empty">{children}</div>
);

export const CommandGroup = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-command-group">{children}</div>
);

export const CommandItem = ({ children, value, onSelect }: { children: React.ReactNode, value?: string, onSelect?: () => void }) => (
  <div data-testid="mock-command-item" data-value={value} onClick={onSelect}>
    {children}
  </div>
);

export const Check = ({ className }: { className?: string }) => (
  <span data-testid="icon-check" className={className}>✓</span>
);

export const ChevronsUpDown = ({ className }: { className?: string }) => (
  <span data-testid="icon-chevrons-updown" className={className}>⇅</span>
);
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

// Dialogコンポーネントのモック
export const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => (
  <div data-testid="mock-dialog" data-open={open}>
    {children}
  </div>
);

export const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-dialog-content" className={className}>
    {children}
  </div>
);

export const DialogHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-dialog-header" className={className}>
    {children}
  </div>
);

export const DialogTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-dialog-title" className={className}>
    {children}
  </div>
);

export const DialogFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-dialog-footer" className={className}>
    {children}
  </div>
);

export const DialogDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-dialog-description" className={className}>
    {children}
  </div>
);

// AlertDialogコンポーネントのモック
export const AlertDialog = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => (
  <div data-testid="mock-alert-dialog" data-open={open}>
    {children}
  </div>
);

export const AlertDialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-alert-dialog-content" className={className}>
    {children}
  </div>
);

export const AlertDialogHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-alert-dialog-header" className={className}>
    {children}
  </div>
);

export const AlertDialogTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-alert-dialog-title" className={className}>
    {children}
  </div>
);

export const AlertDialogDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-alert-dialog-description" className={className}>
    {children}
  </div>
);

export const AlertDialogFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-testid="mock-alert-dialog-footer" className={className}>
    {children}
  </div>
);

export const AlertDialogAction = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <button data-testid="mock-alert-dialog-action" className={className} onClick={onClick}>
    {children}
  </button>
);

export const AlertDialogCancel = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <button data-testid="mock-alert-dialog-cancel" className={className} onClick={onClick}>
    {children}
  </button>
);

// Textareaコンポーネントのモック
export const Textarea = forwardRef<HTMLTextAreaElement, any>(({ className, value, onChange, placeholder, rows }, ref) => (
  <textarea
    ref={ref}
    className={className}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    data-testid="mock-textarea"
  />
));

// Inputコンポーネントのモック
export const Input = forwardRef<HTMLInputElement, any>(({ className, value, onChange, placeholder }, ref) => (
  <input
    ref={ref}
    className={className}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    data-testid="mock-input"
  />
));
