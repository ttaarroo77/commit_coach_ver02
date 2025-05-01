import { vi } from 'vitest';
import React from 'react';
import * as UIComponents from './ui-components';

// UIコンポーネントのモック設定
vi.mock('../../components/ui/calendar', () => ({
  Calendar: UIComponents.Calendar
}));

vi.mock('../../components/ui/button', () => ({
  Button: UIComponents.Button
}));

vi.mock('../../components/ui/badge', () => ({
  Badge: UIComponents.Badge
}));

vi.mock('../../components/ui/popover', () => ({
  Popover: UIComponents.Popover,
  PopoverTrigger: UIComponents.PopoverTrigger,
  PopoverContent: UIComponents.PopoverContent
}));

vi.mock('../../components/ui/card', () => ({
  Card: UIComponents.Card
}));

vi.mock('../../lib/utils', () => ({
  cn: UIComponents.cn
}));

// Lucide Reactアイコンのモック
vi.mock('lucide-react', () => ({
  Plus: UIComponents.Plus,
  CalendarIcon: UIComponents.CalendarIcon,
  GripVertical: UIComponents.GripVertical,
  UserIcon: UIComponents.UserIcon,
  ChevronLeft: UIComponents.ChevronLeft,
  ChevronRight: UIComponents.ChevronRight,
  X: UIComponents.X
}));

// react-day-pickerのモック
vi.mock('react-day-picker', () => ({
  DayPicker: UIComponents.DayPicker
}));

// date-fnsのモック
vi.mock('date-fns', () => ({
  format: (date: Date, format: string) => '2025/05/01',
  isToday: () => true,
  addDays: (date: Date, days: number) => new Date(),
  isBefore: () => false,
  isAfter: () => false
}));

vi.mock('date-fns/locale', () => ({
  ja: {}
}));

// DnD関連のモック
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual,
    DndContext: ({ children }: { children: React.ReactNode }) => {
      return React.createElement('div', { 'data-testid': 'dnd-context' }, children);
    },
    DragOverlay: ({ children }: { children: React.ReactNode }) => {
      return React.createElement('div', { 'data-testid': 'drag-overlay' }, children);
    },
    useSensors: vi.fn(() => ({})),
    useSensor: vi.fn(),
    PointerSensor: vi.fn(),
    KeyboardSensor: vi.fn(),
  };
});

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'sortable-context' }, children);
  },
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false
  })
}));
