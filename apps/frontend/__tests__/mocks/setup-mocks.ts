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

vi.mock('../../components/ui/dialog', () => ({
  Dialog: UIComponents.Dialog,
  DialogContent: UIComponents.DialogContent,
  DialogHeader: UIComponents.DialogHeader,
  DialogTitle: UIComponents.DialogTitle,
  DialogFooter: UIComponents.DialogFooter,
  DialogDescription: UIComponents.DialogDescription
}));

vi.mock('../../components/ui/alert-dialog', () => ({
  AlertDialog: UIComponents.AlertDialog,
  AlertDialogContent: UIComponents.AlertDialogContent,
  AlertDialogHeader: UIComponents.AlertDialogHeader,
  AlertDialogTitle: UIComponents.AlertDialogTitle,
  AlertDialogDescription: UIComponents.AlertDialogDescription,
  AlertDialogFooter: UIComponents.AlertDialogFooter,
  AlertDialogAction: UIComponents.AlertDialogAction,
  AlertDialogCancel: UIComponents.AlertDialogCancel
}));

vi.mock('../../components/ui/textarea', () => ({
  Textarea: UIComponents.Textarea
}));

vi.mock('../../components/ui/input', () => ({
  Input: UIComponents.Input
}));

vi.mock('../../lib/utils', () => ({
  cn: UIComponents.cn
}));

// Lucide Reactアイコンのモック
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    Plus: UIComponents.Plus,
    CalendarIcon: UIComponents.CalendarIcon,
    GripVertical: UIComponents.GripVertical,
    UserIcon: UIComponents.UserIcon,
    ChevronLeft: UIComponents.ChevronLeft,
    ChevronRight: UIComponents.ChevronRight,
    X: UIComponents.X,
    Pencil: UIComponents.Plus, // Pencilの代わりにPlusを使用
    Check: UIComponents.Plus, // Checkの代わりにPlusを使用
    Trash: UIComponents.X, // Trashの代わりにXを使用
  };
});

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
vi.mock('@dnd-kit/core', () => ({
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
  closestCenter: vi.fn(),
  pointerWithin: vi.fn(),
  rectIntersection: vi.fn(),
}));

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
  }),
  sortableKeyboardCoordinates: vi.fn(() => ({ x: 0, y: 0 })),
  arrayMove: vi.fn((array) => array),
  horizontalListSortingStrategy: {},
  verticalListSortingStrategy: {}
}));
