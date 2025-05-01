import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPriority(priority: string): string {
  const priorityMap: { [key: string]: string } = {
    low: '低',
    medium: '中',
    high: '高',
  };
  return priorityMap[priority] || priority;
}

export function formatStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    todo: '未着手',
    in_progress: '進行中',
    done: '完了',
  };
  return statusMap[status] || status;
} 